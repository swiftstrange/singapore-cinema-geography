const token = process.env.MAPBOX_ACCESS_TOKEN;
if (!token) throw new Error('MAPBOX_ACCESS_TOKEN is not available.');

const owner = 'strange1989';
const styleId = 'cmtq74ywn00g801r2gri5d7v0';
const styleUrl = `https://api.mapbox.com/styles/v1/${owner}/${styleId}/draft?access_token=${encodeURIComponent(token)}`;
const live = await fetch(styleUrl);
if (!live.ok) throw new Error(`Unable to retrieve live style: HTTP ${live.status} ${await live.text()}`);
const current = await live.json();

const existingIds = current.layers.map((layer) => layer.id);
const expected = [
  '01_operations_opening_year',
  '02_operations_venue_type',
  '03_operations_highlight',
  '04_sites_operation_count',
  '05_continuity_cases',
  '06_case_highlight',
];
if (expected.some((id) => !existingIds.includes(id))) throw new Error('Live style is missing one or more approved historical custom layers.');
if (existingIds.includes('07_current_exhibition_spaces')) throw new Error('The current-exhibition skeleton already exists; refusing to duplicate it.');

const style = { version: current.version, sources: { ...current.sources }, layers: [...current.layers] };
for (const key of ['name', 'metadata', 'center', 'zoom', 'bearing', 'pitch', 'light', 'lights', 'terrain', 'fog', 'projection', 'transition', 'sprite', 'glyphs', 'imports']) {
  if (current[key] !== undefined && current[key] !== null) style[key] = current[key];
}
style.owner = owner;
style.draft = true;
style.sources['mapbox://strange1989.current_exhibition_spaces'] = {
  type: 'vector',
  url: 'mapbox://strange1989.current_exhibition_spaces',
};
style.layers.push({
  id: '07_current_exhibition_spaces',
  type: 'circle',
  source: 'mapbox://strange1989.current_exhibition_spaces',
  'source-layer': 'current_exhibition_spaces',
  layout: { visibility: 'none' },
  paint: { 'circle-radius': 4, 'circle-color': '#6B6B6B', 'circle-opacity': 0.7 },
});

const update = await fetch(styleUrl, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(style),
});
const updateText = await update.text();
console.log(`Style PATCH response: HTTP ${update.status} ${updateText}`);
if (!update.ok) throw new Error(`Style update failed: HTTP ${update.status} ${updateText}`);

const verifiedResponse = await fetch(styleUrl);
if (!verifiedResponse.ok) throw new Error(`Updated-style verification failed: HTTP ${verifiedResponse.status} ${await verifiedResponse.text()}`);
const verified = await verifiedResponse.json();
const layer = verified.layers.find((item) => item.id === '07_current_exhibition_spaces');
if (!layer || layer.source !== 'mapbox://strange1989.current_exhibition_spaces' || layer['source-layer'] !== 'current_exhibition_spaces' || layer.layout?.visibility !== 'none') {
  throw new Error('Live style verification did not find the approved hidden current-exhibition skeleton.');
}
console.log(JSON.stringify({
  styleId: verified.id,
  visibility: verified.visibility,
  sourceCount: Object.keys(verified.sources).length,
  layerIds: verified.layers.map((item) => item.id),
  layer07: layer,
}, null, 2));
