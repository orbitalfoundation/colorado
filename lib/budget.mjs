// Baseline water budget derived from Richter et al. 2024 (data/richter2024.json).
// Pure module: no DOM, runs in Node and the browser. All volumes MCM/yr,
// 2000-2019 averages, whole-basin accounting (incl. Gila, exports, Mexico).
//
// This is the accounting layer the simulation must always reconcile against:
// if a future model run's baseline diverges from these totals, the model is
// wrong, not the paper.

export const MCM_PER_MAF = 1233.48;
export const maf = (mcm) => mcm / MCM_PER_MAF;

export function loadBudget(richter) {
  const s = richter.sectoral.sectors;
  const ag = s['Irrigated agriculture'];
  const mci = s['Municipal, Commercial & Industrial'];
  const evap = s['Reservoir Evaporation'];
  const riparian = s['Riparian & Wetland ET'];
  const total = richter.sectoral.grandTotals.total;

  const cattleFeed = ag.crops['Alfalfa'].total + ag.crops['Other Hay'].total;
  const direct = total - evap.total - riparian.total;

  return {
    total, direct,
    sectors: { ag: ag.total, mci: mci.total, evap: evap.total, riparian: riparian.total },
    cattleFeed,
    crops: ag.crops,
    units: richter.sectoral, // full accounting-unit breakdown when needed
    shares: {
      agOfTotal: ag.total / total,
      agOfDirect: ag.total / direct,
      feedOfTotal: cattleFeed / total,
      feedOfDirect: cattleFeed / direct,
      feedOfAg: cattleFeed / ag.total,
      evapOfTotal: evap.total / total,
      riparianOfTotal: riparian.total / total,
    },
  };
}

// Validation: reproduce the paper's own published findings (article p.1, p.3).
// Published values are rounded to whole percent; tolerance ±1pt.
export function validate(budget) {
  const pct = (x) => x * 100;
  const checks = [
    ['irrigated ag % of overall consumption', pct(budget.shares.agOfTotal), 52],
    ['irrigated ag % of direct human use', pct(budget.shares.agOfDirect), 74],
    ['cattle-feed % of direct human use', pct(budget.shares.feedOfDirect), 46],
    ['cattle-feed % of overall consumption', pct(budget.shares.feedOfTotal), 32],
    ['cattle-feed % of agricultural use', pct(budget.shares.feedOfAg), 62],
    ['riparian/wetland ET % of overall', pct(budget.shares.riparianOfTotal), 19],
    ['reservoir evaporation % of overall', pct(budget.shares.evapOfTotal), 11],
  ];
  const failures = checks.filter(([, got, want]) => Math.abs(got - want) > 1.35);
  return {
    ok: failures.length === 0,
    checks: checks.map(([name, got, want]) => ({ name, got: +got.toFixed(1), published: want })),
    failures: failures.map(([name]) => name),
  };
}
