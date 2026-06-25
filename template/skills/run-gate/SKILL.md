---
name: run-gate
description: Runs one alignment gate from docs/GATES.md to ratification. It reads the named gate's key questions and triviality exemption, checks the exemption first, then walks the questions one at a time proposing a recommended answer, writes or updates the gate's artifact, and flips the gate status in docs/GATES.md (open while drafting, ratified once the owner accepts). Use when about to start work that an unratified gate guards (adding or swapping a runtime, datastore, framework, host, or major dependency; starting a non-trivial feature; building or changing a user-facing surface; deploying, rotating a secret, or handling real user data), or when the user asks to open, run, or ratify a gate by name (Charter, Stack & Architecture, PRD/Plan, Design, Deployment & Security).
---

# run-gate

An alignment gate is a checkpoint that forces a decision into a committed doc
before the work that depends on it. `docs/GATES.md` is the source of truth: it
lists every gate, its status, and its full spec (trigger, key questions,
triviality exemption, artifact). This skill turns that spec into something you
actively run. It does not restate the gates. It reads them from `docs/GATES.md`
at run time so it stays correct as that file evolves.

Gates protect decisions, not keystrokes. Your job is to get the decision written
down and accepted by the owner, not to manufacture ceremony around a trivial
change.

## Philosophy

The gate is ratified when the decision is real, written, and the owner has said
yes. Three failure modes to avoid, in order of cost: ratifying a gate the owner
never actually confirmed; writing an artifact that restates the questions
instead of answering them; and running the whole ritual on a change that the
triviality exemption clears. Read the spec, check the exemption, propose answers,
get a yes, flip the status.

## Anti-pattern: the rubber-stamp

WRONG: read the gate, write "TBD" or a paraphrase of each key question into the
artifact, set status to ratified, move on. The artifact now looks done and
blocks nothing. The next agent trusts it and builds on a decision no one made.

RIGHT: for each key question, propose a concrete recommended answer grounded in
the charter, the existing code, and the default stack. Get the owner's yes (or
their correction) before the artifact reaches accepted and before you set the
gate to ratified.

## Phases

1. **Identify and load the gate.** Map the request to one row in `docs/GATES.md`:
   Charter / Product thesis, Stack & Architecture (ADRs), PRD / Plan, Design
   theme, or Deployment & Security. Read that gate's full spec from the Gate spec
   section: its trigger, key questions, triviality exemption, and artifact path.
   Read the current status from the State table. If it is already ratified, say
   so and stop unless the user is superseding it.

2. **Apply the triviality exemption (the core phase).** Before any drafting,
   test the change against this gate's exemption clause verbatim. If it clears,
   do not open the gate: state which exemption applies and that the exemption is
   recorded in the PR description, not in `docs/GATES.md`. When unsure whether a
   change is trivial, it is not. A change that adds a dependency, alters a schema
   or API contract, touches auth, moves data, or shapes what a user sees is never
   trivial. This phase is where most runs should end early.

3. **Open the gate.** Set the gate's status to open in the `docs/GATES.md` State
   table and bump its Last updated date. Create or fill the artifact in status
   draft (ADRs copy `docs/adr/_TEMPLATE.md`; plans copy `docs/plan/_TEMPLATE.md`).
   Guarded work may proceed in parallel from here but cannot merge until ratified.

4. **Walk the key questions one at a time.** For each key question in the spec,
   propose a recommended answer drawn from `CHARTER.md`, `CONTEXT.md`, the
   existing code, and the default stack (Supabase backbone, Vercel web, Modal for
   heavy compute only). Present one question and its proposed answer, take the
   owner's response, write the accepted answer into the artifact, then move to the
   next. Do not batch them; a question answered in passing is a question skipped.
   For Stack & Architecture, confirm the change stays on the default stack or
   justify leaving it, and that Modal stays off the hot path.

5. **Ratify on the owner's yes.** When every key question is answered and the
   owner accepts the artifact, set the artifact front-matter to status accepted,
   set the gate to ratified in `docs/GATES.md`, and bump Last updated. Keep the
   State table in sync with the artifact. The decision is now binding; a later
   change to it needs a new ADR or a superseding revision, not a silent rewrite.

## Per-cycle checklist (one key question)

- Read the question from the spec exactly as written.
- Propose a concrete recommended answer grounded in committed context.
- Get the owner's confirmation or correction.
- Write the accepted answer into the artifact (not a paraphrase of the question).

## Exit criteria

- Exempt: the triviality clause cleared the change. Gate stays not-started; note
  the exemption for the PR description. Done.
- Ratified: every key question answered, artifact accepted, status flipped to
  ratified in `docs/GATES.md`, Last updated bumped. Done.
- Blocked: the owner is unavailable to confirm. Leave the gate at open with the
  artifact in draft and hand off; do not self-ratify.

## Handoff

The committed artifact named in the spec (`CHARTER.md`, `docs/adr/NNNN-*.md`,
`docs/prd/<slug>.md` or `docs/plan/<slug>.md`, `DESIGN.md`, or the deploy and
security docs) plus the updated `docs/GATES.md` row. For a gate that resolves a
smaller call rather than a full artifact, also log one dated line in
`DECISIONS.md`. State the new status and the artifact path in your final message
so the next agent can read it from `docs/GATES.md` alone.
