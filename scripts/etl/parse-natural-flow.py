#!/usr/bin/env python3
"""Bake Reclamation's Lees Ferry natural flow series into JSON.

  python3 scripts/etl/parse-natural-flow.py

Input (committed primary source, do not edit):
  reference/usbr/LFnatFlow1906-2024.2024.9.12.xlsx
  (provisional natural flow, usbr.gov/lc/region/g4000/NaturalFlow/,
   last updated 2024-09-12; sheet 1 = water years, acre-feet)
Output:
  data/lees-ferry-natural-flow.json
"""
import json, zipfile, xml.etree.ElementTree as ET
from pathlib import Path

root = Path(__file__).resolve().parents[2]
src = root / 'reference/usbr/LFnatFlow1906-2024.2024.9.12.xlsx'
M = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'

z = zipfile.ZipFile(src)
sheet = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
series = {}
for row in sheet.iter(M + 'row'):
    cells = {c.get('r')[0]: c.findtext(M + 'v') for c in row.iter(M + 'c')}
    a, b = cells.get('A'), cells.get('B')
    if a and b:
        try:
            year, af = int(float(a)), float(b)
        except ValueError:
            continue
        if 1900 < year < 2100:
            series[year] = af

years = sorted(series)
assert years[0] == 1906 and years[-1] == 2024, (years[0], years[-1])
assert len(years) == len(range(1906, 2025)), 'gaps in series'

def avg_maf(y0, y1):
    vals = [series[y] for y in years if y0 <= y <= y1]
    return sum(vals) / len(vals) / 1e6

out = {
    'provenance': {
        'source': 'Bureau of Reclamation, Colorado River Basin Natural Flow Data (provisional)',
        'url': 'https://www.usbr.gov/lc/region/g4000/NaturalFlow/provisional.html',
        'file': 'LFnatFlow1906-2024.2024.9.12.xlsx (last updated 2024-09-12)',
        'units': 'acre-feet per water year, natural flow at Lees Ferry',
        'generatedBy': 'scripts/etl/parse-natural-flow.py',
    },
    'waterYears': {str(y): series[y] for y in years},
    'averagesMAF': {
        '1906-2024': round(avg_maf(1906, 2024), 3),
        '1906-2018': round(avg_maf(1906, 2018), 3),
        '1906-1999': round(avg_maf(1906, 1999), 3),
        '2000-2018': round(avg_maf(2000, 2018), 3),
        '2000-2024': round(avg_maf(2000, 2024), 3),
    },
}

# Cross-check against independently published NFDB-derived means
# (inkstain.net 2020: 14.76 MAF 1906-2018, 12.47 MAF 2000-2018).
assert abs(out['averagesMAF']['1906-2018'] - 14.76) < 0.15, out['averagesMAF']
assert abs(out['averagesMAF']['2000-2018'] - 12.47) < 0.15, out['averagesMAF']

(root / 'data').mkdir(exist_ok=True)
(root / 'data/lees-ferry-natural-flow.json').write_text(json.dumps(out, indent=1))
print('ok: data/lees-ferry-natural-flow.json', out['averagesMAF'])
