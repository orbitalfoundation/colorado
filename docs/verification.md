# Phase 0 verification ledger

Burn-down of the `[VERIFY]` flags in `docs/brief.md`. Rules: a fact is
VERIFIED only when checked against a primary or authoritative source that is
cited here; CORRECTED means the brief's figure was wrong and the right one is
recorded; DRAFT means usable for development scaffolding but blocked from
publication. Machines propose, humans promote.

Status: in progress (started 2026-08-24).

## Richter et al. 2024 — the data spine ✅ VERIFIED (primary source in repo)

Citation confirmed: Richter, B.D., Lamsal, G., Marston, L., Dhakal, S.,
Sangha, L.S., Rushforth, R.R., Wei, D., Ruddell, B.L., Davis, K.F.,
Hernandez-Cruz, A., Sandoval-Solis, S., Schmidt, J.C. (2024). "New water
accounting reveals why the Colorado River no longer reaches the sea."
*Communications Earth & Environment* 5:134. doi:10.1038/s43247-024-01291-0.
Open access. Local copies: `reference/richter2024/` (article PDF, two
supplementary PDFs, HydroShare data tables from
hydroshare.org/resource/2098ae29ae704d9aacfd08e030690392).

Paper's own stated findings (verbatim from the article text, p.1 and p.3):

- "Irrigated agriculture is responsible for 74% of direct human uses and 52%
  of overall water consumption."
- "Cattle feed crops including alfalfa and other grass hays account for 46%
  of all direct water consumption", 32% of all water consumed from the basin,
  and 62% of all agricultural water consumed.
- Cattle-feed crops consume 90% of Upper Basin irrigation water; in Mexico's
  share they are 86% of direct human use.
- Riparian/wetland ET is 19% of overall consumption; reservoir evaporation 11%.
- Basin overconsumed (total consumption > runoff) in 16 of 21 years during
  2000–2020; average annual overdraft ~10%; the two big reservoirs fell to
  three-quarters empty by end of 2022.
- Accounting period: 2000–2019 averages. **Units in Table 1/2 and the
  HydroShare tables are million cubic meters (MCM) per year**, not acre-feet;
  English-unit versions are Tables SI-1/SI-2 in the supplementary PDF.
  1 MAF = 1,233.48 MCM. Grand total consumption 23,749 MCM/yr ≈ 19.25 MAF/yr
  (includes Gila, exports, Mexico, reservoir evaporation, riparian ET).

Brief's Claim 1 verdict CONFIRMED as REFRAMED: computed from the paper's own
Table 1 data — cattle feed 7,881 MCM = 33.2% of total consumption and 46.9%
of direct human use (total minus reservoir evap minus riparian ET); the paper
publishes these as 32% and 46% (its rounding/denominator). "More than half
the river for cattle feed" is only reachable by using the direct-use
denominator *and* the ag-only numerator confusion; the honest range is
32–46% depending on stated denominator.

Model validation target (brief Phase 1): reproduce Table 1's totals —
GRAND TOTALS row: Upper Basin 6,460.47; Upper exports 923.97; Lower Basin
(w/o Gila) 10,660.60; Lower exports 1,558.54; Gila 2,144.78; Mexico 1,748;
Mexico exports 252; total 23,749 MCM/yr.

Legal-timeline nugget from the paper (p.3): the 2001 Interim *Surplus*
Guidelines are the agreement expiring in 2026 in the paper's list; the 2007
Interim Guidelines for shortages are a separate instrument. The brief's "2007
Interim Guidelines expire in 2026" needs the precise instrument names checked
against Reclamation — see the post-2026 section below.

## Law of the River & hydrology (web-verified 2026-08-24)

- **Apportionments ✅ VERIFIED**: 7.5 MAF/yr to each basin (1922 Compact),
  +1.5 MAF/yr to Mexico (1944 Treaty, signed Feb 3, 1944) = 16.5 MAF; the
  Compact's Article III(b) adds a conditional 1.0 MAF for the Lower Basin
  (→ 17.5 MAF paper total). State which framing whenever quoted.
  Sources: CRS R45546 (congress.gov), watereducation.org.
- **Lees Ferry natural flow ✅ VERIFIED from primary data in-repo**:
  Reclamation's provisional natural-flow spreadsheet (1906–2024, water years,
  `reference/usbr/`, baked to `data/lees-ferry-natural-flow.json`) gives
  **15.22 MAF/yr (1906–1999) vs 12.40 MAF/yr (2000–2024)**; 14.75 (1906–2018)
  and 12.43 (2000–2018) match the independently published NFDB-derived means
  (inkstain.net: 14.76/12.47) within 0.04. Brief's "~14.8 vs ~12.4" is fine
  ONLY with periods stated; prefer our computed period-labeled pairs.
