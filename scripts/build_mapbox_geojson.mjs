import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const path = (relative) => new URL(relative, root);

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += char;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  const [headers, ...data] = rows;
  return data.filter((values) => values.some((value) => value !== '')).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

const clean = (value) => (value ?? '').trim();
const nullable = (value) => clean(value) || null;
const numberOrNull = (value) => {
  const normalised = clean(value);
  if (!normalised) return null;
  const parsed = Number(normalised);
  return Number.isFinite(parsed) ? parsed : null;
};
const boolCurrent = (value) => ['open', 'current', 'active'].includes(clean(value).toLowerCase());
const sourceIds = (record, preferredField) => {
  const preferred = clean(record?.[preferredField]);
  if (/SRC-\d+/i.test(preferred)) return preferred;
  const found = [...new Set(Object.values(record ?? {}).flatMap((value) => String(value).match(/SRC-\d+/gi) ?? []))];
  return found.length ? found.join(';') : null;
};

function openingPeriod(year) {
  if (!Number.isFinite(year)) return 'unknown';
  if (year < 1950) return '1930–1949';
  if (year < 1970) return '1950–1969';
  if (year < 1990) return '1970–1989';
  if (year < 2010) return '1990–2009';
  return '2010–present';
}

function venueType(value) {
  const normalised = clean(value).toLowerCase();
  const mappings = {
    standalone_cinema: ['standalone', 'Standalone cinema'],
    mall_integrated_cinema: ['mall', 'Mall-integrated cinema'],
    mixed_use_cinema_complex: ['mixed', 'Mixed-use cinema complex'],
    community_new_town_commercial_centre: ['community', 'Community / new-town commercial centre'],
  };
  for (const [key, [needle, display]] of Object.entries(mappings)) {
    if (normalised.includes(needle)) return { key, display };
  }
  return { key: 'other_or_unknown', display: 'Other / not classified' };
}

function point(longitude, latitude) {
  return { type: 'Point', coordinates: [longitude, latitude] };
}

function feature(properties, longitude, latitude) {
  return { type: 'Feature', properties, geometry: point(longitude, latitude) };
}

async function csv(relative) {
  return parseCsv(await readFile(path(relative), 'utf8'));
}

const operations = await csv('data/processed/operations.csv');
const sites = await csv('data/processed/sites.csv');
const spatialOperations = await csv('data/processed/spatial_operations.csv');
const spatialSites = await csv('data/processed/spatial_sites.csv');
const continuityCases = await csv('data/processed/continuity_cases.csv');
const currentSpaces = await csv('data/processed/current_exhibition_spaces.csv');

let existingOperationFocus = new Map();
try {
  const existing = JSON.parse(await readFile(path('data/mapbox/cinema_operations.geojson'), 'utf8'));
  existingOperationFocus = new Map(existing.features.map((item) => [item.properties.operation_id, item.properties.new_town_focus]));
} catch { /* First export: established values simply remain unset. */ }

const operationById = new Map(operations.map((item) => [item.record_id, item]));
const siteById = new Map(sites.map((item) => [item.site_id, item]));
const spatialSiteById = new Map(spatialSites.map((item) => [item.site_id, item]));
const caseBySite = new Map(continuityCases.map((item) => [item.site_id, item]));
const operationsBySite = new Map();
for (const operation of operations) {
  const existing = operationsBySite.get(operation.site_id) ?? [];
  existing.push(operation);
  operationsBySite.set(operation.site_id, existing);
}

const operationFeatures = spatialOperations.map((spatial) => {
  const operation = operationById.get(spatial.record_id);
  const site = siteById.get(spatial.site_id);
  if (!operation || !site) throw new Error(`Missing master record for ${spatial.record_id}`);
  const openingYear = numberOrNull(operation.opening_year);
  const classification = venueType(operation.venue_type);
  return feature({
    operation_id: operation.record_id,
    site_id: operation.site_id,
    cinema_name: operation.name,
    alternate_names: nullable(operation.alternate_names),
    opening_year: openingYear,
    opening_period: openingPeriod(openingYear),
    closing_year: numberOrNull(operation.closing_year),
    operation_status: nullable(operation.operation_status),
    operator: nullable(operation.operator) === 'unknown' ? null : nullable(operation.operator),
    venue_type: classification.key,
    venue_type_display: classification.display,
    mall_based: nullable(operation.mall_based),
    mall_name: nullable(operation.mall_name),
    new_town_focus: existingOperationFocus.get(operation.record_id) ?? 'none',
    geocode_confidence: nullable(spatial.site_geocode_confidence),
    site_address: nullable(site.canonical_address),
    operation_source_ids: sourceIds(operation, 'operation_source_ids'),
    site_source_ids: sourceIds(site, 'site_source_ids'),
  }, numberOrNull(spatial.site_longitude), numberOrNull(spatial.site_latitude));
});

