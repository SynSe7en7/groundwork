---
name: discovery
description: Runs the post-install PM/CEO discovery session that turns a freshly scaffolded groundwork project into a ratified product direction. It interviews the owner across three rounds (Vision, Product, Selection) plus an optional Architect-lite round, asking 2-3 questions at a time and waiting, then writes CHARTER.md, VISION.md, docs/prd/, and the activated skills and loops index, flipping the matching gates in docs/GATES.md from not-started to open to ratified. Use when a project was just generated from groundwork and the gates are still not-started, or when the owner says "run discovery", "set the product vision", "kick off the charter", "what are we building", "onboard this project", or asks to fill in CHARTER.md / VISION.md / the PRD from a blank template.
---

# Discovery

The first conversation a groundwork project has with its owner. It converts a
blank scaffold into a ratified direction: a thesis someone is accountable for, a
product framed by the four risks, and a chosen set of skills and loops. It is an
interview, not a form. Run it once at inception, and again only when the owner
declares a pivot large enough to reopen the Charter.

## Philosophy

The owner holds the context; the model holds the discipline. Your job is to pull
the bet, the buyer, and the constraints out of the owner's head and write them
down so every later agent reads the same truth. You make no product decision in
Round 1. You decide nothing the owner has not said or accepted. Every artifact
you write is a gate the owner ratifies on read-back, never something you declare
done on your own.

Frontier models do not need step decomposition; they need the owner's real
context. So this skill is mostly cadence and restraint. Resist the urge to
design the product before you understand the bet.

## Anti-pattern: the questionnaire dump

A discovery that dumps every question at once and then writes the whole charter
from one wall of answers has interviewed nobody. It has transcribed a form.

WRONG: "Here are 14 questions covering vision, users, success metrics,
constraints, scope, the four product risks, and skill selection. Answer them all
and I'll generate your CHARTER.md, VISION.md, and PRD." (The owner skims, answers
shallowly, and the artifacts inherit the shallowness.)

RIGHT: "Two to start. (1) In one sentence, what is the bet this project makes?
(2) Walk me through the last time someone hit the problem you're solving, the
real episode. My default if you're unsure on framing: I'll write the thesis and
read it back for you to accept or correct. Take your time." Then you wait.

## Cadence (the core of this skill)

This is the phase that makes or breaks the session. Hold it on every round.

- Ask 2 to 3 questions, then stop and wait for answers. Never dump a long list.
- Always offer a recommended default the owner can take with one word ("accept",
  "yes", "use that"). A good default moves faster than a blank prompt.
- Probe a vague answer once. If it stays vague, proceed on a stated assumption:
  "I'll assume <X> and note it as an assumption you can revisit." Then move on.
- Explore before you ask. If the answer is already in the repo, read it instead
  of asking: check `.copier-answers.yml` for the chosen preset and toggles,
  `README.md` and `project_description` for stated intent, `CONTEXT.md` for any
  domain language, and any docs the owner pasted. Ask only what the repo cannot
  tell you.
- One steelman pass at the very end of a round, not throughout. The body of the
  interview is generative and warm; the close is adversarial.

## Rounds

Default three rounds plus an optional fourth. Each round maps to exactly one gate
in `docs/GATES.md`. Open the gate when the round starts, ratify it on the owner's
read-back. Do not start a later round's gate early.

### Round 1: Vision

Gate: Charter / Product thesis. Read `docs/GATES.md` and `CHARTER.md` first; if
the owner already drafted either, build on it instead of overwriting.

Pull these out, 2 to 3 questions at a time:

- The thesis: one sentence, the bet this project makes.
- Who it is for and the job they hire it to do. Anchor this in a concrete recent
  episode, the last real time someone hit the problem, not a persona sketch.
- What success looks like in plain terms. Measurable where it can be.
- The hard constraints: data sensitivity, compliance, cost ceiling, fixed dates,
  platform.
- The explicit non-goals: what this will deliberately not do.
- The owner: who ratifies gates and accepts merges.

When the round closes, set the Charter gate to open in `docs/GATES.md`, then
write `CHARTER.md` (filling the existing template's thesis, who-and-the-job,
success, constraints, non-goals, owner) and `VISION.md` (the longer-form
narrative of the bet and the world it is betting on, where CHARTER.md is the
compression). Read both back. On the owner's acceptance, set the gate to ratified
and the artifact front-matter `status` to accepted.

### Round 2: Product

Gate: PRD / Plan. Frame the product through the four risks, and get a real answer
on each:

