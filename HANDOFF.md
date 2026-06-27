# Session handoff (2026-06-27) — groundwork foundation

> For the agent picking this up. Read this, then `docs/WORLD_CLASS_ROADMAP.md`,
> then `DECISIONS.md`. The lab-gmp-automation auto-memory
> (`project-foundation-initiative`) carries the same state and points here first.

## TL;DR

`groundwork` is a model-agnostic, Copier-based project-foundation builder with a
governed-update channel. Public at `github.com/SynSe7en7/groundwork`, local clone
`~/Dev/groundwork`. It is **shipped through v0.9.0**, CI all green, main clean.
**Phase 2 is complete (6 of 6); Phase 3 is essentially complete.**

This session executed the World-Class Roadmap from v0.3.0 to v0.9.0:
- **v0.4.0** — Phase 0 (security hardening) + Phase 1a (the foundation as software
  under test).
- **v0.5.0** — Phase 1b (the governed-update channel as a product).
- **v0.6.0** — Phase 2 governance/security teeth (4 of 6 items).
- **v0.7.0** — Phase 2 spec-kit parity (the 5th item).
- **v0.8.0** — Phase 2 build provenance + SBOM (the 6th item; wired, verification
  deferred to a real desktop release). Phase 2 done.
- **v0.9.0** — Phase 3 adoption: `CONTRIBUTING.md`, README positioning, the
  `create-groundwork` wrapper, `just setup` + first-run, and the web Vercel deploy
  path. Plus the first tracked instance (`SynSe7en7/groundwork-example-web`).

**The immediate next work**: short Phase 3 tail, then Phase 4 (demand-gated).
Phase 3 is essentially done — all six items shipped. The remaining tail is small:
(1) deploy the example to a live preview URL with one `just deploy-preview` (needs
the Vercel CLI authenticated) to fully close the "live URL in minutes" acceptance,
and (2) the formal harvest round-trip via the `harvest` skill + `HARVEST.md`, now
doable because a second tracked instance exists. The two wire-now-verify-later
items still want a real run: the desktop **build provenance + SBOM** (`gh
attestation verify` on a real desktop release) and the web **Vercel deploy** path.
The roadmap marks every shipped item inline.

## How releases work now (changed this session)

Versioning is **commit-driven via release-please**, not manual tags.
- Conventional-commit PR/squash titles drive it: `feat:` -> minor, `fix:` ->
  patch, breaking -> minor while pre-1.0. `ci:`/`chore:`/`docs:` do not bump.
- release-please keeps an open **release PR** (`chore(main): release X.Y.Z`).
  **You cut a release by merging that PR**; release-please then writes the tag,
  the GitHub Release, and `CHANGELOG.md`. There is no manual `git tag`.
- Config: `release-please-config.json` + `.release-please-manifest.json` (current
  baseline `0.7.0`), `release-type: simple`, `bump-minor-pre-major`.
- **Required repo setting** (cost a failed run to learn): Settings -> Actions ->
  General -> "Allow GitHub Actions to create and approve pull requests" must be
  ON, else release-please builds the branch but cannot open the PR. Set via
  `gh api -X PUT repos/SynSe7en7/groundwork/actions/permissions/workflow -F can_approve_pull_request_reviews=true`.
- After cutting, the post-merge release-please run creates the tag a beat later;
  do not conclude it failed if the tag is not instant (it was a recurring
  false alarm this session).

## What groundwork is (architecture you must know)

- **Copier template** (also a GitHub template). Source under `template/`; the repo
  root holds the foundation's own meta (`copier.yml`, `CHARTER.md`, `DECISIONS.md`,
  `HARVEST.md`, `docs/`, CI, the `scripts/` verification tooling).
- **AGENTS.md is the canonical model-agnostic spine.** Thin per-tool bridges point
  at it (`CLAUDE.md` = `@AGENTS.md`, `.gemini/settings.json`, `.aider.conf.yml`,
  `.cursor/rules`, `.github/copilot-instructions.md`). Adding a tool is one file.
