# Session handoff (2026-06-25) — groundwork foundation

> For the agent picking this up. This is the foundation's own handoff (distinct
> from `template/docs/HANDOFF.md`, which is the per-project template it ships).
> Read this, then `docs/WORLD_CLASS_ROADMAP.md`, then `DECISIONS.md`.

## TL;DR

`groundwork` is a model-agnostic, Copier-based project-foundation builder. It is
public at `github.com/SynSe7en7/groundwork`, shipped through **v0.3.0**, with all
CI green. Local clone: `~/Dev/groundwork`. The originating repo (where the work
started and where cross-session memory lives) is `~/Dev/lab-gmp-automation`.

The immediate next work is the world-class roadmap: start at Phase 0 (quick
security hardening, v0.3.1) and Phase 1a (make the foundation testable), then
Phase 1b (the governed-update channel as the headline product). The strategic
through-line: the moat is governed updates across a fleet of aligned projects,
not the presets. Invest there.

## What groundwork is (architecture you must know)

- **Copier template** (also a GitHub template). Source lives under `template/`;
  the repo root holds the foundation's own meta (`copier.yml`, `CHARTER.md`,
  `DECISIONS.md`, `docs/`, CI).
- **AGENTS.md is the canonical, model-agnostic instruction spine.** Thin per-tool
  bridges point at it: `CLAUDE.md` is one line (`@AGENTS.md`), `.gemini/settings.json`
  lists it in `context.fileName`, `.aider.conf.yml` `read:`s it, `.cursor/rules`
  and `.github/copilot-instructions.md` are pointers. Adding a tool is one file.
- **Alignment gates** (in `template/docs/GATES.md`): Charter upfront; Stack/ADR,
  PRD/Plan, Design, Deploy/Security just-in-time. Lifecycle not-started/open/
  ratified/superseded. AGENTS.md carries the trigger logic.
- **Committed-docs memory**: CHARTER, CONTEXT, DESIGN, VISION, docs/adr, docs/prd,
  docs/plan, DECISIONS, GATES, HANDOFF. Vendor memory is a thin pointer only.
- **Four presets + a core overlay.** web (Next.js 16), mobile (Expo + React
  Native Web, RN styling not Tamagui), desktop (Tauri 2), hybrid (Turborepo +
  Tamagui/Solito), and `project_type=core` which overlays the governance layer
  onto an EXISTING repo. Supabase backbone, Vercel web, Modal heavy-compute
  escape hatch.
- **v0.3 skills/loops**: `skills/discovery` (3-round PM/CEO session writing
  CHARTER/VISION/PRD, gate-bound), `skills/run-gate`, `loops/tdd-red-green-refactor`,
  `loops/plan-execute-verify`, `loops/README.md` (appropriateness gate),
  `loops/LOOPS.md` (state). SKILL.md is the open cross-tool standard (agentskills.io).

## Release history

- **v0.1.0**: core + 4 presets + core-overlay install.
- **v0.2.0**: hardening after a red-team review. Fixed the broken `copier update`
  path (shrank `_skip_if_exists`), made CI build-verify every preset in its app
  dir, dropped Tamagui from mobile, fixed web/desktop/hybrid build breaks, went
  PUBLIC.
- **v0.3.0**: discovery-driven skills/loops layer + VISION.md + CI lint.

## How the dev loop works (reproduce this)

There is no global `copier`/`uv`; validate with a throwaway venv:

```bash
python3 -m venv /tmp/gw-venv && /tmp/gw-venv/bin/pip -q install copier
CP=/tmp/gw-venv/bin/copier
# render a preset locally from HEAD (commit first; copier reads the git ref):
$CP copy --defaults --trust --skip-tasks --vcs-ref HEAD \
  --data project_name="T" --data project_type=web ~/Dev/groundwork /tmp/r
# lint skills/loops:
python3 ~/Dev/groundwork/scripts/lint_skills_loops.py
```

