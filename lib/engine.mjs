// Annual whole-system mass balance for the Colorado mainstem. v1.
//
// Pure module: no I/O, runs in Node and browser. All volumes in acre-feet.
//
// Model shape: one storage node (combined Mead+Powell live storage) fed by
// naturalized flow at Lees Ferry plus a calibrated RESIDUAL inflow. Demand is
// direct human consumption only (ag + MCI + Mexico); riparian/wetland ET and
// intervening tributary gains (Paria, Little Colorado, Virgin, reach gains)
// both live inside the residual, because Reclamation's naturalized-flow
// series already nets natural losses — subtracting Richter's riparian ET on
// top of it double-counts (v1 lesson: doing so forces an implausible ~4+
// MAF/yr correction; with direct-human-only demand the fitted residual lands
// in the hydrologically expected ~1-2 MAF/yr tributary range). Gila is
// excluded on both sides (own sub-basin, joins below the reservoirs),
// following Richter et al. 2024's accounting.
//
// Per year:
//   inflow  = naturalFlow + residualInflow
//   evap    = evapRef * (storage/storageRef)^(2/3)   (surface-area scaling)
//   balance = storage + inflow - demand - evap
//   spill to delta above capacity; shortage (unmet demand) below minStorage.
// Outside shortage/spill, delta outflow is zero — which is the observed
// condition: the river does not reach the sea.

export const DEFAULTS = {
  capacityAF: 49.4e6,      // Mead 26.12 + Powell ~23.3 MAF live (derived from
                           // Reclamation-fed %-full figures, 2026-08; confirm
                           // against USBR tables before publication)
  startStorageAF: 47.0e6,  // start of WY2000, ~95% full [DRAFT: 46-48 range]
  minStorageAF: 4.0e6,     // combined dead-pool-ish floor [DRAFT placeholder]
  evapRefAF: 2.05e6,       // Richter 2024 all-reservoir evap avg (2,529 MCM)
  storageRefAF: 30.0e6,    // approx 2000-2019 mean combined storage [DRAFT]
  residualInflowAF: 0,     // set by calibration (scripts/backtest.mjs)
};

// demands: object whose values are numbers (AF/yr) or per-year arrays aligned
// with flows; all keys are summed. flows: [{year, naturalFlowAF}].
export function simulate(flows, demands, params = {}) {
  const p = { ...DEFAULTS, ...params };
  const at = (d, i) => (Array.isArray(d) ? d[i] : d);
  let storage = p.startStorageAF;
  const years = [];
  for (let i = 0; i < flows.length; i++) {
    const { year, naturalFlowAF } = flows[i];
    const demand = Object.values(demands).reduce((a, d) => a + at(d, i), 0);
    const inflow = naturalFlowAF + p.residualInflowAF;
    const evap = p.evapRefAF * Math.pow(Math.max(storage, 1) / p.storageRefAF, 2 / 3);
    let balance = storage + inflow - demand - evap;
    let spillAF = 0, unmetAF = 0;
    if (balance > p.capacityAF) { spillAF = balance - p.capacityAF; balance = p.capacityAF; }
    if (balance < p.minStorageAF) { unmetAF = p.minStorageAF - balance; balance = p.minStorageAF; }
    storage = balance;
    years.push({
      year, inflowAF: inflow, demandAF: demand, evapAF: evap,
      consumedAF: demand - unmetAF, unmetAF, spillAF, storageAF: storage,
      storageFrac: storage / p.capacityAF,
    });
  }
  return { params: p, years };
}
