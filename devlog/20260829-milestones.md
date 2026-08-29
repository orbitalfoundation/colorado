# 2026-08-29 — milestones for the four-dimensional redo

Each milestone is independently shippable to colorado.exe.xyz, judged by eye
(screenshots, both themes) and by feel before the next begins. No rush; the
order is the plan, the dates are not.

- **M1 — The spine.** One page: basin map + timeline with the seam at today.
  Real river geometry and basin boundary, Mead and Powell drawn from real
  storage data on the left of the seam, the engine continuing them on the
  right. Scrub 1906 → 2056. Nothing else. *Accept: the core gesture feels
  right; geometry and record are real; both themes verified.*
- **M2 — Movements skeleton.** Scrollytelling structure over the spine: the
  five layperson questions as movements, camera choreography per movement,
  placeholder figures. *Accept: the scroll tells the spatial story without
  any prose polish.*
- **M3 — How did we get here.** The history movement done: scrub the century,
  compact-vs-actual-flow animation, the 2000–2026 collapse. *Accept: history
  reads as animated data, not paragraphs.*
- **M4 — Who drinks it.** Interactive Sankey with the denominator toggle;
  stakeholder geography (districts, diversions ETL: CAP, All-American,
  Front Range exports). *Accept: the two-cows and half-the-river claims are
  adjudicable on screen.*
- **M5 — Playtest the future.** Levers integrated at the seam: flow, regime,
  and the first demand levers; who-takes-the-cut rendered on the map, not
  just bars. *Accept: forking the future is one obvious gesture.*
- **M6 — Forks.** Named, reasoned scenario branches in URLs; curated gallery
  of exhibited futures. *Accept: two people can argue by exchanging links.*
- **M7 — The claims ledger.** Real posts as cards, each wired to a live model
  state. *Accept: every card's verdict is inspectable.*
- **M8 — Rigorous and pretty.** 3D terrain flyover if it earns its place
  (orbital-volume / elevation tiles); impact translation into human units.
- **M9 — Publication.** Essay woven through the movements; grounded
  explain-this-state pipeline (LLM narrates engine output only); every
  `[VERIFY]` and DRAFT flag resolved; Substack + outreach.

Framework extraction (Hormuz / Rio Grande) happens after, per the brief.

---

**M1 shipped same day**: https://colorado.exe.xyz/spine.html — real geometry
(USGS WBD HUC2 14+15, Natural Earth rivers/lakes), real storage (Reclamation
hydrodata monthly, Mead 1937–, Powell 1963–), engine beyond the seam. You can
scrub Hoover filling, Powell filling, the 1980s peak, the collapse, and cross
into the modeled decline. Verified by eye, light and dark, desktop and phone.
Notes: CARTO keyless rasters are dead (watermark) → Esri gray canvas;
OpenFreeMap vector renders in real browsers but not under headless
verification → deferred; `scripts/shot.mjs` is the new CDP screenshot tool
with real wall-clock waits (virtual-time races web workers).

**TODO (Anselm, 2026-08-29):** since everybody also has Claude, add a page for
humans *and* Claudes to reconstruct scenarios: a stable, machine-readable
description of the model, data provenance, lever semantics, and any scenario's
full parameter state (think llms.txt meets reproducibility appendix — fetch
one URL, rebuild the run, verify the numbers). Slots naturally alongside M6
(forks) since a fork URL should BE the reconstruction record.

**M2 shipped same day**: https://colorado.exe.xyz/story.html — five movements
choreographing the fixed map (whole basin → headwaters → lower-basin
stakeholders → reservoir country → back out), scroll-linked time through
movements IV (1906→today) and V (today→2056), stakeholder placeholder labels
shown only in movement III, slim always-on strip dock. Shared spine machinery
extracted to site/core.mjs (spine.js refactored onto it). Verified live by
eye; the 1947 frame (Mead 19.5, Powell an empty ring) and the 2037 frame
(modeled, combined 7.2) prove the follow-the-reader timeline. Gotchas:
maplibre Marker owns style.opacity (use visibility to hide markers);
deploy.sh must copy site/*.mjs.