CI (`.github/workflows/ci.yml`) build-verifies every preset (web full build,
mobile/hybrid typecheck, full desktop Tauri Rust build, core render), runs a
`copier update` propagation sentinel test, and runs the skills/loops lint. Watch
a run: `gh run watch <id> --repo SynSe7en7/groundwork --exit-status`.

Workflow: feature branch -> PR into main -> CI green -> squash-merge ->
`git tag -a vX.Y.Z` + push tag. Network pushes were occasionally flaky; retry.

## Copier conventions and HARD-WON GOTCHAS (these cost real time)

- **`_skip_if_exists` must stay small** (user-owned seed-once files only: README,
  .gitignore, .env.example, CHARTER, CONTEXT, DESIGN, DECISIONS, VISION). A broad
  list silently breaks `copier update` (governance files never propagate while the
  version label advances). A CI sentinel test guards this; keep it.
- **Jinja brace handling**: `_envops` remaps delimiters to `[[ var ]]` / `[% if %]`,
  and only `*.jinja` files are content-rendered. Framework files with literal
  `{{ }}` / `${{ }}` / just `{{var}}` are NOT `.jinja`, so they copy byte-for-byte.
  Never put a literal `[[` or `[%` in the TEXT of a `.jinja` file (it parses and
  crashes). TOML `[[bin]]` in a `.jinja` would corrupt silently.
- **`.jinja` suffix must be the literal trailing extension.** A conditional root
  file is `[% if c %]name[% endif %].jinja`, NOT `[% if c %]name.jinja[% endif %]`
  (the latter is not recognized as a template).
- **Two template files rendering to the same dest path** makes Copier try to
  prompt interactively, which crashes headless (kqueue EINVAL). That is why the
  hybrid root README ships as `MONOREPO.md`.
- **Copier 9.x refuses templates with `_tasks` unless `--trust`.** Use
  `--skip-tasks` for clean render validation.
- **Preset content drafted by sub-agents came back HTML-escaped** (`&lt;` etc.);
  unescape (`html.unescape`) before writing files.
- **Conditional directories** are literal bracket-named dirs, e.g.
  `template/[% if project_type == 'web' %]web[% endif %]/...`. Editing them needs
  quoted paths; the Edit tool needs a Read first.

## Stack-specific lessons baked into the presets

- **Tamagui does not typecheck against React Native 0.83 (Expo SDK 55)**; the
  standalone mobile preset uses React Native styling. Tamagui stays the hybrid
  shared design system (pinned v1.144 + `@tamagui/config/v4`).
- **Next.js 16 removed `next lint`** and the `eslint` next.config key; use
  `eslint .` with a flat `eslint.config.mjs` from `eslint-config-next` native
  exports (not FlatCompat, which throws under ESLint 9).
- **Tauri `generate_context!` needs icon files**; the desktop preset ships
  placeholder PNG/icns/ico (regenerate via `npx tauri icon` for a real release).
- **Hybrid `@PROJECT_SLUG_PLACEHOLDER`** is replaced by a Copier `_task` at
  generation; pnpm needs `node-linker=hoisted` for RN.

## Research captured (so nothing is lost)

Full research lived in workflow transcripts (ephemeral, now gone). The distilled
conclusions are preserved here, in `DECISIONS.md`, and in the lab-gmp-automation
memory files (`~/.claude/projects/-Users-vpproduct-Dev-lab-gmp-automation/memory/`,
especially `project-foundation-initiative.md`).

- **Model-agnostic config (early 2026)**: AGENTS.md is the cross-tool standard
  (Linux Foundation AAIF, Dec 2025), read natively by Codex/Cursor/Copilot/
  Windsurf/Zed; holdouts (Claude Code, Gemini CLI, Aider) bridged by pointer
  files, not symlinks (Windows-safe). This shaped the spine.
