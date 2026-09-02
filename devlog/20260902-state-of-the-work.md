# 2026-09-02 — state of the work (session handoff point)

Written so any fresh session (or Anselm in six months) can pick up cold.

## What is live

- **https://colorado.exe.xyz** — the seven-movement story (front door), with
  the spine at /spine.html, the instrument at /instrument.html, the essay
  working draft at /essay.html. Build date stamped in every page mark.
- **The river speaks**: ambient scripted lines + live Q&A via /api/river
  (OpenRouter, `openai/gpt-oss-120b`, throttled 5/min/IP, 20/day/IP,
  400/day global). Key lives ONLY in /srv/river.env on the VM (mode 600,
  spend-capped, never in the repo). To rotate: edit the file, then
  RECREATE the river container (docker restart does not re-read env), or
  just run deploy/deploy.sh.
- Deploy is manual: `bash deploy/deploy.sh` (no autodeploy; push ≠ deploy).

## Where everything is

- This repo (github.com/orbitalfoundation/colorado, pushed): model
  (lib/), data + ETLs (data/, scripts/etl/), verification ledger
  (docs/verification.md — open flags listed at the bottom of each
  section), the brief (docs/brief.md), all devlogs, deploy machinery.
- `essay/` is **gitignored, disk-only** (drafts 1-2 + the score); the
  published copy of draft 2 is committed as site/essay.html. The Substack
  version still needs Anselm's revision pass (two bracketed slots).
- Prose tooling: github.com/anselm/heckler (+ ~/projects/2027/heckler).
  House rule: heckler every public-facing draft; corpus takes only
  Anselm's unassisted writing.
- Cross-project facts: ~/projects/CLAUDE.md (machine, exe.dev, git
  workflow, UX doctrine, writing policy).
- Screenshot tool: scripts/shot.mjs (CDP, real wall-clock waits; the
  headless --virtual-time-budget approach races map workers).

## Open threads, in rough priority

1. Pre-publication verification blockers: the NYT quarter/third cut sizes
   vs the 1.5 MAF tranche (fetch the actual 2027-28 Operating Guidelines);
   Leopold-1922; "thirty tribal nations" vs NYT's "two dozen".
2. M6: named forks + exhibited-futures gallery + the reconstruction page
   for humans and Claudes (a fork URL should BE the reconstruction record).
3. Groundwater-substitution lever (hidden debt, delayed subsidence).
4. Impact translations still missing human units (dry wells, county tax
   base, Salton Sea dust); embodied-voices chorus (Mead, the Compact, a
   farmer); research/advisory citations section (names logged, unverified).
5. Essay revision loop with Anselm → Substack → Twitter outreach.
6. Rio Grande / Hormuz: extract the engine at piece two, not before.

Everything above this line is also traceable through
devlog/20260829-milestones.md, which logs each shipped milestone with its
gotchas.
