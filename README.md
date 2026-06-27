# groundwork

groundwork is a model-agnostic project foundation with a governed-update channel.
Improve the foundation once and `copier update` carries the change into every
project you have already generated; `harvest` promotes a pattern proven in a real
project back up, so the next release shares it with all of them. That two-way
channel is the point. Scaffolding a good starting project is the table stakes
underneath it.

It supports four equally-maintained scaffolds (web, mobile, desktop, hybrid). A
project's scaffold is assigned during discovery from its real requirements, and
the project then carries only that scaffold. groundwork is a Copier template and
also a GitHub template repository.

## Why groundwork

Methodology kits (superpowers, spec-kit) give you process but no running stack and
no way to push an improvement into the projects you already started. Scaffolders
(create-t3-app, cookiecutter, Vercel templates) give you a running stack but no
governance and no update path once you have cloned them. groundwork is the one
that does both: a build-verified stack and an agent-governance layer that
`copier update` carries into every project you have generated, and `harvest`
carries proven patterns back up.

Every behavioral claim it makes is backed by a CI check that fails the pull
request if the claim breaks: a full matrix of render, build, and lint jobs plus
15 version-by-scaffold update cells that prove a generated project can take a
foundation update without losing its own work. The fleet-scale outcome (a set of
real projects all sitting on the latest tag with no manual update step) lands once
a second project is generated and tracked.

## The update channel (the point)

A project generated from groundwork stays connected to it:

```
just doctor                       # prerequisites, clean tree, and whether you are behind the latest release
just foundation-update-preview    # dry-run the next update (writes nothing)
just foundation-update            # 3-way merge the latest foundation release in
just foundation-update-to vX.Y.Z  # pin to a specific version
```

Updates require a clean tree; resolve any conflict markers, then run `just verify`.

The reverse direction closes the loop. When a pattern, skill, loop, or decision
proves itself in a real project, the `harvest` skill promotes it back into the
foundation, gated by the two-real-instances bar, so every project inherits it on
the next update. See [HARVEST.md](HARVEST.md).

## What a spawned project gets

- `AGENTS.md`: the canonical, tool-neutral instruction file. Read natively by Codex, Cursor, Copilot, Windsurf, Zed and others; bridged to Claude Code, Gemini CLI, and Aider by one-line pointer files.
- Alignment gates: a `docs/GATES.md` state file plus committed gate artifacts (CHARTER, ADRs, PRD and plan, DESIGN, security checklist). Decisions are written down before the work that depends on them.
- Skills and loops: model-agnostic how-tos (`discovery`, `run-gate`, `harvest`) and work cycles, read by any SKILL.md-aware tool.
- Stack defaults: Supabase backbone, Vercel for web, Modal as the heavy-compute escape hatch, and one of the four scaffolds.
- Hygiene and CI: secrets as placeholders only, deny rules on `.env`, a secret scanner, lockfiles with frozen installs, and content-drift snapshots.

## Spin up a project

### Quickest start: the create-groundwork wrapper

One command preflights prerequisites, generates the project, and offers the first
run (install deps, then `just verify`):

```
curl -LsSf https://raw.githubusercontent.com/SynSe7en7/groundwork/main/scripts/create-groundwork.sh | bash -s -- ./my-new-project
```

It is a thin wrapper over the Copier path below; pass any `copier` arguments after
the destination (for example `--data project_type=web` or `--vcs-ref vX.Y.Z`).

### Path A: Copier (for anything long-lived; stays updatable)

```
uvx copier copy --trust gh:SynSe7en7/groundwork ./my-new-project
```

Runs the questionnaire, materializes one scaffold, writes `.copier-answers.yml` pinned to the foundation tag, and inits fresh git history. Pin a known version with `--vcs-ref vX.Y.Z`. Afterward, `cd` in and run `just setup` then `just verify`.

### Path B: GitHub template (zero-install, one-off)

Use the green "Use this template" button. No Copier or Python needed, but the project is not wired for updates. To adopt updates later, run `uvx copier copy --trust gh:SynSe7en7/groundwork .` over the checkout once to generate the answers file, then commit it.

### Existing project (governance overlay)

Add the governance layer (AGENTS.md, the alignment gates, the committed-decision docs, hygiene, CI) to a repo you already have, without touching app code:

```
cd /path/to/your/repo
uvx copier copy --trust --data project_type=core gh:SynSe7en7/groundwork .
```

Existing files are never overwritten, and no commit is made. See [INSTALL.md](INSTALL.md) for the full guide, including a block an AI coding agent can run verbatim.

## Repo layout

- `template/` everything a spawned project receives.
- `copier.yml` the questionnaire and engine config.
- `CHARTER.md`, `DECISIONS.md`, `docs/adr/` the foundation's own charter and decisions.
- `HARVEST.md` the ritual for promoting a proven pattern from a project back into the foundation.

## Requirements

- `uv` (provides `uvx`) for Path A and updates: `curl -LsSf https://astral.sh/uv/install.sh | sh`.
- `just` for the task runner in spawned projects: `brew install just` (or see just.systems).

## Versioning

The foundation is tagged with semver and released with release-please from conventional commits: `feat` is a new capability (a minor bump while pre-1.0), `fix` is a patch, and a breaking change bumps the minor until 1.0. A release is cut by merging release-please's release pull request, which writes the tag, the GitHub Release, and `CHANGELOG.md`. All four scaffolds are first-class and stay build-verified on every change. Published tags are never moved.

## Contributing

Contributions are held to the same bar a spawned project is. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the two-real-instances rule, where a new
skill, loop, or ADR goes, the CI gate it must pass, and the harvest path for
promoting a pattern proven in a real project back into the foundation.