- **Skills/loops (Apr-Jun 2026)**: SKILL.md is an open standard (agentskills.io,
  published 2026-04-13); frontmatter is name + description only; progressive
  disclosure; **8-12 skill ceiling** before context tax and worse selection.
  References mined: `obra/superpowers` (skills-as-methodology, artifact handoff;
  it REMOVED a heavy subagent-review loop as over-engineering for capable models),
  `garrytan/gstack` (persona lifecycle; slash-command-coupled, borrow ideas not
  shape), spec-kit and BMAD (discovery/gate sequencing), and the inner/outer
  "Loop Engineering" dual-loop framing. Frontier models need rich context, not
  step decomposition; do not over-decompose.
- **The seven-dimension world-class review** (the basis for the roadmap). Core
  finding: groundwork is over-invested in replicable surface (presets, full
  desktop/hybrid CI) and under-invested in its moat (governed updates across a
  fleet). Already at the bar: the AGENTS.md spine, the copier-update model + CI
  sentinel, the brace-clash defense, the gate/loop guardrail rigor, the discovery
  skill, the RLS/secrets posture. The roadmap rebalances toward the moat.

## The plan (improved) — see docs/WORLD_CLASS_ROADMAP.md

Release ladder, moat-first:

- **v0.3.1 Phase 0** (quick, no deps): SHA-pin all GitHub Actions (the desktop
  `release.yml` is worst case: floating `tauri-action@v0` holds the signing
  secrets), add secret-scanning (gitleaks) to generated CI, commit lockfiles +
  frozen installs, add SECURITY.md. **Pull forward: demote desktop+hybrid to
  render-only in CI** to cut cost now.
- **v0.4.0 Phase 1** (the headline): 1a make the foundation testable (golden
  snapshots, option-combination matrix, every-prior-version + core-overlay update
  tests, content-validating lint, release automation via changesets, rebalanced
  CI); 1b update-as-product (`just doctor` for prereqs+drift,
  `foundation-update --preview`, Renovate copier manager in spawned projects +
  on the foundation, scheduled drift signal, README repositioned around governed
  updates, the pull-up `harvest` path that promotes a proven pattern back into the
  foundation). Lead with the tracer-bullet slice: every-prior-version update test
  + one harvest round-trip. Build test-first (dogfood the loops).
- **v0.5.0 Phase 2**: gate enforcement teeth (PR diff -> gate must be ratified,
  with exemption), clarify/analyze gates (spec-kit parity), ADR integrity,
  build provenance + SBOM for desktop binaries, Dependabot/CodeQL in generated
  CI, run-heavy edge-fn hardening.
- **v0.6.0 Phase 3**: branded `create-groundwork` entry, one-command deployed
  preview, foreground first run, a runnable example + transcript, CONTRIBUTING,
  the "why us vs the field" positioning paragraph.
- **v0.7.0+ Phase 4 (demand-gated)**: factor shared primitives + contract
  invariants, a non-JS backend preset, a preset/skill registry seam, conditional
  skill shipping, the orchestrator + roadmap loops, vendored skills.

Non-goals: no marketplace, DSL, telemetry infra, or speculative presets.

## Open items

- **PR #4** (`docs/world-class-roadmap`): the roadmap + this handoff. (Being
  merged to main as part of this handoff.)
- **Foundation does not yet dogfood its own AGENTS.md/GATES.md/ADRs** (Phase 2
  item); this HANDOFF.md is a first step toward that.
- **Open task chip on lab-gmp-automation**: rotate + scrub the live credentials
  committed in `lab-gmp-automation/DEPLOY.md` (separate repo, unrelated to
  groundwork but tracked).

## Working preferences (the owner, Wyatt)

No em-dashes or double hyphens, no emojis, never the negation-setup pattern
("not X, it's Y"). Plain and non-sycophantic. Prefers artifacts/plan docs for
deliverables and a feature-branch + PR workflow. Plan-first, then build, then
verify; CI-enforce claims; report honestly when something is not yet proven.