- **Four first-class scaffolds** (the scaffold model, locked by the owner this
  session): web (Next.js 16), mobile (Expo + RN Web), desktop (Tauri 2), hybrid
  (Turborepo + Tamagui/Solito), plus `project_type=core` (governance overlay onto
  an existing repo). All four are equally build-verified at the foundation on every
  change; discovery assigns one to each project, which then rides only that
  scaffold. **No scaffold is ever demoted/deprecated** to save CI cost.
- **Alignment gates** (`template/docs/GATES.md`): Charter (upfront); Stack/ADR,
  PRD/Plan, Clarify, Design, Deploy/Security (just-in-time). Now **CI-enforced** in
  generated projects (see below).
- **Skills (4, under the 8-12 ceiling)**: `discovery`, `run-gate`, `harvest`
  (pull-up to the foundation), `analyze` (cross-artifact consistency). **Loops**:
  `tdd-red-green-refactor`, `plan-execute-verify`.

## The dev loop (reproduce this)

No global `copier`/`uv`; validate with a throwaway venv:
```bash
python3 -m venv /tmp/gw-venv && /tmp/gw-venv/bin/pip -q install copier
CP=/tmp/gw-venv/bin/copier
# render a scaffold from HEAD (copier reads the committed git ref; commit first):
$CP copy --defaults --trust --skip-tasks --vcs-ref HEAD --data project_type=web --data project_name=T . /tmp/r
```
Verification scripts in `scripts/` (run before pushing; CI runs them too):
- `COPIER_CMD=$CP python3 scripts/snapshot.py check` — golden-output content drift
  across all scaffolds (`update` to regenerate after an intentional change).
- `python3 scripts/lint_skills_loops.py` — skills/loops/gates content lint.
- `python3 scripts/check_adrs.py` — ADR index/status/supersession integrity.
- `COPIER_CMD=$CP PNPM_CMD="npx --yes pnpm@9.15.0" bash scripts/update_lockfiles.sh`
  — regenerate the committed per-scaffold lockfiles (then regenerate golden).
- `template/scripts/check-gates.sh` is the gate-enforcer shipped INTO projects.

Workflow: feature branch -> PR into main -> CI green -> squash-merge. Watch CI:
`gh run watch <id> --repo SynSe7en7/groundwork --exit-status`. **Verify the actual
job conclusions, not just the watcher exit code** (it gave a false non-zero once
this session while the slow desktop job was still finishing).

CI on main (`.github/workflows/ci.yml`): render(5 scaffolds) + build(web/mobile/
hybrid/desktop; frozen installs; desktop Rust build cached via rust-cache) +
`update-matrix` (15 cells: every prior tag x scaffold, PR-only) + `option-matrix`
(7 non-default toggle combos, PR-only) + `golden-snapshots` + `secret-scan`
(gitleaks) + `lint`(skills/loops/gates + ADRs). Plus `release-please.yml` and a
foundation `dependabot.yml` (github-actions). Generated projects also ship a
`codeql.yml`, a scaffold-aware `dependabot.yml`, and a `foundation-drift` cron.

## What remains

- **Phase 2, item 6 — build provenance + SBOM: WIRED, verification pending.** The
  desktop release workflow
  (`template/.github/workflows/[% if project_type == 'desktop' %]release.yml[% endif %]`)
  now attests build provenance for the signed bundles via
  `actions/attest-build-provenance` (one attestation per matrix leg) and emits an
  SPDX SBOM of the npm + cargo dependency graph via `anchore/sbom-action` (syft),
  attached to the release, targeting SLSA Build L2+. It still cannot be exercised
  in the foundation's render/PR CI (it only runs on a real `v*`-tagged desktop
  release), so the remaining step is to VERIFY it on the first real desktop
  project release: `gh attestation verify <bundle> --repo <owner>/<repo>` and
  confirm `sbom.spdx.json` is attached. Optional hardening follow-up: bind the
  SBOM to the binaries with `actions/attest-sbom`.
