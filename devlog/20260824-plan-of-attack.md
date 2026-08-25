# 2026-08-24 — plan of attack

First entry. This repo is *Who Drinks the River?* — a computational journalism
piece about Colorado River water allocation. It is the first "thesis piece" of
the orbital pivot: instead of building a general simulation sandbox, build one
standalone sim per wicked problem — an essay + an open model + a playable web
app — and extract shared machinery later, from the second piece, not before.

Provenance: `docs/brief.md` is the handoff brief produced in a claude.ai web
conversation (raw transcript in `reference/20260824-web-conversation.md`). The
brief is the substance spec; this entry is the local plan of attack layered on
top of it. Where they disagree, this entry wins and should say why.

## Decisions taken today

- **Location**: `~/projects/2027/orbital/colorado` — inside the orbital hub
  folder, sibling to orbital-sim, since this *is* the orbital thesis made
  concrete. Own git repo. Renaming/moving is cheap if a better name appears.
- **Name**: folder/repo `colorado`; the piece's public title stays
  *Who Drinks the River?*. Destination when ordered: a GitHub repo (org TBD —
  orbitalfoundation fits the mission, though the taxonomy calls that org
  "tools"; Anselm's call) and a `colorado.exe.xyz` VM. **Nothing is pushed or
  published until Anselm orders it** — push = deploy is the house rule anyway.
- **Hand-code first, conserve later** (Anselm, 2026-08-24): it is fine to write
  code by hand in this one app and scavenge/extract into shared npm libraries
  afterwards. So: no hard dependency on the orbital stack for v1. Cherry-pick
  `@orbitalfoundation/bus` if it reduces friction; do not contort the app to
  use it. (The brief's `orbital-sys` recommendation predates this; bus is the
  maintained successor anyway.)
- **Client-side, static, data pre-baked** — per brief §9.2. Model is pure JS
  modules with no DOM dependency so it runs in Node for validation and in the
  browser for play. ETL scripts live in-repo and emit versioned JSON.
- **Scenario URLs are core, built early.** Arguments happen by exchanging links.
- **Phase 0 (verification) is a hard blocker for published numbers** — matches
  the house rule: never invent a fact; machines propose, humans promote.
  Unverified numbers may drive *development* scaffolding but are marked
  `draft` and cannot ship.

## The three questions

### Who is this for?

Three readers, in priority order:

1. **The arguer** — someone arriving from a social feed already holding one of
   the ledger claims ("half the river goes to cattle feed", "just buy out the
   farmers"). They give us one minute. The claims ledger is their front door:
   click the claim you came in with, see it adjudicated against the model, in
   their first screenful. Must work on a phone.
2. **The player** — gives us ten to twenty minutes. Gets the levers and the
   challenge: *everyone agrees the basin must consume less; you decide who
   cuts, how permanently, and who pays. Try to solve it. Send us your link.*
   There is deliberately no win state; discovering that every configuration
   hurts someone **is** the finding. Desktop-first for deep play, phone-usable.
3. **The auditor** — the water wonk, journalist, or hostile reader checking our
   numbers. Served by the open ETL, a sources page, and the published
   counter-scenarios. This reader is who the editorial integrity rules (brief
   §10) exist for; winning them is what makes the piece citable.

Not the audience: policymakers directly (they arrive via readers 1–3), and
children/classrooms (maybe later; don't design for it now).

### How do we tell the story?

Essay and model are one page, interleaved — a scrollytelling structure where
the essay's claims are live model states, not screenshots:

1. **Cold open on a real claim** (Claim 1 or the "two cows" of Claim 5 —
   wrong in an interesting way), adjudicated interactively in place.
2. **The structural fact**: over-allocated at the source since 1922; paper
   water exceeds wet water; nobody is stealing. The reader dials the flow down
   and watches who runs dry — the brief's "first thing the sim should let
   someone do."
3. **The mechanics tour**: buyout mechanics (dollars in vs. wet water out),
   hysteresis (retirement ≠ fallowing; Crowley County), the efficiency paradox
   (diversion ≠ consumption).
4. **The handover**: full sandbox with all levers, the claims ledger as a
   navigable panel, scenario URLs, and the challenge framing.
5. **Philosophy at top and bottom only** — prior appropriation as fossilized
   incentives, institutions as evolved artifacts, keeping futures open. Never
   woven through the numbers.

### How do users play?

- **Eight levers** (brief §8): cut-allocation method (priority vs.
  proportional), crop switching, water pricing, groundwater substitution (with
  delayed subsidence), delta flow target, buyout budget, retirement vs.
  fallowing, feed relocation.
- **Instant feedback**: every lever change recomputes the full run client-side
  and animates the consequences. A toy, not a form.
- **Impacts in human units** (brief §7): dry wells, exposed Salton Sea playa →
  asthma, county tax base and school enrollment, bird counts, dead pool —
  never bare acre-feet. Ranges, not point estimates; contested parameters are
  levers with the contested range as bounds.
- **Share**: every state serializes into the URL. The ledger claims are just
  preset scenario links. "Publish the counter-scenario" is a feature, not a
  concession.

## Build order

Adopting the brief's phases with local adjustments:

- **Phase 0 — verification + scaffolding (start now).** Resolve `[VERIFY]`
  flags, get Richter et al. 2024 + supplementary tables, locate the existing
  California water-rights dataset, read cloudreef-sim and water-atlas for
  scavengeable patterns. Meanwhile scaffold the repo (this commit) — the brief
  says "nothing else starts" until Phase 0 is done; we interpret that as *no
  published number* rather than *no code*, per the decisions above.
- **Phase 1 — model core.** Annual-timestep mass balance as a Node-runnable
  pure-JS module; must reproduce Richter's published totals or it's wrong.
- **Phase 2 — allocation solver** (priority vs. proportional; validate against
  2007-Guidelines shortage tiers).
- **Phase 3 — impact translation layer.**
- **Phase 4 — web app** (Vite, hand-rolled or minimal deps; scenario URLs day
  one).
- **Phase 5 — claims ledger UI.**
- **Phase 6 — essay + publication** (GitHub + colorado.exe.xyz + a hook.org
  pointer, all on Anselm's order), timed to the post-2026 guidelines cycle.
- **Phase 7 — Rio Grande**, and only there, engine extraction.

## Open questions (brief §13), with working positions

1. Spatial resolution → **state-level with Imperial, Yuma, Palo Verde broken
   out** (accept brief's recommendation).
2. Timestep → **annual for v1** (accept).
3. Agent-based vs. aggregate → **aggregate for v1**; revisit for buyout-market
   honesty in v2.
4. Climate scenario → **a lever**, since the post-2026 fight is exactly about
   which flow number to plan on.
5. Beef/dairy supply-chain depth → **coarse**: one coupling coefficient from
   irrigated-feed retirement to rangeland viability, clearly labeled
   contested, exposed as a lever.
6. California over-allocation comparison → **defer to a sidebar at most**;
   scope-creep risk is real.

These are working positions, not verdicts — each gets its own devlog entry if
it changes.

## Standing reservations (Anselm, same day)

- **Tone: "something a bit less game like."** The play/challenge/no-win-state
  riff stands for now, but revisit after the first working version. Lean
  *instrument* over *toy*: an explorable model a serious reader trusts, not a
  game with a score. Watch the copy especially — "challenge", "solve it",
  "send me your link" framing may need to soften into "explore the constraint
  space" language. Revisit explicitly before Phase 6 (publication).
- **Devlog scope**: this project's devlog lives here and only here. The
  `orbital/devlog/` next door belongs to the larger, more generic orbital
  vision and must not be polluted with this deep dive.
