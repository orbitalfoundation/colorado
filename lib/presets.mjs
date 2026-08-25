// Build engine inputs from the baked primary data (data/*.json).
// Mainstem accounting: Gila excluded on both supply and demand sides,
// following Richter et al. 2024. All outputs in acre-feet.

import { MCM_PER_MAF } from './budget.mjs';
const AF_PER_MCM = 1e6 / MCM_PER_MAF; // ≈ 810.7 AF per MCM

// Historical run, 2000..endYear. Uses recorded annual AG+MCI consumption
// (Richter interannual tables, acre-feet, 2000-2019); years past 2019 reuse
// the 2015-2019 mean — a flagged approximation (post-2019 DCP cuts not
// modeled). Mexico and riparian are 2000-2019 averages held constant.
export function historicalInputs(richter, flowsJson, endYear = 2024) {
  const ia = richter.interannual.acreFeet;
  const series = (label) => ia[label].series;
  const agS = series('AG total Upper Basin').map((v, i) => v + series('AG total Lower Basin')[i]);
  const mciS = series('MCI total Upper Basin').map((v, i) => v + series('MCI total Lower Basin')[i]);
  const tailMean = (s) => s.slice(-5).reduce((a, b) => a + b, 0) / 5;

  const g = richter.sectoral;
  const mexicoAF = g.grandTotals.mexicoTotal * AF_PER_MCM;

  const flows = [];
  const ag = [], mci = [];
  for (let year = 2000; year <= endYear; year++) {
    flows.push({ year, naturalFlowAF: flowsJson.waterYears[String(year)] });
    const i = year - 2000;
    ag.push(i < agS.length ? agS[i] : tailMean(agS));
    mci.push(i < mciS.length ? mciS[i] : tailMean(mciS));
  }
  return { flows, demands: { ag, mci, mexico: mexicoAF } };
}

// Scenario baseline: constant 2000-2019 average demands, supply chosen by the
// caller (historical series, truncated means, or a synthetic "dial the flow").
export function baselineDemands(richter) {
  const ia = richter.interannual.acreFeet;
  const mean = (label) => {
    const s = ia[label].series;
    return s.reduce((a, b) => a + b, 0) / s.length;
  };
  const g = richter.sectoral;
  return {
    ag: mean('AG total Upper Basin') + mean('AG total Lower Basin'),
    mci: mean('MCI total Upper Basin') + mean('MCI total Lower Basin'),
    mexico: g.grandTotals.mexicoTotal * (1e6 / MCM_PER_MAF),
  };
}
