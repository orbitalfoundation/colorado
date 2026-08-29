#!/usr/bin/env node
// Bake the great diversions (M4): canal/aqueduct geometry from OSM Overpass.
//   node scripts/etl/fetch-canals.mjs
// Raw response cached in reference/osm/canals-overpass.json (ODbL,
// © OpenStreetMap contributors); baked to data/geometry/canals.json with
// segments grouped under canonical names.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const cache = join(root, 'reference', 'osm', 'canals-overpass.json');
mkdirSync(dirname(cache), { recursive: true });

const QUERY = `[out:json][timeout:90];
(
  way["waterway"="canal"]["name"~"All.American Canal|Central Arizona Project|Colorado River Aqueduct|Coachella Canal",i](31.0,-118.5,37.5,-108.5);
);
out geom;`;

async function fetchRaw() {
  for (const host of ['https://overpass-api.de', 'https://overpass.kumi.systems']) {
    try {
      const r = await fetch(`${host}/api/interpreter`, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(QUERY)}`,
      });
      if (r.ok) {
        const t = await r.text();
        if (t.trimStart().startsWith('{')) { writeFileSync(cache, t); return JSON.parse(t); }
      }
    } catch {}
  }
  if (existsSync(cache)) { console.log('(fetch failed, using cached raw)'); return JSON.parse(readFileSync(cache, 'utf8')); }
  throw new Error('overpass failed and no cache');
}

const canonical = (name) => {
  if (/all.american/i.test(name)) return 'All-American Canal';
  if (/central arizona/i.test(name)) return 'Central Arizona Project';
  if (/coachella/i.test(name)) return 'Coachella Canal';
  if (/colorado river aqueduct/i.test(name)) return 'Colorado River Aqueduct';
  return null;
};

const raw = await fetchRaw();
const features = [];
const counts = {};
for (const e of raw.elements ?? []) {
  if (e.type !== 'way' || !e.geometry) continue;
  const name = canonical(e.tags?.name ?? '');
  if (!name) continue;
  features.push({ type: 'Feature', properties: { name },
    geometry: { type: 'LineString',
      coordinates: e.geometry.map((p) => [Math.round(p.lon * 1e3) / 1e3, Math.round(p.lat * 1e3) / 1e3]) } });
  counts[name] = (counts[name] ?? 0) + 1;
}
if (!counts['Central Arizona Project'] || !counts['All-American Canal'])
  throw new Error(`missing a major canal: ${JSON.stringify(counts)}`);

writeFileSync(join(root, 'data', 'geometry', 'canals.json'), JSON.stringify({
  provenance: {
    source: 'OpenStreetMap via Overpass (waterway=canal), ODbL © OpenStreetMap contributors',
    generatedBy: 'scripts/etl/fetch-canals.mjs',
  },
  type: 'FeatureCollection', features,
}));
console.log('ok: data/geometry/canals.json', counts);
