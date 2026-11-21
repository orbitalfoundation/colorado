---
name: devlog
description: Anselm's cross-project knowledge method - dated devlog/ entries as the substrate, never undated canonical docs. Use when starting work in any project (read the tail), after substantive work (write an entry), when asked to write status/roadmap/plan/remaining-work docs, or when tempted to create a new root-level SOMETHING.md.
---

# Devlog

Every project keeps a `devlog/` (hook-website calls it `devnotes/`). It is the
primary knowledge substrate across all of Anselm's projects, because ideas are
temporally situated and change too fast for canonical docs. His words: work
accumulates "like a bedding plain of leaves"; the sequence is itself the
artifact; you can "speedrun the history of thinking that led to the present".

## Rules

- **Every file is date-prefixed**: `devlog/YYYYMMDD-<topic>.md`. This includes
  distilled rules, plans, status and best-practice docs. Never create an
  undated "canonical" document, a root `ROADMAP.md`, `REMAINING_WORK.md`,
  `STATUS.md` or similar. He calls capitalised root files "a graveyard where
  ideas go to die". `CLAUDE.md` and `README.md` are the only exceptions.
- **Open with provenance**: the date, what the entry rests on, and (for
  status/plan docs) a line flagging it is a point-in-time snapshot.
- **Revise vs supersede is a judgement call.** A fresh entry nothing references
  yet may be edited in place. Once it has settled or been built on, write a new
  dated file that names the one it replaces, so the chain walks both ways.
- **Keep dead ends that explain the shape of the answer; cut the ones that were
  only confusion.** He wants both the journey and the truth.
- **Write for a cold reader**: what was believed, what it rested on, what was
  NOT proven, which findings are tool- or version-specific.
- Where a project generates an index (`npm run devlog` in hook-website),
  regenerate it; never hand-edit generated output.

## Grounding: the folder must explain itself

Anselm meets a project as a folder, not as an agent's session. An agent's own
memory (Claude's transcripts, Codex's `~/.codex/sessions`, a ChatGPT thread)
is organised by that tool, not by project, and he cannot find it from the
folder. Case: `2027/anselm-branding` was built by Codex from a workspace in
`~/Documents/Codex/2026-09-25/cu`, prompted from a ChatGPT conversation; the
folder said none of this, and he lost the thread (2026-10-21).

So whenever an agent creates a project, or takes one up in a new session or
from another tool, the README or a devlog entry records:

- **The ask**: what he wanted, quoted where the words exist.
- **The agent and session**: which tool (Claude Code, Codex, ChatGPT, ...),
  which machine, the session or workspace name, and where its logs and any
  outputs written outside the folder live. Copy stray outputs in.
- **What it rested on**: sources, prior conversations, other projects.

This is the same rule he is teaching ChatGPT/Codex; agents of every kind
should leave this trail.

## When invoked as `/devlog`

1. Locate the project's `devlog/` (or `devnotes/`); create it if missing.
2. Read the newest two or three entries so the new one continues the thread.
3. Write `devlog/<today>-<topic>.md` covering the work since the last entry:
   what was done, what was decided and why, what was tried and abandoned, what
   is open. Name any entry it supersedes.
4. Commit it (commit, never push; see the git-orgs skill).

## Session start

When beginning work in a project, read the last few devlog entries before
touching code. They are the session-recovery mechanism: sessions crash and
compaction loses detail; the devlog is what survives.

Cross-project, box-level and harness work all go in one devlog,
`~/projects/2026/harness/devlog/` (since 2026-10-20; the former separate
`~/projects/devlog` repo was merged into it and retired, and must not be
recreated).
