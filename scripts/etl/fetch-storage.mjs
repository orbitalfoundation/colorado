#!/usr/bin/env node
// Bake the observed reservoir storage record (M1 spine, left of the seam).
//   node scripts/etl/fetch-storage.mjs
// Source: Reclamation UC hydrodata daily storage CSVs
//   https://www.usbr.gov/uc/water/hydrodata/reservoir_data/<site>/csv/17.csv
// Sites: 921 Lake Mead (record from 1937), 919 Lake Powell (from 1963).
// Output: data/storage.json — month-start series in AF, plus combined.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITES = { mead: 921, powell: 919 };

async function fetchCsv(site) {
  // usbr.gov is intermittent; raw CSVs are cached in reference/usbr/ and
  // refreshed whenever a live fetch succeeds.
  const cache = join(root, 'reference', 'usbr', `hydrodata-${site}-storage.csv`);
  const url = `https://www.usbr.gov/uc/water/hydrodata/reservoir_data/${site}/csv/17.csv`;
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
      if (r.ok) { const t = await r.text(); writeFileSync(cache, t); return t; }
    } catch {}
    await new Promise((res) => setTimeout(res, 3000));
  }
  if (existsSync(cache)) { console.log(`(fetch failed, using cached ${cache})`); return readFileSync(cache, 'utf8'); }
  throw new Error(`failed: ${url}`);
}

const monthly = {};
for (const [name, site] of Object.entries(SITES)) {
  const rows = (await fetchCsv(site)).trim().split('\n').slice(1);
  const series = {};
  for (const row of rows) {
    const [date, v] = row.split(',');
    if (date?.endsWith('-01') === false) continue; // month starts only
    const af = Number(v);
    if (Number.isFinite(af)) series[date.slice(0, 7)] = Math.round(af);
  }
  monthly[name] = series;
  const months = Object.keys(series);
  console.log(`${name}: ${months.length} months, ${months[0]} .. ${months.at(-1)}`);
}

const months = Object.keys(monthly.mead).filter((m) => m >= '1906-01').sort();
const combined = Object.fromEntries(months.map((m) =>
  [m, (monthly.mead[m] ?? 0) + (monthly.powell[m] ?? 0)]));

const last = months.at(-1);
const out = {
  provenance: {
    source: 'Reclamation UC hydrodata daily storage (datatype 17), month-start samples',
    sites: { mead: 921, powell: 919 },
    url: 'https://www.usbr.gov/uc/water/hydrodata/',
    units: 'acre-feet',
    generatedBy: 'scripts/etl/fetch-storage.mjs',
  },
  mead: monthly.mead, powell: monthly.powell, combined,
  latest: { month: last, mead: monthly.mead[last], powell: monthly.powell[last] ?? 0,
    combined: combined[last] },
};
// sanity: today's combined should be ~12 MAF (observed Aug 2026)
if (out.latest.combined < 9e6 || out.latest.combined > 16e6)
  throw new Error(`combined ${out.latest.combined} outside sanity band`);
writeFileSync(join(root, 'data', 'storage.json'), JSON.stringify(out));
console.log(`ok: data/storage.json  latest ${last}: mead ${(out.latest.mead / 1e6).toFixed(2)} + powell ${(out.latest.powell / 1e6).toFixed(2)} = ${(out.latest.combined / 1e6).toFixed(2)} MAF`);
