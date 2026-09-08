import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const files = [
  ['cinema_operations.geojson', 'operation_id'],
  ['cinema_sites.geojson', 'site_id'],
  ['cinema_continuity_cases.geojson', 'case_id'],
  ['current_exhibition_spaces.geojson', 'space_id'],
];

for (const [file, idField] of files) {
  const collection = JSON.parse(await readFile(new URL(`data/mapbox/${file}`, root), 'utf8'));
  if (collection.type !== 'FeatureCollection' || !Array.isArray(collection.features)) throw new Error(`${file}: not a FeatureCollection`);
  const ids = new Set();
  for (const item of collection.features) {
    if (item.type !== 'Feature' || item.geometry?.type !== 'Point') throw new Error(`${file}: non-Point feature`);
    const [longitude, latitude] = item.geometry.coordinates ?? [];
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) throw new Error(`${file}: non-numeric coordinate`);
    if (longitude < 103.6 || longitude > 104.1 || latitude < 1.15 || latitude > 1.5) throw new Error(`${file}: coordinate outside Singapore sanity bounds`);
    const id = item.properties?.[idField];
    if (!id || ids.has(id)) throw new Error(`${file}: duplicate or blank ${idField}`);
    ids.add(id);
  }
  console.log(`${file}: valid FeatureCollection; ${collection.features.length} Point features; ${idField}s unique`);
}

const operations = JSON.parse(await readFile(new URL('data/mapbox/cinema_operations.geojson', root), 'utf8'));
for (const item of operations.features) {
  for (const field of ['opening_year', 'closing_year']) {
    const value = item.properties[field];
    if (value !== null && typeof value !== 'number') throw new Error(`cinema_operations.geojson: ${field} must be numeric or null`);
  }
}
const sites = JSON.parse(await readFile(new URL('data/mapbox/cinema_sites.geojson', root), 'utf8'));
for (const item of sites.features) {
  for (const field of ['documented_operations_per_site', 'earliest_verified_opening_year', 'latest_verified_opening_year']) {
    const value = item.properties[field];
    if (value !== null && typeof value !== 'number') throw new Error(`cinema_sites.geojson: ${field} must be numeric or null`);
  }
}
console.log('Property-type checks passed.');
