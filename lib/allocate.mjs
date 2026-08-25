// Phase 2: who takes the cut. Distributes a Lower-Basin-plus-Mexico shortage
// across parties under a chosen regime. Pure module, volumes in AF/yr.
//
// Verified basis (docs/verification.md):
//  - Apportionments: CA 4.4 MAF, AZ 2.8, NV 0.3 (Boulder Canyon Project Act,
//    affirmed Arizona v. California 1963); Mexico 1.5 (1944 Treaty).
//  - 1968 CRBPA §301(b): CAP junior — CA's 4.4 protected ahead of CAP.
//  - Post-2026 ROD (Aug 21, 2026): sideboards allow LB shortages to 3.6 MAF
//    (3.0 among Lower Division States); 2027-28 first tranche of 1.5 MAF uses
//    the states' own negotiated split — AZ 760 KAF, CA 440, NV 50, Mexico 250;
//    beyond 1.5 MAF, "a representation of applicable law".
//
// STYLIZATION (label in any UI): the "applicable law" regime here is a
// party-level stack — Arizona cut first (CAP-flavored juniority), then
// Nevada, then Mexico, with California last — pending district-level rights
// data. Real law operates on individual rights and treaty minutes; this
// captures the structural asymmetry (junior CAP vs senior CA ag) only.

export const ENTITLEMENTS_AF = {
  california: 4.4e6, arizona: 2.8e6, nevada: 0.3e6, mexico: 1.5e6,
};
export const PARTIES = Object.keys(ENTITLEMENTS_AF);
const TOTAL = Object.values(ENTITLEMENTS_AF).reduce((a, b) => a + b, 0);

const TRANCHE_2728_AF = { arizona: 760e3, california: 440e3, nevada: 50e3, mexico: 250e3 };
const TRANCHE_TOTAL = 1.5e6;

const zero = () => Object.fromEntries(PARTIES.map((p) => [p, 0]));
const clampTo = (cuts) => {
  for (const p of PARTIES) cuts[p] = Math.min(cuts[p], ENTITLEMENTS_AF[p]);
  return cuts;
};

// shortageAF -> {cuts: {party: AF}, unallocatedAF}
export const REGIMES = {
  // Pro-rata to entitlement. Nobody's seniority matters.
  proportional(shortageAF) {
    const cuts = zero();
    for (const p of PARTIES) cuts[p] = shortageAF * ENTITLEMENTS_AF[p] / TOTAL;
    return { cuts: clampTo(cuts), unallocatedAF: Math.max(0, shortageAF - TOTAL) };
  },

  // Stylized applicable-law stack: juniors absorb everything before seniors
  // lose a drop. Order: AZ -> NV -> Mexico -> CA. `headroom` caps how much
  // each party can still be cut (defaults to full entitlements).
  priority(shortageAF, headroom = ENTITLEMENTS_AF) {
    const order = ['arizona', 'nevada', 'mexico', 'california'];
    const cuts = zero();
    let rest = shortageAF;
    for (const p of order) {
      const take = Math.min(rest, headroom[p]);
      cuts[p] = take; rest -= take;
      if (rest <= 0) break;
    }
    return { cuts, unallocatedAF: Math.max(0, rest) };
  },

  // Post-2026 framework as adopted for 2027-28: negotiated split for the
  // first 1.5 MAF, then the applicable-law stack for the excess (per ROD),
  // with each party's remaining headroom respected.
  framework2728(shortageAF) {
    const first = Math.min(shortageAF, TRANCHE_TOTAL);
    const cuts = zero();
    for (const p of PARTIES) cuts[p] = TRANCHE_2728_AF[p] * (first / TRANCHE_TOTAL);
    const excess = shortageAF - first;
    if (excess > 0) {
      const headroom = Object.fromEntries(
        PARTIES.map((p) => [p, ENTITLEMENTS_AF[p] - cuts[p]]));
      const tail = REGIMES.priority(excess, headroom);
      for (const p of PARTIES) cuts[p] += tail.cuts[p];
      return { cuts, unallocatedAF: tail.unallocatedAF };
    }
    return { cuts, unallocatedAF: 0 };
  },
};

// Apply a regime to a simulated run: system unmet demand is borne by the
// Lower Basin + Mexico (Upper Basin shortage is hydrologic, upstream of the
// decree machinery — a documented v1 simplification).
export function allocateRun(runYears, regime) {
  const f = REGIMES[regime];
  return runYears.map((y) => {
    const { cuts, unallocatedAF } = f(y.unmetAF);
    const delivered = Object.fromEntries(
      PARTIES.map((p) => [p, ENTITLEMENTS_AF[p] - cuts[p]]));
    return { year: y.year, shortageAF: y.unmetAF, cuts, delivered, unallocatedAF };
  });
}