- **Delta ✅ VERIFIED**: no regular flow to the Gulf of California since 1960
  (flood-year exceptions 1983, 1993, 1998). Minute 319 signed **Nov 20,
  2012** (IBWC document date; some secondary sources wrongly say Nov 12);
  2014 pulse flow = 130 MCM / 105,000 AF, river reached the sea for the
  first time in 13 years (USGS EROS). Minute 323 signed Sep 21, 2017;
  nine-year deal, ≥210,000 AF for delta restoration as ongoing flows.
- **CAP junior priority ✅ VERIFIED**: 1968 Colorado River Basin Project Act
  §301(b) subordinates CAP to California's 4.4 MAF in shortage
  (usbr.gov statute PDF; CRS R45546).
- **Reservoir evaporation ✅ VERIFIED, scope-dependent — label which**:
  860 KAF/yr evaporation Lake Mead→Mexico border (Reclamation report,
  Feb 2024, 2017–2021 data; +445 KAF riparian ET = ~1.3 MAF losses on that
  reach); ~1.135 MAF/yr Mead+Powell combined at full pool
  (coloradoriverscience.org); ~1.5 MAF/yr system-wide (USGS via The
  Conversation). Richter 2024's own number: 2,529 MCM/yr ≈ 2.05 MAF (all
  reservoirs, 2000–2019 avg).

### ⚠️ CORRECTED — the news hook (brief §2.2 is stale)

The post-2026 process **concluded**. The seven states failed to reach
consensus; Reclamation released the Final EIS **July 31, 2026**, and Interior
signed the **Record of Decision on August 21, 2026** adopting the "Decision
Framework for Colorado River Guidelines: Coordinated Operations of Lake
Powell and Lake Mead (2027–2036)" — a 10-year adaptive framework with 2-year
operating intervals; the 2027–2028 Operating Guidelines adopt the Lower Basin
states' self-proposed reductions (usbr.gov/ColoradoRiverBasin/post2026; ROD
PDF P26_RecordofDecision_Final.pdf; DLA Piper Aug 2026; Maven's Notebook
2026-08-20 "era of near-continuous negotiation"). Draft EIS comment period
closed Mar 2, 2026 with 18,127 submissions.

Also: **Lake Mead set its all-time record low in August 2026** — 1,039.27 ft,
26.5% full as of Aug 23, 2026, below the 2022 record (reservoirbench.com;
Las Vegas Review-Journal). Powell ~21–23% full, projected 3,515.89 ft /
5.03 MAF at end of WY2026 (usbr.gov). 2026 is a Tier 1 shortage year
(declared Aug 2025, Mead projected 1,055.88 ft).

**Reframing consequence**: the piece is no longer an intervention in a live
negotiation — it's an explainer/adjudicator landing days after a federally
imposed framework, during a record-low summer, with "near-continuous
negotiation" (2-year intervals) ahead. Arguably a *better* hook: every two
years this fight repeats; here is the machine to reason about it.

## California dataset & local scavenge audit (2026-08-24)

- **CORRECTED (brief Claim 6)**: no California water-rights dataset exists on
  disk. `~/projects/2026/water-atlas` fetches SWRCB eWRIMS Points of
  Diversion (63,990 points) but *locations only* — no acre-feet; the CKAN
  join for face values (by APPL_ID) is documented as never built
  (water-atlas notes, 20260620-current-todos). The "192 MAF vs 72 MAF" the
  brief attributes to prior work appears nowhere; what water-atlas actually
  ships is **~370 MAF of appropriative rights vs ~70 MAF mean annual runoff
  (~5x), citing Grantham & Viers 2014** (site/src/lib/Faq.svelte,
  Splash.svelte), with ~250 vs ~71 MAF as the older New California Water
  Atlas framing. Use 370/70 (pending agent confirmation of the paper
  itself); retire 192.
- Scavenge list (paths in water-atlas, cloudreef-sim, orbital-sim):
  `orbital-sim/packages/agents/hormuz/` cascade + `observe.js` (best
  template for a parameter-driven scenario cascade); `cloudreef-sim/agents/
  time.js` (adaptive tick loop); `water-atlas/aggregator/` (ETL: throttled
  http + sqlite + one-file-per-source registry + GeoJSON prebake);
  `orbital-sim/viz/src/chart/index.js` (Observable Plot wrapper);
  `water-atlas/site/src/lib/Splash.svelte` paper-vs-wet two-bar visual —
  directly reusable for the over-allocation set-piece.

## Economics & news (web-verified 2026-08-24)