- **Phase 3 (adoption/proof): SHIPPED.** `CONTRIBUTING.md`, README positioning +
  "Why groundwork", `scripts/create-groundwork.sh` (the in-repo wrapper),
  `just setup` + the wrapper's first-run prompt (and `verify` now passes on a fresh
  scaffold via `test --if-present`), the web Vercel `deploy-preview`/`deploy` path,
  and the runnable example (`SynSe7en7/groundwork-example-web`, tracked at v0.9.0,
  builds clean, README carries the transcript). Small tail: (1) one
  `just deploy-preview` from the example to land a live URL (needs Vercel CLI auth)
  to fully close the "live URL in minutes" acceptance; (2) the formal harvest
  round-trip via the `harvest` skill + `HARVEST.md`.
- **Phase 4 (demand-gated)**: shared-primitive factoring, a non-JS backend
  scaffold, a scaffold/skill registry seam, discovery-driven scaffold assignment,
  the orchestrator/roadmap loops. Earned by a second/third real project.
- **The harvest round-trip + the projects-on-latest metric: UNBLOCKED.** The
  second project generated from groundwork now exists and is tracked
  (`SynSe7en7/groundwork-example-web`, committed `.copier-answers.yml` pinned to
  v0.9.0; the other consumer, lab-gmp-automation, is hand-wired with no answers
  file). Projects-on-latest is a real 1-of-1 on latest. The formal harvest
  round-trip is now doable; the v0.9.0 fix (remove a stray committed
  `next-env.d.ts` from the desktop template + ignore `next-env.d.ts` /
  `*.tsbuildinfo`, a gap the example surfaced) is an informal first pull-up.
  Append-only ADR git-diff check is a small follow-up.

## Conventions + gotchas (hard-won, these cost real time)

- **Render determinism / golden**: render with `--skip-tasks` and a fixed project
  name; exclude `.copier-answers.yml` (its `_commit`/`_src_path` vary). Committed
  lockfiles are STATIC files, so the snapshot hashes them verbatim.
- **`npm ci` is name-tolerant**: a committed lockfile with a fixed root name works
  for any rendered `project_slug` (verified). So static npm lockfiles are fine.
- **Hybrid pnpm lockfile**: generate with `--data project_slug=PROJECT_SLUG_PLACEHOLDER`
  so the lockfile keeps the placeholder scope; the copier slug-substitution task
  rewrites it consistently at generation (frozen install verified). Use the exact
  pinned `pnpm@9.15.0` (matches the template `packageManager`).
- **Copier delimiters are `[[ ]]` / `[% %]`**; only `*.jinja` files render. Never
  put a literal `[[`/`[%` in `.jinja` text. Single `[` (e.g. `[0-9]`, `[ -f x ]`)
  and `${var}` are safe. Conditional root files are `[% if c %]name[% endif %]`
  (non-jinja, static) or `...[% endif %].jinja` (templated). The desktop release
  workflow lives at a bracket path.
- **git gc vs copier temp cleanup**: the update-matrix flaked with
  `OSError [Errno 39] Directory not empty: .git`; fix is `git config --global
  gc.auto 0 && maintenance.auto false` in the job.
- **The Bash tool runs zsh**: unquoted `$var` does NOT word-split; pass multi-flag
  strings as bash arrays or run test scripts with `bash file.sh`.
- **The four Dependabot major bumps this session** (checkout v7, setup-node v6,
  setup-uv v8, release-please v5) were all the GitHub Node-20 -> Node-24 runtime
  migration, not interface changes; low-risk, and v5 cleared the Node-20
  deprecation warning. Dependabot keeps actions SHA-pinned.

## Owner preferences (Wyatt)

No em-dashes or double hyphens, no emojis, never the negation-setup pattern
("not X, it's Y"). Plain, non-sycophantic. Plan-first, then build, then verify;
CI-enforce claims; report honestly when something is unproven. Prefers a
feature-branch + PR workflow and approves each release cut himself.

## Product icebox

Future ideas parked in the auto-memory `groundwork-product-icebox`: a context-graph
memory layer for spawned projects (demand-gated; only valuable if it sits in the
consuming agent's read loop). The committed-docs memory model is already a curated
graph; do not build graph infrastructure speculatively.
