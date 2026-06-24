---
title: <Work> plan
status: draft
updated: YYYY-MM-DD
---

# Plan — <Work name>

> Template. Copy to `docs/plan/<slug>.md`. Planning only: recommendations, not
> code. State root cause, the exact files and lines, and an effort tag for each
> item. Tier every finding Now / Next / Later. Verify any claim against real code
> or data before asserting it.

## Verdict

<One short paragraph: current state and the core change in plain terms.>

## Preserve as-is

<The parts that are already good and must not be churned.>

## Now: blocks the merge (P0/P1)

1. **<Finding> (P0, <area>).** Root cause: <...>. Lives in `<file> L###`.
   Fix: <...>. Effort: <low | medium | high>.

## Next: tracked near-term, does not block (P2)

1. **<Finding>.** Root cause: <...>. `<file> L###`. Effort: <...>.

## Later: pre-GA hardening and polish (P3)

1. **<Finding>.** <Why it waits and what triggers a re-tier to Now.>
