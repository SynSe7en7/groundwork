# World-Class Roadmap

Status: revised 2026-06-26 to carry the scaffold model (all four scaffolds are
first-class at the foundation; each project rides only its assigned scaffold).
Originally drafted 2026-06-25 from the seven-dimension review.

The path from a good foundation builder to a world-class one. The review found
the moat (governed updates across a fleet of aligned projects) under-built and
buried beneath the scaffolds in the README. This roadmap invests in the moat and
makes every claim CI-enforced, while keeping all four scaffolds (web, mobile,
desktop, hybrid) first-class. The four scaffolds are the product surface, not
over-investment: discovery assigns one to each project, so any of them must be
ready and proven at all times.

## The scaffold model (read this first)

groundwork supports four scaffolds: web, mobile, desktop, and hybrid (web and
mobile sharing code). They are first-class and equally maintained. The model has
two levels, and the rest of this roadmap depends on the distinction.

- Foundation level: groundwork builds, tests, and maintains all four scaffolds to
  the same bar at all times. Discovery can assign any of them to a new project, so
  a weak scaffold means a weak project. No scaffold is ever demoted, deprecated,
  or marked experimental to save effort.
- Project level: a new project starts with no scaffold. groundwork and the project
  runner uncover its requirements during framing and scope (the discovery step),
  and discovery assigns the scaffold (sometimes more than one) that fits. From then
  on the project carries only its assigned scaffold for every later step (build,
  test, update, deploy), unless an explicit, deliberate scaffold change is made. A
  web project never compiles a desktop binary.

Consequence for cost: the foundation pays the cost of proving four scaffolds
(handled with dependency caching and a per-scaffold CI matrix). Each project pays
the cost of exactly one. The "earn it from two real projects" rule never applies
to the existing four; it applies only to adding a brand-new fifth scaffold type.

A near-term capability this implies: scaffold assignment should be an output of
discovery, not a manual upfront pick. Today the template asks for `project_type`
as an answer; the world-class version recommends and records the scaffold from the
uncovered requirements (and supports an explicit, recorded scaffold change later).
Tracked under Phase 1b positioning and Phase 4 conditional shipping.

## Thesis (the 10x bet, named)

groundwork is the one foundation that combines a runnable, build-verified stack,
an agent-governance layer, and a `copier update` channel that propagates
improvements into existing projects. Methodology tools (superpowers, spec-kit,
gstack) have no stack and no update channel. Scaffolders (cookiecutter,
create-t3-app, Vercel templates) have no governance and no update path. The
intersection is the white space.

The bet, in one line: one governed foundation that lets a solo builder run a
fleet of aligned projects that all stay current. Every phase below serves that
bet. The headline is the governed-update channel, not the scaffolds.

## Operating principles

- Earn each NEW capability or NEW scaffold type from a real consuming project (the
  two-real-instances rule). Demand-gate the at-scale work. The four existing
  scaffolds are already earned and stay first-class.
- Dogfood: the foundation runs on the discipline it ships.
- CI-enforce every claim. If a property is not tested, it is not a feature.
- Spend the verification budget where breakage hurts: prove all four scaffolds and
  the governance spine. Speed CI with caching and a per-scaffold matrix, never by
  dropping a scaffold's coverage.

## Phase 0: quick high-stakes hardening (v0.3.1, days)

Low effort, high stakes, no dependencies. Ship first.

- SHA-pin every GitHub Action in the foundation CI and in generated workflows,
  starting with the desktop `release.yml` (it runs a floating `tauri-action@v0`
  in the step that holds the updater key and the Apple signing secrets).
- Add a secret-scanning job (gitleaks) to the generated CI so a leaked key fails
  the PR, and to the foundation CI itself. Prevention plus detection, not
  prevention alone.
- SHIPPED: committed lockfiles per scaffold (npm `package-lock.json` for
  web/mobile/desktop, `Cargo.lock` for desktop, pnpm `pnpm-lock.yaml` for hybrid)
  and switched CI installs to the frozen path (`npm ci`,
  `pnpm install --frozen-lockfile`). Regenerate with `scripts/update_lockfiles.sh`.
