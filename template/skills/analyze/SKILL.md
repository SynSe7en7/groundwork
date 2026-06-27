---
name: analyze
description: Cross-checks the project's committed artifacts for consistency before a Plan is ratified or a large change merges. It reads CHARTER, VISION, the relevant PRD, plan, and clarify ledger, plus DECISIONS and the ADRs, and reports contradictions, drift, and gaps: a plan step with no PRD basis, a decision that contradicts an accepted ADR, a goal that drifted from the charter, terminology that diverges from CONTEXT, an open question the clarify ledger left unresolved. It does not rewrite the artifacts; it produces a short findings list naming each conflict and its locations so the owner reconciles them. Use when a Plan is about to ratify for non-trivial work, before a large body of work merges, when several artifacts changed and you need to confirm they still tell one coherent story, or when the user asks to "analyze", "cross-check the docs", or "check the spec and plan agree".
---

# analyze

groundwork keeps its decisions in committed documents: CHARTER, VISION, the PRDs
and plans, the clarify ledgers, DECISIONS, and the ADRs. Over a project's life
these drift apart: a plan grows a step the PRD never asked for, a decision quietly
contradicts an ADR, the words for a thing diverge from CONTEXT. analyze is the
pass that reads them together and reports where they no longer tell one story,
before a plan ratifies or a large change merges.

It reports; the owner reconciles. A contradiction is a decision to make, not a
typo to fix.

## When to run

Before the PRD/Plan gate ratifies for non-trivial work, and before a large body of
work merges. It pairs with the Clarify gate: clarify records the assumptions and
open questions, analyze checks the artifacts still agree once those are resolved.

## What to read

- CHARTER and VISION: the thesis, the bet, the north star, what is out of scope.
- The relevant `docs/prd/<slug>.md` and `docs/plan/<slug>.md`.
- The `docs/clarify/<slug>.md` ledger, if one exists.
- DECISIONS.md and `docs/adr/`.
- CONTEXT.md for the domain language.

## The checks

- Plan vs PRD: every plan step traces to a PRD goal; flag a step with no basis, and
  a PRD goal with no plan step.
- Decision vs ADR: no DECISIONS line or plan choice contradicts an accepted ADR; a
  reversal needs a superseding ADR, not a silent change.
- Goal vs charter: the work still serves the charter's thesis and stays inside its
  declared scope.
- Terms vs CONTEXT: the artifacts use the domain's words consistently; flag a new
  term coined for an existing concept.
- Clarify follow-through: every unknown the clarify ledger marked blocking is
  resolved; every PRD open question is answered or carried deliberately.

## Anti-pattern: silent reconciliation

WRONG: notice the plan contradicts an ADR and quietly edit one to match. The
contradiction was a real fork; editing it away hides the decision and may pick the
wrong side.

RIGHT: report the contradiction with both locations and stop. The owner decides
which holds, and that decision is recorded as a superseding ADR or a DECISIONS line.

## Output

A short findings list. Each finding names the inconsistency, the two locations as
`file:section`, and its kind (contradiction, drift, or gap). No finding means the
artifacts cohere; say so plainly. This list is the handoff: the owner reconciles
each one before the Plan ratifies.
