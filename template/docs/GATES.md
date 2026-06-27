---
title: Alignment Gates state file
updated: YYYY-MM-DD
---

# Gates

This file is the single source of truth for which alignment gates have been
passed. Agents read it at the start of every session, before touching code, to
learn what has been decided and what is still open.

A gate is a short, named checkpoint that forces a decision to be written down
before related work proceeds. One gate is upfront (Charter). The other four are
just-in-time: they open only when the work that needs them is about to start, so
nothing is decided before it has to be.

## Lifecycle

- not-started: the triggering work has not begun. No artifact yet.
- open: the trigger fired; the artifact is in status draft. Guarded work may
  proceed in parallel but cannot merge until the gate is ratified.
- ratified: the owner reviewed and accepted the artifact (artifact status
  accepted). The decision is binding; later changes need a new ADR or a
  superseding revision.
- superseded: a later decision replaced this one. The artifact stays for history
  with status superseded and a pointer to its replacement.

A gate may be exempt for a given change when that change meets the gate's
triviality exemption. Record the exemption in the PR description, not here.

## Enforcement

CI enforces these gates on every pull request (`scripts/check-gates.sh`). It maps
the PR diff to the gates it triggers (Stack via dependency manifests, Design via a
new UI surface, Deployment & Security via migrations, env, or the deploy/security
docs) and fails the PR when a triggered gate is not `ratified` here, unless the
gate's artifact is updated in the same PR (you are ratifying it now) or the PR
description carries an exemption line:

    gate-exempt: <key>[, <key>...]      # keys: stack, design, deploy

Use the exemption for a change the gate's triviality exemption clears (for example
a routine dependency bump within an already-decided stack), and say why.

## State

| Gate | Status | Artifact | Last updated |
|---|---|---|---|
| Charter / Product thesis | not-started | `CHARTER.md` | YYYY-MM-DD |
| Stack & Architecture (ADRs) | not-started | `docs/adr/` | YYYY-MM-DD |
| PRD / Plan | not-started | `docs/prd/`, `docs/plan/` | YYYY-MM-DD |
| Design theme | not-started | `DESIGN.md` | YYYY-MM-DD |
| Deployment & Security | not-started | `docs/SECURITY_CHECKLIST.md`, `docs/DEPLOY.md`, `docs/ENVIRONMENTS.md` | YYYY-MM-DD |
| Clarify (assumptions) | not-started | `docs/clarify/` | YYYY-MM-DD |

## How to update

1. When a gate's trigger fires, set its status to open and create or fill the
   artifact in status draft.
2. When the owner accepts the artifact, set status to ratified and the artifact
   front-matter to status accepted.
3. Bump the Last updated date on every change. Keep this table in sync with the
   artifacts it points to.

## Gate spec

Each gate names a trigger (what opens it), the key questions it forces an answer
to, a triviality exemption (when a change may skip it), and the artifact it
writes.

### 1. Charter / Product thesis (upfront)

- Trigger: project inception. The one gate you pass before any other work.
- Key questions: Who is this for and what job does it do for them? What is the
  one-sentence thesis (the bet)? What does success look like in plain terms? What
  are the hard constraints? What is explicitly out of scope? Who is the owner?
- Triviality exemption: none. Every project passes Charter first.
- Artifact: `CHARTER.md` (and `CONTEXT.md` for domain language as it emerges).

### 2. Stack & Architecture (just-in-time, via ADRs)

- Trigger: before introducing or changing anything load-bearing (a runtime,
  datastore, framework, deploy target, cross-cutting pattern, or a reversal of a
  prior ADR). The default stack (Supabase backbone, Vercel web, Modal for heavy
  compute only) is the baseline; an ADR records a deviation or a non-obvious choice.
- Key questions: What is being decided and why now? What options were considered?
  What are the consequences and the commitments? Does it stay on the default
  stack; if not, what justifies leaving it? Is Modal kept off the hot path?
- Triviality exemption: routine code inside an already-decided architecture
  (an endpoint, a column, a component) needs no ADR.
- Artifact: a numbered file in `docs/adr/` (Nygard format), copied from
  `docs/adr/_TEMPLATE.md`.

### 3. PRD / Plan (just-in-time)

- Trigger: before a feature or body of work large enough that the approach is not
  obvious from a one-line issue.
- Key questions (PRD): What problem, for whom, why now? What does done look like
  and how is it measured? What is out of scope? What are the open questions?
- Key questions (Plan): What is the root cause or core change? Which files and
  lines? What effort? How do findings tier into Now, Next, Later? What is
  deliberately preserved as-is?
- Triviality exemption: a single small, well-understood change with a clear PR
  description needs no PRD or Plan.
- Artifact: `docs/prd/<slug>.md` and/or `docs/plan/<slug>.md`.

### 4. Design theme (just-in-time)

- Trigger: before the first user-facing surface, or before changing the visual
  system (tokens, type, color, the accessibility floor).
- Key questions: What are the color, type, spacing, and motion tokens? What is the
  accessibility floor we will not drop below? How does a non-prod environment
  signal itself in the UI (the env badge)?
- Triviality exemption: UI that only consumes already-defined tokens, or
  backend-only and CLI-only work, skips this gate.
- Artifact: `DESIGN.md`.

### 5. Deployment & Security (just-in-time)

- Trigger: before the first deploy to any shared environment, and re-run before
  every promotion to prod.
- Key questions (deploy): What is the ordered bring-up (schema first, frontend env
  pointed at the live backend last)? Are the two stacks parameterized purely by
  env var so a dev deploy cannot clobber prod? Does the deploy scope match the
  intended target?
- Key questions (security): Are all secrets env-driven placeholders? Is RLS
  posture decided and written down (including any accepted risk and its deferral
  tier)? Are there any blind --force secret overwrites? Is promotion gated by a
  twice-passing E2E checklist?
- Triviality exemption: local-only work that never deploys, and changes that touch
  neither secrets, data-access policy, nor the deploy path. The security checklist
  itself is never exempt at a prod-promotion gate.
- Artifact: `docs/SECURITY_CHECKLIST.md`, `docs/DEPLOY.md`, `docs/ENVIRONMENTS.md`.

### 6. Clarify (assumptions ledger, just-in-time)

- Trigger: after the PRD and before the Plan, for non-trivial work. Resolve the
  underspecified parts before planning commits to an approach.
- Key questions: What must be true for this to work (the load-bearing
  assumptions)? What is still unknown, and which unknowns block planning? What is
  explicitly deferred, and to when? Which of the PRD's open questions are now
  answered, and how?
- Triviality exemption: work with no material unknowns, or a change small enough
  that the PRD/Plan gate itself was exempt.
- Artifact: `docs/clarify/<slug>.md`, copied from `docs/clarify/_TEMPLATE.md`.
- Pair with the `analyze` skill: a cross-artifact consistency pass (CHARTER vs
  VISION vs PRD vs plan) run before the Plan ratifies, to catch contradictions and
  drift the clarify ledger should reconcile.
