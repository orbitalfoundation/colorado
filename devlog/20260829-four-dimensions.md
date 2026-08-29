# 2026-08-29 — four dimensions, and the seam at today

Anselm's redirect, captured while fresh. The current site is "very academic
and fairly simple"; the target is a very different experience. His framing:
tell a story in four dimensions, space and time, past and future. Let people
playtest the future especially, because that is where we go beyond passive
consumption. Recruit thinking, not just lecture. These are world-class
unsolved challenges; ideas tried here get applied to other problems (Strait
of Hormuz named — orbital-sim already carries a hormuz cascade, so this is
the pattern's third iteration). Invent a new tool, something powerful.
Rigorous and pretty. No rush.

## The unifying mechanic: one timeline with a seam

A single time scrubber, 1906 → ~2060. Left of the seam (today) is the
record: real flows, the reservoir collapse, the compact against wet years.
Immutable; you inherit it. Right of the seam the same scrubber drives the
simulation under the reader's levers. Same map, same units, same interface
for past and future; only one side forks. The reader stands at the seam
holding the levers. This makes "playtest the future" physical and gives the
whole piece one gesture to learn.

## Movements = the layperson's questions

What is this river, where is it, what does it look like? Who drinks it, and
where are they? How did we get here? (animated data: scrub the century.)
What happens if nothing changes? What would you do? Each movement: a visual,
one interactive figure, prose, sources in a drawer. Interleaved,
Ciechanowski-style, never essay-then-appendix.

## Forks: recruiting thinking

A reader scenario is an authored proposal: a named branch pinned to the
timeline, with a rationale, serialized in a URL. A curated gallery of forks
("exhibited futures", explicitly not a leaderboard) turns the piece into a
commons searching the idea space. This is the answer to "leverage all the
brain power out there." v1 is URL forks + a hand-curated gallery; the
multiuser layer (orbital-filespace) can come later if it earns it.

## The claims ledger as UI

Real tweets quoted as cards (the brief's Claims 1–6, with handles), each
answered by a live model state, each pushable. The piece is addressed to an
argument in progress; "it's more complex than it appears" is shown, not
asserted.

## Conversational LLM: allowed, on one condition

It never speaks from its own knowledge, only from the run. Three grounded
roles: (1) explain the current state from the allocation trace + the
verification ledger; (2) author scenarios from natural language into lever
settings; (3) steelman the opposing fork. Narration over engine output
keeps the never-invent-a-fact rule intact. Build the structured
explain-this-state pipeline first; chat UI later. Anthropic API from env
when wired; abuse/cost controls before it goes public.

## Rigorous and pretty

Real 3D terrain of the basin (free DEMs; orbital-sim packages/agents/
elevation.js already samples GEBCO), reservoirs as actual shrinking volumes
scrubbed through 25 years of record. orbital-volume consolidates 3D if
needed (his note 2026-08-25: the orbital modules are services to reach for
when they fit). House constraints hold: half-globe restraint, sciency
instrument, system light/dark, mobile-first; 3D serves legibility or it
goes.

## The generalizable shape (design for extraction, extract later)

A civic story = **places** (geometry) + **record** (time series) + **model**
(engine + levers) + **claims** (the discourse answered) + **sources**.
Colorado instantiates it with the five seams visible; the framework is
extracted at piece two (Rio Grande or Hormuz), per the brief's own
discipline. What survives the redo untouched: lib/engine, lib/allocate,
data/, docs/verification.md. What gets done over: presentation. The current
site becomes the instrument room in the final movement.

## First prototype (when ready — no rush)

The spine only: map + timeline with the seam. Real river geometry (USGS
NHD/basin boundary), real storage series animating the reservoirs, scrub
past-to-future with the existing engine on the right side of the seam.
Nothing else. Judge the core gesture by feel (and by screenshot, in both
themes) before building movements on top. New data needed: river/basin
geometry, diversion points, district boundaries — one ETL day, all public.
