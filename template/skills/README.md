# Skills

Skills are portable, model-agnostic how-tos. Each is a `skills/<name>/SKILL.md`
folder: a single instruction file with YAML front-matter, read natively by Claude
Code, Codex, Gemini CLI, Cursor, Copilot, and any other tool that follows the
open SKILL.md standard (agentskills.io). A committed `skills/` directory travels
with the repo, so the same procedure is available to whatever agent opens it.

A skill in groundwork is a reusable procedure that ends by writing a committed
artifact the alignment gates already trust (a gate doc, a PRD, a plan, a
DECISIONS.md line). It is not a place to restate AGENTS.md. If a behavior is
always-on, it belongs in AGENTS.md; a skill is the just-in-time how-to an agent
reaches for when a specific job starts.

## The authoring contract

Every `SKILL.md` follows the open standard. Hold to it exactly:

- Front-matter carries two fields and only two: `name` and `description`.
  - `name`: at most 64 chars, lowercase letters, numbers, and hyphens only.
    Never the words `claude` or `anthropic`.
  - `description`: at most 1024 chars, written in the third person. Sentence one
    states what the skill does. The rest states when to reach for it, opening
    with `Use when` and naming concrete triggers. This text is the only thing an
    agent sees when deciding whether to load the skill, so it carries the whole
    routing decision.
- Body under roughly 500 lines. A skill that needs more is two skills, or it is
  leaning on reference files.
- Reference files one level deep only. A skill may point to a sibling file in its
  own folder; it does not build a tree of nested references an agent has to walk.
- Plain voice, matching the rest of the repo: no em-dashes or double hyphens, no
  emojis, no negation-setup phrasing.

Write the description for the reader who has never seen the body. If the triggers
are vague, the skill loads at the wrong time or never loads at all.

## The 8 to 12 ceiling

Keep the committed skill count between roughly 8 and 12. This is the dominant
design constraint, and it is a real ceiling, for three reasons:

- Context tax. Every skill description is in the agent's context on every turn,
  whether or not the skill is used. A long roster bills tokens against work that
  never touches it.
- Silent description drop. Past a tool budget, some agents stop surfacing the
  full description list and the skill becomes invisible to selection. The failure
  is quiet: the skill is present in the repo and never gets picked.
- Worse selection. The more near-duplicate descriptions compete, the more often
  the agent picks the wrong one or hesitates. Fewer, sharper skills route better.

So curate, do not accumulate. A skill earns its slot by being reached for. When a
new one is worth more than the weakest current one, replace, do not append.
Generic engineering skills are vendored from upstream libraries later, against
real demand, never authored speculatively here.

## How selection works (v0.3)

There is no separate runtime router. Selection happens in two deterministic
layers, both grounded in committed state:

- Which skills ship. Determined deterministically from `.copier-answers.yml`
  (`project_type`, `has_ui`, `use_supabase`, `use_modal`) at generation, plus
  whatever the discovery session marks active. A backend-only `core` project does
  not carry UI skills; a project with no heavy compute does not carry Modal ones.
- Which skill runs now. Description-driven at runtime. The agent reads the
  `description` front-matter of the shipped skills and routes by matching the
  current job against the `Use when` triggers. The description is the router.
  This is exactly why the authoring contract treats it as load-bearing and why
  the 8 to 12 ceiling protects routing quality.

The AGENTS.md skills index is the portable backstop: a tool that does not read
`skills/` folders natively still sees the roster and triggers there.

## Shipped skills

| Skill | What it does | Trigger |
|---|---|---|
| `discovery` | Runs the PM/CEO discovery interview that fills `CHARTER.md`, `VISION.md`, and `docs/prd/`, then flips the Charter and PRD gates and marks the project's starting skills and loops active. | First session of a new or freshly-adopted project, before feature work, when `CHARTER.md` or `VISION.md` is still template-filled. |
| `run-gate` | Walks any one alignment gate's key questions, drafts or updates its artifact, and sets its status in `docs/GATES.md`. | An activity is about to start whose gate (Stack/ADR, PRD/Plan, Design, Deployment & Security) is not yet ratified. |
| `harvest` | Promotes a pattern proven in this project up into the foundation: confirms the two-real-instances bar, generalizes it, and opens a foundation pull request with the required CI coverage. | A pattern, helper, skill, loop, or ADR has proven itself here and should become a foundation default, or the user says "harvest this" or "promote this upstream". |

Keep this table in sync with the folders. A skill that exists but is missing here
is invisible to any tool reading the portable backstop.
