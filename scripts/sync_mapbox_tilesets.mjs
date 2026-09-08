import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const token = process.env.MAPBOX_ACCESS_TOKEN;
if (!token) throw new Error('MAPBOX_ACCESS_TOKEN is not available.');

const username = 'strange1989';
const existing = [
  { id: 'strange1989.k7sgtzdhwl42', sourceId: '5c5d6157b5', layerId: '92a301efdab2e0544d5e', file: 'cinema_operations.geojson' },
  { id: 'strange1989.bz0cuqrwxaee', sourceId: 'd1ddcd27c5', layerId: '584d3d6339eb7d64f78d', file: 'cinema_sites.geojson' },
  { id: 'strange1989.0oxt98o5dqfe', sourceId: 'e6605c9385', layerId: 'fdcb78ae177016b95d2c', file: 'cinema_continuity_cases.geojson' },
];
const current = {
  id: 'strange1989.current_exhibition_spaces',
  sourceId: 'current_exhibition_spaces_source',
  layerId: 'current_exhibition_spaces',
  file: 'current_exhibition_spaces.geojson',
  name: 'current_exhibition_spaces',
};

const endpoint = (relative) => `https://api.mapbox.com/tilesets/v1/${relative}${relative.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(token)}`;
async function request(relative, options = {}) {
  const response = await fetch(endpoint(relative), options);
  const body = await response.text();
  if (!response.ok) throw new Error(`${options.method ?? 'GET'} ${relative}: HTTP ${response.status} ${body}`);
  return body ? JSON.parse(body) : null;
}
async function ldGeoJson(file) {
  const collection = JSON.parse(await readFile(new URL(`data/mapbox/${file}`, root), 'utf8'));
  if (collection.type !== 'FeatureCollection') throw new Error(`${file} is not a FeatureCollection.`);
  return collection.features.map((feature) => JSON.stringify(feature)).join('\n');
}
async function replaceSource(sourceId, file) {
  const data = await ldGeoJson(file);
  const form = new FormData();
  form.append('file', new Blob([data], { type: 'application/geo+json' }), `${file}.ldgeojson`);
  return request(`sources/${username}/${sourceId}`, { method: 'PUT', body: form });
}
function recipe(sourceId, layerId) {
  return {
    version: 1,
    layers: {
      [layerId]: {
        source: `mapbox://tileset-source/${username}/${sourceId}`,
        minzoom: 0,
        maxzoom: 12,
        features: { simplification: 1 },
      },
    },
  };
}
async function validateRecipe(value) {
  return request('validateRecipe', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  });
}

const currentMetadata = await request(current.id).catch((error) => {
  if (String(error.message).includes('HTTP 404')) return null;
  throw error;
});
if (currentMetadata) throw new Error(`${current.id} already exists; refusing to create a duplicate tileset.`);

for (const item of existing) {
  const validation = await validateRecipe(recipe(item.sourceId, item.layerId));
  if (validation?.valid !== true) throw new Error(`Recipe validation failed for ${item.id}: ${JSON.stringify(validation)}`);
}

const sourceResults = [];
sourceResults.push({ id: current.id, ...(await replaceSource(current.sourceId, current.file)) });
const currentValidation = await validateRecipe(recipe(current.sourceId, current.layerId));
if (currentValidation?.valid !== true) throw new Error(`Recipe validation failed for ${current.id}: ${JSON.stringify(currentValidation)}`);
for (const item of existing) sourceResults.push({ id: item.id, ...(await replaceSource(item.sourceId, item.file)) });

await request(current.id, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ recipe: recipe(current.sourceId, current.layerId), name: current.name, private: true }),
});

const jobs = [];
for (const item of [...existing, current]) jobs.push({ id: item.id, ...(await request(`${item.id}/publish`, { method: 'POST' })) });

console.log(JSON.stringify({ sourceResults, jobs, current }, null, 2));