const siteFeatures = spatialSites.map((spatial) => {
  const site = siteById.get(spatial.site_id);
  if (!site) throw new Error(`Missing master site ${spatial.site_id}`);
  const linked = operationsBySite.get(site.site_id) ?? [];
  const years = linked.map((item) => numberOrNull(item.opening_year)).filter(Number.isFinite);
  const names = [...new Set(linked.map((item) => clean(item.name)).filter(Boolean))];
  const continuity = caseBySite.get(site.site_id);
  return feature({
    site_id: site.site_id,
    site_name: nullable(site.address_variants)?.split(';')[0]?.trim() ?? nullable(site.canonical_address),
    address: nullable(site.canonical_address),
    historical_address: nullable(site.historical_address),
    modern_geocoding_address: nullable(site.modern_geocoding_address),
    documented_operations_per_site: linked.length,
    earliest_verified_opening_year: years.length ? Math.min(...years) : null,
    latest_verified_opening_year: years.length ? Math.max(...years) : null,
    operation_names_summary: names.join('; '),
    current_operation_present: linked.some((item) => boolCurrent(item.operation_status)) ? 'yes' : 'no',
    geocode_confidence: nullable(spatial.geocode_confidence),
    continuity_case: continuity ? 'yes' : 'no',
    continuity_note: nullable(continuity?.continuity_note),
    site_source_ids: sourceIds(site, 'site_source_ids'),
    address_source_ids: sourceIds(site, 'address_source_ids'),
  }, numberOrNull(spatial.longitude), numberOrNull(spatial.latitude));
});

const continuityFeatures = continuityCases.map((continuity) => {
  const spatial = spatialSiteById.get(continuity.site_id);
  if (!spatial) throw new Error(`Continuity case ${continuity.case_id} has no spatial site`);
  return feature({
    case_id: continuity.case_id,
    site_id: continuity.site_id,
    site_address: nullable(continuity.site_address),
    operation_sequence: nullable(continuity.operation_sequence),
    documented_operations_per_site: numberOrNull(continuity.documented_operations_per_site),
    earliest_verified_opening_year: numberOrNull(continuity.earliest_verified_opening_year),
    latest_verified_opening_year: numberOrNull(continuity.latest_verified_opening_year),
    operators: nullable(continuity.operators),
    venue_type_sequence: nullable(continuity.venue_type_sequence),
    continuity_note: nullable(continuity.continuity_note),
    geocode_confidence: nullable(continuity.geocode_confidence),
    case_priority: nullable(continuity.case_priority),
    current_operation_present: nullable(continuity.current_operation_present),
    source_ids: sourceIds(continuity, 'source_ids'),
  }, numberOrNull(spatial.longitude), numberOrNull(spatial.latitude));
});

const currentFeatures = currentSpaces
  .filter((space) => clean(space.map_include).toLowerCase() === 'yes')
  .map((space) => feature({
    space_id: space.space_id,
    name: space.name,
    operator_or_institution: nullable(space.operator_or_institution),
    category: space.category,
    address: space.address,
    postal_code: nullable(space.postal_code),
    current_status: nullable(space.current_status),
    screening_pattern: nullable(space.screening_pattern),
    programme_type: nullable(space.programme_type),
    commercial_or_curated_note: nullable(space.commercial_or_curated_note),
    site_or_building_note: nullable(space.site_or_building_note),
    source_primary: nullable(space.source_primary),
    source_secondary: nullable(space.source_secondary),
    source_tier: numberOrNull(space.source_tier),
    verified_date: nullable(space.verified_date),
    address_confidence: nullable(space.address_confidence),
    geocode_confidence: nullable(space.geocode_confidence),
    map_include: nullable(space.map_include),
    mapbox_returned_address: nullable(space.mapbox_returned_address),
    mapbox_match_type: nullable(space.mapbox_match_type),
    geocode_mismatch_note: nullable(space.geocode_mismatch_note),
    notes: nullable(space.notes),
  }, numberOrNull(space.longitude), numberOrNull(space.latitude)));

const outputs = {
  'data/mapbox/cinema_operations.geojson': operationFeatures,
  'data/mapbox/cinema_sites.geojson': siteFeatures,
  'data/mapbox/cinema_continuity_cases.geojson': continuityFeatures,
  'data/mapbox/current_exhibition_spaces.geojson': currentFeatures,
};

for (const [relative, features] of Object.entries(outputs)) {
  const collection = { type: 'FeatureCollection', features };
  await writeFile(path(relative), `${JSON.stringify(collection, null, 2)}\n`, 'utf8');
  console.log(`${relative}: ${features.length} features`);
}
