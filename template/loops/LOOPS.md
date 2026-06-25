---
title: Active loops state file
updated: YYYY-MM-DD
---

# Loops

Lifecycle: candidate (defined, not yet trusted to run unattended) -> active
(approved to run on its trigger) -> paused (temporarily disabled, kept for
history) -> retired (no longer used; row stays for the record).

This file is the single source of truth for which loops may run. Agents read it
at the start of a session before invoking any loop, the same way they read
`docs/GATES.md` before touching gated work. A loop that is not listed here as
active does not run unattended. The schema, the appropriateness gate, and the
mandatory guardrails live in `loops/README.md`.

## State

| Loop | Status | Checker | Last run |
|---|---|---|---|
| `tdd-red-green-refactor` | candidate | `just verify` (deterministic) | never |
| `plan-execute-verify` | candidate | `just verify` (deterministic) | never |

## How to update

1. To add a loop, first run it past the appropriateness gate in
   `loops/README.md`. If it clears all four conditions, write its
   `loops/<name>.loop.md` file and add a row here as candidate.
2. Promote candidate to active only after it has run cleanly under a human watch
   and respected its exit stops. Record the checker command and set Last run.
3. Set a loop to paused when it should stop running for now, or retired when it
   is done for good. Keep the row; never delete history.
4. Update Last run to the date a loop last executed, and bump the front-matter
   updated date on every change. Keep this table in sync with the loop files it
   points to.
