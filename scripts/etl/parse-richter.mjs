#!/usr/bin/env node
// Parse the Richter et al. 2024 HydroShare tables into versioned JSON.
//
//   node scripts/etl/parse-richter.mjs
//
// Inputs  (committed primary sources, do not edit):
//   reference/richter2024/hydroshare/data/contents/Sectoral_Water_Consumption.txt
//   reference/richter2024/hydroshare/data/contents/Interannual_Variability.txt
// Output:
//   data/richter2024.json
//
// Units: the sectoral table and the "METRIC" block of the interannual table
// are million cubic meters per year (MCM/yr) — per the footnote on Table 1 of
// the paper (doi:10.1038/s43247-024-01291-0). The top block of the
// interannual table is acre-feet per year. Averages are 2000-2019.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = (f) => join(root, 'reference', 'richter2024', 'hydroshare', 'data', 'contents', f);

const num = (s) => {
  if (s === undefined) return null;
  const t = s.replaceAll('"', '').replaceAll(',', '').trim();
  if (t === '') return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
};

// ---- Sectoral_Water_Consumption.txt ---------------------------------------
// Layout: col0 = sector label (top-level rows), col1 = crop label (indented
// rows), then 11 accounting units each contributing (value, pct) column pairs
// except MEXICO - EXPORTS' neighbours which are simply empty where a unit has
// no entry. We address columns by fixed offsets measured from the header row.

const UNITS = [
  'upperBasin', 'upperBasinExports', 'upperBasinTotal',
  'lowerBasinWithoutGila', 'lowerBasinExports', 'lowerBasinTotal',
  'gilaBasin', 'mexico', 'mexicoExports', 'mexicoTotal', 'total',
];

function parseSectoral(text) {
  const lines = text.split('\n').map((l) => l.split('\t'));
  const out = { sectors: {}, grandTotals: {} };
  let currentSector = null;
  for (const cols of lines) {
    const sector = cols[0]?.replaceAll('"', '').trim();
    const crop = cols[1]?.replaceAll('"', '').trim();
    // value columns start at index 2, as (value, pct) pairs per unit
    const values = {};
    UNITS.forEach((u, i) => {
      const v = num(cols[2 + i * 2]);
      if (v !== null) values[u] = v;
    });
    if (sector === 'GRAND TOTALS') { out.grandTotals = values; continue; }
    if (sector === 'PERCENTAGE' || (!sector && !crop)) continue;
    if (sector && Object.keys(values).length) {
      currentSector = sector;
      out.sectors[sector] = { ...values, crops: {} };
    } else if (!sector && crop && currentSector && Object.keys(values).length) {
      out.sectors[currentSector].crops[crop] = values;
    }
  }
  return out;
}

// ---- Interannual_Variability.txt ------------------------------------------
// Two blocks of rows (acre-feet, then METRIC = MCM); each data row is
// label, then 20 annual values for 2000-2019, then AVG/TREND/MIN/MAX/RANGE.

const YEARS = Array.from({ length: 20 }, (_, i) => 2000 + i);

function parseInterannual(text) {
  const lines = text.split('\n').map((l) => l.split('\t'));
  const out = { years: YEARS, acreFeet: {}, mcm: {} };
  let block = 'acreFeet';
  for (const cols of lines) {
    const label = cols[1]?.replaceAll('"', '').trim();
    if (label === 'METRIC') { block = 'mcm'; continue; }
    if (!label || label.startsWith('AVG ')) continue;
    const series = cols.slice(2, 22).map(num);
    if (series.some((v) => v !== null)) {
      out[block][label] = { series, avg: num(cols[23]) };
    }
  }
  return out;
}

const sectoral = parseSectoral(readFileSync(src('Sectoral_Water_Consumption.txt'), 'utf8'));
const interannual = parseInterannual(readFileSync(src('Interannual_Variability.txt'), 'utf8'));

const result = {
  provenance: {
    citation: 'Richter et al. 2024, Communications Earth & Environment 5:134',
    doi: '10.1038/s43247-024-01291-0',
    data: 'https://www.hydroshare.org/resource/2098ae29ae704d9aacfd08e030690392',
    period: '2000-2019 averages',
    units: { sectoral: 'MCM/yr', 'interannual.acreFeet': 'AF/yr', 'interannual.mcm': 'MCM/yr' },
    generatedBy: 'scripts/etl/parse-richter.mjs',
  },
  sectoral,
  interannual,
};

// Consistency checks — fail loudly rather than bake a bad file.
const t = sectoral.grandTotals.total;
if (Math.abs(t - 23749) > 1) throw new Error(`grand total ${t} != 23749 MCM`);
const sumSectors = Object.values(sectoral.sectors).reduce((a, s) => a + (s.total ?? 0), 0);
if (Math.abs(sumSectors - t) > 2) throw new Error(`sector sum ${sumSectors} != ${t}`);
const feed = sectoral.sectors['Irrigated agriculture'].crops['Alfalfa'].total
  + sectoral.sectors['Irrigated agriculture'].crops['Other Hay'].total;
const share = feed / t;
if (Math.abs(share - 0.332) > 0.005) throw new Error(`cattle-feed share ${share} unexpected`);

mkdirSync(join(root, 'data'), { recursive: true });
writeFileSync(join(root, 'data', 'richter2024.json'), JSON.stringify(result, null, 1));
console.log(`ok: data/richter2024.json  (grand total ${t} MCM/yr; cattle-feed share of total ${(share * 100).toFixed(1)}%)`);
