#!/usr/bin/env node
// Bake basin geometry for the spine (M1).
//   node scripts/etl/fetch-geometry.mjs
// Sources (fetched live, filtered, committed as baked output only):
//  - USGS WBD HUC2 regions 14+15 (hydro.nationalmap.gov ArcGIS, geojson)
//  - Natural Earth 10m rivers + lakes (nvkelso/natural-earth-vector, geojson)
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const out = join(root, 'data', 'geometry');
mkdirSync(out, { recursive: true });

const get = async (url) => {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
      if (r.ok) return r.json();
    } catch {}
    await new Promise((res) => setTimeout(res, 3000));
  }
  throw new Error(`failed: ${url}`);
};

const BBOX = [-120, 29, -104, 44];
const inbox = (coords) => {
  const stack = [coords];
  while (stack.length) {
    const c = stack.pop();
    if (typeof c[0] === 'number') {
      if (c[0] >= BBOX[0] && c[0] <= BBOX[2] && c[1] >= BBOX[1] && c[1] <= BBOX[3]) return true;
    } else stack.push(...c);
  }
  return false;
};
const round = (coords) => typeof coords[0] === 'number'
  ? [Math.round(coords[0] * 1e3) / 1e3, Math.round(coords[1] * 1e3) / 1e3]
  : coords.map(round);
const centroid = (g) => {
  let sx = 0, sy = 0, n = 0;
  const walk = (c) => { if (typeof c[0] === 'number') { sx += c[0]; sy += c[1]; n++; } else c.forEach(walk); };
  walk(g.coordinates);
  return [sx / n, sy / n].map((v) => Math.round(v * 1e3) / 1e3);
};

const basin = await get("https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/1/query?where=huc2+IN+('14','15')&outFields=huc2,name&f=geojson&geometryPrecision=3&maxAllowableOffset=0.01");
if (basin.features.length !== 2) throw new Error('expected 2 HUC2 regions');

const rivers = await get('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_rivers_lake_centerlines.geojson');
const WANT = new Set(['Colorado', 'Green', 'Gila', 'San Juan', 'Little Colorado', 'Virgin', 'Gunnison', 'Yampa', 'Dolores']);
const keptRivers = rivers.features
  .filter((f) => WANT.has(f.properties.name) && inbox(f.geometry.coordinates))
  .map((f) => ({ type: 'Feature', properties: { name: f.properties.name },
    geometry: { ...f.geometry, coordinates: round(f.geometry.coordinates) } }));
if (!keptRivers.some((f) => f.properties.name === 'Colorado')) throw new Error('no Colorado mainstem');

const lakes = await get('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson');
const LNAMES = new Set(['Lake Mead', 'Lake Powell', 'Lake Mohave', 'Lake Havasu']);
const keptLakes = lakes.features
  .filter((f) => LNAMES.has(f.properties.name))
  .map((f) => ({ type: 'Feature',
    properties: { name: f.properties.name, centroid: centroid(f.geometry) },
    geometry: { ...f.geometry, coordinates: round(f.geometry.coordinates) } }));
if (keptLakes.length < 2) throw new Error('missing Mead/Powell polygons');

const meta = { provenance: {
  basin: 'USGS WBD HUC2 14+15, hydro.nationalmap.gov (simplified 0.01deg)',
  rivers: 'Natural Earth 10m rivers_lake_centerlines (public domain), filtered to basin',
  lakes: 'Natural Earth 10m lakes (public domain), filtered',
  generatedBy: 'scripts/etl/fetch-geometry.mjs',
} };
writeFileSync(join(out, 'basin.json'), JSON.stringify({ ...meta, ...basin }));
writeFileSync(join(out, 'rivers.json'), JSON.stringify({ type: 'FeatureCollection', features: keptRivers }));
writeFileSync(join(out, 'lakes.json'), JSON.stringify({ type: 'FeatureCollection', features: keptLakes }));
console.log(`ok: basin(2) rivers(${keptRivers.length}) lakes(${keptLakes.length}) -> data/geometry/`);