- Add `SECURITY.md`.

Acceptance: OpenSSF Scorecard pinned-dependencies passes; a planted secret fails
CI; CI installs are deterministic.

## Phase 1: trustworthy foundation + the moat as product (v0.4.0, the headline)

The high-leverage move. Two halves; 1a underpins 1b.

### 1a. Treat the foundation as software under test

- Golden-output snapshot tests: SHIPPED. `scripts/snapshot.py` renders each
  scaffold (all four) plus the core overlay and diffs a per-scaffold
  `path -> sha256` manifest (`tests/golden/*.manifest`) in CI, so generated
  content drift is a reviewable failure (CI previously checked file presence, not
  content). Implemented stdlib-only (no `pytest-copie` dependency); full-tree
  snapshots or `pytest-copie` remain an option if richer per-PR diffs are wanted.
- Option-combination matrix: SHIPPED. The `option-matrix` CI job renders seven
  representative non-default combinations (use_supabase, use_modal, has_ui,
  two-env, marketing across web/desktop/mobile) and asserts the gated surfaces
  (supabase/, the modal seam) track the toggles, not just `--defaults` per
  scaffold.
- Every-prior-version update tests: `copier update` from v0.1.0, v0.2.0, v0.3.0
  to HEAD, across all four scaffolds (web, mobile, desktop, hybrid) and the core
  overlay, asserting governance propagates and user-owned files are never
  clobbered. SHIPPED: the `update-matrix` CI job covers all 15 version x scaffold
  cells (was: one hop, web only).
- Content-validating lint: a loop's `exit` declares four concrete stops (not
  `TBD`); a gate marked ratified names a real artifact. SHIPPED in
  `scripts/lint_skills_loops.py`. The deeper ratified-gate-artifact-status=accepted
  cross-check rides with the Phase 2 gate enforcement.
- Release engineering: SHIPPED via release-please (manifest-driven, `release-type:
  simple`), not changesets (the foundation has no root `package.json`). It
  maintains a release PR from conventional commits and, on merge, cuts the tag,
  the GitHub Release, and `CHANGELOG.md`. Versioning is now commit-driven, so the
  phase-to-version labels in this roadmap are indicative, not release gates;
  Phase 0's work rolls into the next minor (v0.4.0). `MIGRATING.md` on the first
  major remains to add.
- Keep all four scaffolds building on every change (no scaffold is demoted). The
  per-scaffold matrix and parallel jobs are in place; the desktop Tauri Rust build
  (the CI long pole) is now cached via rust-cache keyed on the committed
  `Cargo.lock`. npm/pnpm download caching is a marginal further optimization (the
  Rust compile dominates) and remains optional. If the full multi-OS desktop
  release build ever becomes too slow for every PR, it may ALSO run nightly and on
  a release label, but the per-PR single-target Tauri compile stays so all four
  scaffolds keep per-change coverage.

### 1b. Make the update channel a first-class product

- `just doctor`: SHIPPED. Checks prerequisites (uv, git, just), a clean tree, and
  drift (compares the project's `.copier-answers.yml` `_commit` to the latest
  foundation tag, cruft-style), and suggests the next step. Read-only.
- `just foundation-update-preview`: SHIPPED. Dry-runs the update via copier
  `--pretend` (writes nothing) before applying.
- SHIPPED (the reliable default): a weekly `foundation-drift` cron shipped into
  projects (`template/.github/workflows/foundation-drift.yml`) that compares the
  project's `.copier-answers.yml` `_commit` to the latest foundation tag and opens
  (or reuses) an issue pointing at `just foundation-update` when behind. Dependabot
  runs on the foundation itself for its pinned actions (`.github/dependabot.yml`).
  DEFERRED: a `renovate.json` using Renovate's `copier` manager stays optional
  until its auto-opened PR is verified to contain the rendered copier diff (open
  reports of empty PRs); the cron is the default until then.
- DEFERRED: a scheduled float-build (cron) that renders the scaffolds against
  latest upstream deps to flag when the pinned matrix has drifted, before users
  hit it. The project-behind-foundation drift is covered above; this is the
  upstream-dependency-drift half and is a small follow-up.