- Value: will anyone want this enough to change behavior? What pulls them?
- Usability: can the intended user actually operate it?
- Feasibility: can it be built with what this team and stack have?
- Viability: does it work for the business (cost, pricing, compliance, the
  owner's constraints)?

Ask the riskiest one first; that is where the project most likely dies. When the
round closes, set the PRD / Plan gate to open and write the first PRD to
`docs/prd/<slug>.md` from `docs/prd/_TEMPLATE.md`, organized so each section
answers one of the four risks and names its open questions. Read it back; ratify
on acceptance.

### Round 3: Selection

Gate: PRD / Plan (this round sharpens the same gate into an activation decision;
ratify it again on read-back). Decide which skills and loops this project turns
on. Read `.copier-answers.yml` to ground the decision in what was actually
scaffolded:

- `project_type` (web / mobile / desktop / hybrid / core), `has_ui`,
  `use_supabase`, `use_vercel`, `use_modal`, `include_two_env_discipline`.
- A UI surface (`has_ui` true) argues for the Design gate and a design loop.
- `include_two_env_discipline` true argues for the deploy and promotion loops.
- The PRD's riskiest dimension argues for the loop that attacks that risk (a
  feasibility risk wants a tdd or diagnose loop; a value risk wants discovery to
  stay open longer).

Activate only what at least one real, named need in the PRD demands. Do not turn
on a loop for a hypothetical future. For each activation, write one line of why.

When the round closes:

- Update `loops/LOOPS.md` (create it if absent) with the activated loops, each
  with its trigger and done-definition in one line.
- Update the skills and loops index in `AGENTS.md` so every later agent sees what
  is on. If the index section does not yet exist, add a short "Skills and loops"
  section listing the activated entries and pointing at `loops/LOOPS.md`.
- Read the activation set back. Ratify the gate on acceptance.

### Round 4 (optional): Architect-lite

Gate: Stack & Architecture, prepared but not pre-decided. Run this only if the
product implies a load-bearing choice the default stack does not obviously cover
(a non-Supabase datastore, a Modal hot-path temptation, a third runtime). Sharpen
the thesis against `CONTEXT.md` and any existing ADRs, surface the one or two
decisions that will need an ADR, and stop. Do not write the ADR here; that is the
Stack gate's own just-in-time work. Leave the Stack gate at open with a note
naming the pending decision, so the next session writes the ADR before building.

## Per-round checklist

Run this every round before moving on:

- [ ] Read the repo for answers already present before asking.
- [ ] Asked 2 to 3 questions, then waited. No dumps.
- [ ] Offered a one-word-acceptable default on each open question.
- [ ] Probed each vague answer once, then stated an assumption and moved on.
- [ ] Ran the closing steelman pass and recorded what survived it.
- [ ] Set the round's gate to open before writing, ratified on read-back.
- [ ] Wrote the artifact and set its front-matter `status` to accepted on ratify.
- [ ] Logged the round to `DECISIONS.md` as one dated line.

## The closing steelman

At the end of each round, before writing the artifact, turn adversarial for one
pass. Attack the strongest version of the owner's own position:

- Charter: who is the buyer who would not hire this, and why? What constraint did
  we wave away that will bite later?
- Product: which of the four risks did we answer with a hope instead of evidence?
- Selection: which activated loop has no real instance demanding it yet?

Surface what breaks, let the owner respond, and fold survivors into the artifact.
A position that survives the steelman is worth ratifying; one that does not gets
revised before it is written down.

## Exit

Discovery is done when the Charter gate is ratified, at least one PRD is ratified,
the activated skills and loops are written to `AGENTS.md` and `loops/LOOPS.md`,
and the owner has read back and accepted each artifact. Stop there. Do not roll
into building the product; that is the next session's work, gated by the plans
this discovery produced.

Stop early and hand back to the owner if: the owner cannot state a thesis after
one probe (the project is not ready for discovery; capture what exists and pause),
or a gate read-back is rejected twice on the same point (escalate the
disagreement to the owner as the decision-maker rather than guessing a third
time).

## Handoff

Discovery writes these committed artifacts and nothing else:

- `CHARTER.md` and `VISION.md` (Round 1), with `status: accepted` on ratify.
- `docs/prd/<slug>.md` (Round 2).
- `loops/LOOPS.md` and the skills-and-loops index in `AGENTS.md` (Round 3).
- `docs/GATES.md` rows flipped not-started to open to ratified for each round's
  gate, with the date bumped.
- `DECISIONS.md`: one dated line per round, naming the gate ratified.

These are the inputs the next agent reads at session start. Discovery leaves no
state anywhere else.
