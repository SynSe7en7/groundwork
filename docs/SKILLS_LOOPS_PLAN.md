# Skills and Loops Plan (v0.3)

Status: building. Scope decided 2026-06-25.

A discovery-driven skills and loops layer for groundwork. After install, an agent
runs a short PM/CEO discovery session that writes the vision, charter, and PRD
into the gate docs that already exist, and uses that output to activate a small
set of skills and loops. Discovery is the selector. Skills are reusable how-tos.
Loops are repeatable work cycles.

## Why now (April to June 2026)

- `SKILL.md` is an open, cross-tool standard (published 2026-04-13, spec at
  agentskills.io), read natively by Claude Code, Codex, Gemini CLI, Cursor,
  Copilot, Windsurf, OpenCode. A committed `skills/` directory is therefore
  model-agnostic, which fits groundwork's spine. Frontmatter is `name` plus
  `description`; body under ~500 lines; three-tier progressive disclosure.
- Hard curation ceiling: roughly 8 to 12 skills before description tokens become
  a context tax every turn and weaker selection. Fewer, sharper, project-scoped
  skills win. This is the dominant design constraint.
- References to mine, not copy: `obra/superpowers` (skills-as-methodology where
  each skill hands off a committed artifact to the next), and `garrytan/gstack`
  (persona-per-phase lifecycle; borrow the ideas, not its slash-command and
  global-config shape, which is the least portable of the references).
- Loop vocabulary standardized on the inner/outer dual loop (Loop Engineering,
  June 2026): the inner loop runs inside one task; the outer loop manages that
  task's lifecycle.

## v0.3 scope (this PR)

- A `discovery` skill: a 3-round PM/CEO session (plus an optional 4th) that
  writes `CHARTER.md`, the new `VISION.md`, and `docs/prd/`.
- One new artifact, `VISION.md`: a working-backwards PR/FAQ, a North Star metric,
  a steelman section, and a machine-readable front-matter block that keys
  selection.
- A `run-gate` skill: the gate-runner that walks any alignment gate's key
  questions from `docs/GATES.md` and flips its status. Turns the gate spec from
  passive prose into something an agent actively runs.
- Two loops: `tdd-red-green-refactor` (checker: `just test`) and
  `plan-execute-verify` (checker: `just build && just lint`).
- `loops/README.md` (the loop appropriateness gate) and `loops/LOOPS.md` (the
  active-loops state file, mirroring `docs/GATES.md`).
- `skills/README.md` (index, the 8 to 12 ceiling, the authoring contract).
- An AGENTS.md "Skills and loops" section that names discovery as the first
  action and indexes what exists.
- A foundation CI lint: every `loops/*.loop.md` has an exit block and a declared
  checker; every `skills/*/SKILL.md` has valid `name` and `description`.

## Deferred (let real projects pull these, per the two-real-instances rule)

- The stage-3 `feature-delivery` orchestrator loop and the outer `roadmap-review`
  cron loop.
- The `evaluator-optimizer` review loop.
- Vendored external skills (`anthropics/skills`, `VoltAgent/awesome-agent-skills`)
  pinned by commit.
- Full `VISION.md` front-matter inference for selection and per-skill 3-eval
  regression. v0.3 selection is deterministic from `.copier-answers.yml` plus the
  loops the discovery session marks active.

## Discovery design

Frame it as the agent procedure that walks the existing Charter and PRD gates,
not a new subsystem. Forked from the mechanics of the `impeccable/shape.md`
discovery interview.

- Round 1, Vision: thesis (the bet), who it is for and the job they hire it to do
  anchored in a concrete recent episode, what success looks like, hard
  constraints, explicit non-goals, owner. Writes `CHARTER.md` and `VISION.md`.
- Round 2, Product: requirements and acceptance criteria, framed by the four
  risks to kill before building (value, usability, feasibility, viability).
  Writes `docs/prd/`.
- Round 3, Selection: the loop-determining and archetype questions that decide
  which skills and loops to activate. Updates `loops/LOOPS.md` and the AGENTS.md
  index.
- Round 4, optional, Architect-lite: sharpen the thesis against any existing
  `CONTEXT.md` or ADRs before the Stack gate.

Interview rules, so a capable model does not over-ask: ask a couple of questions
then wait, never dump; always propose a recommended default the user can accept
with a word; probe a vague answer once then proceed with a stated assumption;
explore the repo instead of asking when the answer is there; escalate to a
relentless adversarial pass only for the steelman. This is goals plus a
seed-question bank, not a rigid decision tree. Frontier models need rich context,
not scripted reasoning.

## Skills directory

- `skills/<name>/SKILL.md` portable folders are the source of truth; any
  `.claude/skills` style pointer is a thin bridge, mirroring the AGENTS.md
  pattern.
- Selection is deterministic in v0.3: `.copier-answers.yml` (`project_type`,
  `has_ui`, `use_supabase`, `use_modal`) plus whatever the discovery session
  marks active. No separate runtime router; selection is description-driven.
- Curate, do not author a pile. v0.3 ships only the groundwork-specific skills
  (`discovery`, `run-gate`). Generic engineering skills are vendored later.
- Respect the 8 to 12 ceiling. The AGENTS.md index is the portable backstop.

## Loop schema and guardrails

Each `loops/<name>.loop.md` reuses the gate field shape so there is one mental
model: `trigger`, `goal` (an explicit done-definition), `doer`, `checker`
(deterministic or LLM-judge, bound to an existing `just` command), `exit`, and
`handoff`.

Guardrails are non-optional (2026 consensus): a hard iteration cap, a token or
cost budget set from day one, no-progress detection, and a circuit breaker.
Prefer deterministic checks over the agent grading itself; reserve LLM-as-judge
(a single call scoring 0.0 to 1.0 against a fixed rubric) for when no
deterministic check exists. A tripped breaker files a Now finding into the
existing triage and logs one line to `DECISIONS.md`. No new logging system.

Loops of loops is the inner/outer split. v0.3 ships only inner and execution
loops; the outer `roadmap-review` and the `feature-delivery` orchestrator are
deferred until a real project shows genuine multi-stream or long-horizon work.
Default every new product to the two stage-2 loops and nothing more.

## What this deliberately does not build

- No heavy subagent-review loop. `obra/superpowers` removed its
  dispatch-a-subagent-to-review loop after regression testing; it is
  over-engineering for Opus 4.x and GPT-5.x class models.
- No reflexive multi-agent decomposition. A single capable agent matches
  multi-agent systems under an equal token budget (arXiv, April 2026).
- No speculative library. Ship the small core; let real projects pull the rest.
- No parallel governance. Every discovery round binds to an existing gate.
- No rigid decision tree and no "think step by step" scaffolding in the rounds.

## Integration

Everything lands as committed markdown the gates already trust. Discovery writes
CHARTER, VISION, and the PRD and flips gate status. Skills and loops are portable
files AGENTS.md references. A foundation-update CI check asserts loop files carry
an exit block and a checker. `VISION.md` is the only new artifact and is added to
`_skip_if_exists` so it is seeded once and owned by the project.