- Reposition: SHIPPED. The README now leads with the governed-update channel (a
  top "The update channel (the point)" section covering doctor, preview, update,
  and the harvest pull-up) and states that discovery assigns the scaffold. The
  moat is the headline above the spin-up paths.
- The pull-up harvest path: SHIPPED (mechanism). A `harvest` skill
  (`template/skills/harvest/`, shipped into projects) plus a foundation-root
  `HARVEST.md` ritual that promote a battle-tested pattern, skill, loop, or ADR
  from a real project back into the foundation, gated by the two-real-instances
  bar, with the required CI coverage. This closes the compounding loop the charter
  promises (previously push-down only). The first documented real round-trip waits
  on a second project generated from groundwork (the current consumer was
  hand-wired, not scaffolded), so there is nothing yet to round-trip for real.

Acceptance: every prior version updates green in CI across all four scaffolds;
golden snapshots diff on content change; `CHANGELOG` is generated; `just doctor`
reports drift. The harvest mechanism is built and demonstrated with a labeled
dry-run now; the documented real harvest round-trip lands once a second project,
generated from groundwork and tracked via a committed `.copier-answers.yml`,
exists. UPDATE (v0.9.0): that second instance now exists
(`SynSe7en7/groundwork-example-web`), so the formal round-trip via the `harvest`
skill and `HARVEST.md` is now doable; the stray-artifact + `.gitignore` fix this
release carries is an informal first pull-up from it (a gap the real instance
surfaced).

## Phase 2: governance teeth + security depth (v0.5.0)

- Gate enforcement: SHIPPED. The generated-project CI (`scripts/check-gates.sh`,
  the `alignment-gates` job) maps a PR diff to the gates it triggers (Stack via
  dependency manifests, Design via a new UI surface, Deployment & Security via
  migrations/env/deploy docs) and fails when a triggered gate is not ratified in
  `docs/GATES.md`, unless its artifact is updated in the same PR or the PR body
  carries `gate-exempt: <key>`. Converts the advisory tripwires to enforced gates;
  decision in `docs/adr/0001-enforce-alignment-gates.md`. Verified against
  block/pass/ratify/exempt scenarios.
- Discovery parity with spec-kit: SHIPPED. A `Clarify (assumptions)` gate in
  `GATES.md` (run by the existing `run-gate` skill) with a `docs/clarify/`
  assumptions-ledger template, and an `analyze` skill that cross-checks the
  committed artifacts (CHARTER vs VISION vs PRD vs plan, DECISIONS, ADRs) and
  reports contradictions, drift, and gaps without rewriting them.