- **⚠️ CORRECTED — alfalfa value (brief §7 asymmetry note)**: "low tens of
  dollars per acre-foot" is wrong as a value figure. Published estimates:
  ~$170/AF applied (California statewide, 2010 data in 2014$, Pacific
  Institute "CA Agricultural Water Use", pacinst.org PDF); $299/AF revenue,
  up to ~$452/AF at 2022 hay prices (U. of Arizona Frisvold & Duval via
  azfb.org). The "tens of dollars" number conflates crop value with IID's
  *water price* (~$20/AF). Consequence: alfalfa revenue per AF is the same
  order of magnitude as what the government paid for forbearance — which is
  the more interesting story (vegetables still 5–10x higher per AF).
- **CORRECTED — conservation-payment program labels**: SCPP is the *Upper*
  Basin program (UCRC-run; $150/AF fixed offer 2023, realized average
  ~$418/AF: $15.8M for ~37.8 KAF, Choices Magazine); the *Lower* Basin
  IRA-funded program is separate with fixed tiers $330/$365/$400 per AF for
  1/2/3-year commitments (Interior via KUNC, Oct 2022). Brief's "$300–400"
  was right in magnitude, wrong in basin attribution.
- **Crowley County ✅ VERIFIED**: Colorado Canal (1891) irrigated >50,000
  acres around Ordway; 1970s–80s sales (Foxley 1972, then CLADCO → Aurora,
  Colorado Springs, Pueblo, Pueblo West) left ~2,500 irrigated acres; dust
  storms, weeds; 2011 estimate 48.1% of residents in poverty; economy now
  ranching + two prisons (Water Education Colorado Headwaters Fall 2017;
  Colorado Sun 2024; Wikipedia). Use ">50,000 → ~2,500 acres".
- **Rio Grande news ✅ VERIFIED with precise dates**: five-year treaty cycle
  ended Oct 24–25, 2025 with Mexico ~880 KAF delivered of 1.75 MAF owed
  (~50.6%); deal announced ~Dec 12, 2025 (USDA release): 202,000 AF released
  starting week of Dec 15, 2025, repayment plan due Jan 31, 2026; tariff
  threat context. Distinct from IBWC Minute 331 (Nov 7, 2024) — don't
  conflate. Texas v. New Mexico and Colorado (No. 141 Orig.): SCOTUS entered
  the consent decree **effective May 26, 2026** — NM reduces Lower Rio
  Grande depletions 18,200 AF/yr within ten years, half by 2031; ends
  litigation begun 2013; an earlier state-only decree was rejected 5–4 on
  Jun 21, 2024 (somachlaw.com; NM governor's office; Source New Mexico).
- **Grantham & Viers 2014 ✅ VERIFIED with unit nuance**: *Environmental
  Research Letters* 9:084012, doi:10.1088/1748-9326/9/8/084012. Paper
  abstract: "water right allocations total 400 billion cubic meters,
  approximately five times the state's mean annual runoff" (12,621 active
  appropriative rights). UC Davis press release: 370 MAF allocated vs
  ~70 MAF available. Attribute 400 Bm³/5x to the paper, 370/70 to the
  release. The brief's "192 vs 72" is retired (see CA dataset section).
- **IID & Imperial County ✅ VERIFIED**: IID holds 3.1 MAF/yr entitlement
  (2.6 MAF Present Perfected Rights, 1901 priority) — largest single
  entitlement on the river, >⅔ of California's 4.4 MAF; serves ~475–500K
  acres (iid.com; Wikipedia). Imperial County gross ag value $2.61B (2022),
  $2.69B (2023); top commodity cattle at $697.7M (County Ag Commissioner
  crop reports; Calexico Chronicle).
- **Future Ecologies ✅ VERIFIED**: FE5.7 "Home on the Rangelands: Welcome to
  Cowlifornia (Part 1)", Feb 9, 2024; parts 2 (FE5.8, Mar 18) and 3 (FE5.9,
  Apr 29, 2024). Episode challenges "the conventional environmentalist
  perspective that cattle are always a destructive force." Note: the
  rain-fed (non-river-water) characterization of CA annual grasslands is
  accurate but is our inference, not the episode's own wording — phrase
  accordingly.

## Remaining open flags

- Brief Claim 2's "14 million acres burned better suited to cattle feed" —
  unverified, still `[VERIFY]`.
- Alfalfa cutting counts by region (Claim 2 steelman) — still `[VERIFY]`.
- Diversion-to-consumption ratios by district (Claim 3b) — still `[VERIFY]`;
  candidate source: LCRAS decree accounting.
- County-level economic dependence beyond Imperial (Yuma) — partial.
- Huntsinger & Barry endangered-species/grazing figure — still `[VERIFY]`.
- Post-ROD details worth reading first-hand: the ROD PDF itself
  (P26_RecordofDecision_Final.pdf) before characterizing the Decision
  Framework in print.
