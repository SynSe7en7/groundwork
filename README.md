# groundwork

A reusable, model-agnostic foundation for new projects (web, mobile, desktop, hybrid). It carries the guardrails, alignment gates, committed-decision memory model, deploy and security runbooks, repo hygiene, and tool-neutral agent config a project should start with, so a new app begins aligned instead of improvised.

It is a Copier template and also a GitHub template repository.

## What a spawned project gets

- `AGENTS.md`: the canonical, tool-neutral instruction file. Read natively by Codex, Cursor, Copilot, Windsurf, Zed and others; bridged to Claude Code, Gemini CLI, and Aider by one-line pointer files.
- Alignment gates: a `docs/GATES.md` state file plus committed gate artifacts (CHARTER, ADRs, PRD and plan, DESIGN, security checklist). Decisions are written down before the work that depends on them.
- Stack defaults: Supabase backbone, Vercel for web, Modal as the heavy-compute escape hatch. One of four presets (web, mobile, desktop, hybrid).
- Hygiene: secrets as placeholders only, deny rules on `.env`, advisory CI tripwires.

## Spin up a project

### Path A: Copier (for anything long-lived; stays updatable)

```
uvx copier copy --trust gh:SynSe7en7/groundwork ./my-new-project
```

Runs the questionnaire, materializes one preset, writes `.copier-answers.yml` pinned to the foundation tag, and inits fresh git history. Pin a known version with `--vcs-ref vX.Y.Z`.

### Path B: GitHub template (zero-install, one-off)

Use the green "Use this template" button. No Copier or Python needed, but the project is not wired for updates. To adopt updates later, run `uvx copier copy --trust gh:SynSe7en7/groundwork .` over the checkout once to generate the answers file, then commit it.

## Update the foundation in a project

```
just foundation-update             # 3-way merge the latest foundation release in
just foundation-update-to vX.Y.Z   # pin to a version
```

Requires a clean working tree. Resolve any conflict markers, then run `just verify`.

## Repo layout

- `template/` everything a spawned project receives.
- `copier.yml` the questionnaire and engine config.
- `CHARTER.md`, `DECISIONS.md`, `docs/adr/` the foundation's own charter and decisions.

## Requirements

- `uv` (provides `uvx`) for Path A and updates: `curl -LsSf https://astral.sh/uv/install.sh | sh`.
- `just` for the task runner in spawned projects: `brew install just` (or see just.systems).

## Versioning

The foundation is tagged with semver. Patch is guardrail and doc fixes, minor is new optional capability behind a toggle (with a default), major is a breaking restructure (ships a MIGRATING note). Published tags are never moved.