- ADR integrity: SHIPPED (index + status + supersession). `docs/adr/README.md` is
  the index, and `scripts/check_adrs.py` (in the foundation CI lint job) enforces
  that every ADR has a valid status, is listed in the index with a matching status,
  and that a superseded ADR names its successor. The git-diff append-only check
  (an accepted ADR's body is never edited) is a follow-up; the index documents the
  immutability convention meanwhile.
- Build provenance and SBOM: SHIPPED (wired; verification deferred to the first
  real desktop release). The desktop `release.yml` now attests build provenance
  for the signed bundles via `actions/attest-build-provenance` (one attestation
  per matrix leg, over the binaries that leg built) and emits an SPDX SBOM of the
  npm + cargo dependency graph via `anchore/sbom-action` (syft), attached to the
  release, reaching SLSA Build L2+. It only runs on a real `v*`-tagged desktop
  release, so it cannot be exercised by the foundation's render/PR CI; verify on
  the first real desktop project release with `gh attestation verify <file>`.
- Generated CI gains Dependabot and CodeQL: SHIPPED. A scaffold-aware
  `.github/dependabot.yml` (github-actions everywhere, plus npm per scaffold and
  cargo for desktop, the pnpm root for hybrid) and a `codeql.yml` scanning the
  JavaScript/TypeScript surface. (Rust CodeQL for the Tauri shim is a later option.)
- Harden `run-heavy`: SHIPPED. The Supabase edge function now caps the payload
  (64 KB), rate-limits per user (a windowed `jobs` count, default 30/60s), wraps
  the Modal handoff in an `AbortController` timeout (10s), and validates the
  endpoint is HTTPS on an allowlisted host (`.modal.run`, overridable via
  `MODAL_ALLOWED_HOSTS`) before fetching it.

Acceptance: a PR touching a gated surface without ratification fails; the desktop
release emits provenance and an SBOM; the edge function has limits.

## Phase 3: adoption and proof (v0.6.0)

This category wins on proof, not feature lists.

- A branded entry point: SHIPPED. `scripts/create-groundwork.sh` is the in-repo
  wrapper (chosen over a published npx package to avoid a publish dependency); a
  curl one-liner preflights prerequisites, runs `copier copy`, and offers the
  first run. Forwards extra copier args; `GROUNDWORK_SRC` overrides the source for
  local dev.
- A real one-command deployed preview for the web scaffold: WIRED, verification
  pending a real web instance. The web scaffold's justfile now has `deploy-preview`
  (`npx vercel deploy`, prints a live URL) and a backend-first `deploy`
  (`npx vercel deploy --prod`), replacing the placeholder echoes. It needs the
  Vercel CLI authenticated, so it is verified on the first real web project deploy.
- Foreground the first run: SHIPPED. A scaffold-aware `just setup` (npm/pnpm
  install) plus the wrapper's prompt to run `just setup && just verify` after
  generation. `verify`'s test step is now `--if-present`, so a fresh scaffold
  passes verify out of the box (the missing-test gap that CI never exercised).
- One runnable example app and a published scaffold-to-deploy transcript; a
  minimal docs page: SHIPPED. `SynSe7en7/groundwork-example-web` is a real web
  instance generated from groundwork v0.9.0 and tracked via a committed
  `.copier-answers.yml`. Its README carries the scaffold-to-run transcript. The
  instance builds clean (npm install + lint + typecheck + Next.js production
  build). A live preview URL is one `just deploy-preview` away once the Vercel
  CLI is authenticated. This is also the second tracked instance, which unblocks
  the harvest round-trip and the projects-on-latest metric (see below). The first
  gap it surfaced is fixed in the foundation in the same change: a stray
  Next-generated `next-env.d.ts` had been committed into the desktop template
  (Next regenerates it every build), so it is removed and the shared `.gitignore`
  now ignores `next-env.d.ts` / `*.tsbuildinfo`.
- `CONTRIBUTING.md`: SHIPPED. The two-real-instances bar, a where-it-goes table
  (skill/loop/ADR/gate/generated-content) mapped to the CI check that guards each,
  the golden-snapshot regeneration step, the full CI gate, the harvest
  promote-from-a-real-project path, and the branch/PR/release workflow.
- The positioning paragraph: SHIPPED. README now has a "Why groundwork" section
  with the one-repeatable-sentence positioning against methodology kits
  (superpowers, spec-kit) and scaffolders (create-t3-app, cookiecutter, Vercel
  templates). The measured outcome uses the interim metric (every behavioral claim
  backed by a green CI check; 33 checks on the last green run, including 15
  version-by-scaffold update cells), with the fleet-scale outcome called out as
  pending a second tracked instance.

Acceptance: a new user reaches a live URL in minutes; CONTRIBUTING exists; the
positioning paragraph is in the README.

## Phase 4+: at-scale architecture (v0.7.0+, demand-gated)

Build only when a second and third real project exist. This phase is gated on new
demand; it never reaches back to weaken the four existing scaffolds.

- Factor the duplicated primitives (the Supabase client, EnvBadge, the
  `/api/health` contract) into a shared layer, with a CI invariant that the
  per-scaffold contracts agree.
- A non-JS backend scaffold (Python/FastAPI or Go) proving the spine generalizes
  past the TypeScript family, with a pluggable `verify`. This is a NEW scaffold
  type, so it is the one subject to the two-real-instances rule.
- A scaffold/skill registry seam (manifest-driven) so a new surface is additive,
  not a core edit plus a hand-named conditional directory.
- Conditional skill and loop shipping from `.copier-answers.yml` plus VISION
  inference, and discovery-driven scaffold assignment (today `project_type` is a
  manual answer and skills/loops ship unconditionally).
- The stage-3 feature-delivery orchestrator and roadmap-review loops, and the
  evaluator-optimizer loop.
- Fleet-scale governance: versioned GATES and LOOPS schemas with a migration
  path, and an optional cross-project rollup.
- Vendored, curated external skills (anthropics/skills, VoltAgent) pinned by
  commit, when the roster demands them.

## Explicit non-goals (do not build)

- No marketplace, no workflow DSL, no agent hierarchies, no telemetry
  infrastructure, no large speculative skill library.
- Do not add a NEW (fifth) scaffold speculatively; a new surface is earned by the
  two-real-instances rule. The four existing scaffolds (web, mobile, desktop,
  hybrid) are first-class and stay equally build-verified on every change. Never
  demote, deprecate, or mark any of them experimental to save CI cost; reduce cost
  with caching and a per-scaffold matrix instead.

## Sequencing rationale

Phase 0 is independent and ships immediately. Phase 1a (testing and release
engineering) is the safety net under everything else, so it comes before the rest
of Phase 1 and all later phases. Phase 1b (update as product) is the moat and the
positioning win, and depends on 1a being trustworthy. Phase 2's gate-enforcement
reuses the content-validating lint from 1a. Phase 3 is adoption, which is only
worth doing once the product underneath is trustworthy. Phase 4 is demand-gated
on real projects.

Guard: no item lands in CI before the test, lint, or build-coverage control it
relies on is green, and a change that moves coverage ships with its replacement in
the same change. At solo, single-instance scale this is a one-line discipline, not
enforcement machinery.

## Execution notes (improvements for the implementing agent)

These sharpen the plan; apply them as you build.

- Lead with a tracer-bullet slice, not all of Phase 1a at once. The thinnest
  buildable proof of the moat is the every-prior-version `copier update` test
  (v0.1/v0.2/v0.3 to HEAD, across all four scaffolds and the core overlay). Ship
  that first; it proves the bet and is buildable now by generalizing the existing
  single-hop sentinel. The real harvest round-trip is the second half of the
  proof, but it waits on a second project generated from groundwork (see 1b);
  build the harvest mechanism now and demonstrate it with a labeled dry-run.
- Dogfood the foundation's own loops: for each item that asserts a behavioral or
  structural property (renders, builds, propagates, lints, reports drift, enforces
  a gate), write the failing CI check first, then implement until green. This is
  the plan-execute-verify and tdd loops applied to the foundation, and it makes
  "CI-enforce every claim" literal. Prose, decision, and presence-only deliverables
  (SECURITY.md, README repositioning, the release-tool choice, CONTRIBUTING) are
  exempt.
- Verify before relying. For golden snapshots use the maintained `pytest-copie`
  (12rambau), not the stale `pytest-copier` proof-of-concept (a shell
  render-and-diff is an equally fine fallback). For Renovate's `copier` manager,
  the acceptance test is that the auto-opened PR actually contains the rendered
  copier diff (there are open reports of empty update PRs), so verify it on a
  throwaway repo and keep the cron `copier update --pretend` plus open-issue
  fallback as the default until it passes. Pick the release tool deliberately
  (changesets suits this single-repo case; release-please is the alternative) and
  record the choice in DECISIONS.md.
- North star for "world-class," made measurable: a fleet of real projects all
  sitting on the latest foundation tag with zero manual update steps, and every
  foundation claim backed by a CI check. The projects-on-latest count needs at
  least one project that is a tracked instance (a committed `.copier-answers.yml`
  on a released tag), so add that conversion step before invoking the metric.
  Until a second tracked instance exists, use "percent of foundation claims backed
  by a green CI check" as the interim metric, which is measurable today. No
  fleet-tracking or telemetry infrastructure (that is a non-goal). UPDATE (v0.9.0):
  the first tracked instance now exists (`SynSe7en7/groundwork-example-web`, pinned
  to v0.9.0), so the projects-on-latest count is a real 1-of-1 on latest; the
  interim CI-claim metric still stands alongside it.
