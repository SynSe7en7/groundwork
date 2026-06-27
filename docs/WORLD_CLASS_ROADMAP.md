# World-Class Roadmap

Status: proposed. Drafted 2026-06-25 from the seven-dimension review.

The path from a good foundation builder to a world-class one. The review was
consistent: groundwork is over-invested in the replicable surface (four presets,
full desktop and hybrid builds in CI) and under-invested in its actual moat
(governed updates across a fleet of aligned projects). This roadmap rebalances
toward the moat and makes every claim CI-enforced.

## Thesis (the 10x bet, named)

groundwork is the one foundation that combines a runnable, build-verified stack,
an agent-governance layer, and a `copier update` channel that propagates
improvements into existing projects. Methodology tools (superpowers, spec-kit,
gstack) have no stack and no update channel. Scaffolders (cookiecutter,
create-t3-app, Vercel templates) have no governance and no update path. The
intersection is the white space.

The bet, in one line: one governed foundation that lets a solo builder run a
fleet of aligned projects that all stay current. Every phase below serves that
bet. The headline is the governed-update channel, not the presets.

## Operating principles

- Earn each capability from a real consuming project (the two-real-instances
  rule). Demand-gate the at-scale work.
- Dogfood: the foundation runs on the discipline it ships.
- CI-enforce every claim. If a property is not tested, it is not a feature.
- Spend the verification budget where breakage hurts: the consumed surface and
  the governance spine, not presets no project uses.

## Phase 0: quick high-stakes hardening (v0.3.1, days)

Low effort, high stakes, no dependencies. Ship first.

- SHA-pin every GitHub Action in the foundation CI and in generated workflows,
  starting with the desktop `release.yml` (it runs a floating `tauri-action@v0`
  in the step that holds the updater key and the Apple signing secrets).
- Add a secret-scanning job (gitleaks) to the generated CI so a leaked key fails
  the PR. Prevention plus detection, not prevention alone.
- Commit lockfiles per preset and switch CI installs to the frozen path
  (`npm ci`, `pnpm install --frozen-lockfile`).
- Add `SECURITY.md`.

Acceptance: OpenSSF Scorecard pinned-dependencies passes; a planted secret fails
CI; CI installs are deterministic.

## Phase 1: trustworthy foundation + the moat as product (v0.4.0, the headline)

The high-leverage move. Two halves; 1a underpins 1b.

### 1a. Treat the foundation as software under test

- Golden-output snapshot tests: commit a full rendered tree per preset, diff in
  CI, so generated content drift is a reviewable failure (today CI checks file
  presence, not content). Use the `pytest-copier` pattern.
- Option-combination matrix: render and verify representative toggle combinations
  (use_supabase, use_modal, has_ui, two-env x project_type), not just
  `--defaults` per preset.
- Every-prior-version update tests: `copier update` from v0.1.0, v0.2.0, v0.3.0
  to HEAD, across the web preset and the core overlay, asserting governance
  propagates and user-owned files are never clobbered (today: one hop, web only,
  PR-only).
- Content-validating lint: a loop's `exit` declares four concrete stops (not
  `TBD`); a gate marked ratified has an artifact whose status is accepted.
- Release engineering: adopt changesets or release-please for a generated
  `CHANGELOG.md`, GitHub Releases per tag, and a `MIGRATING.md` on majors.
- Rebalance CI: move the full Tauri Rust build and the pnpm hybrid build to
  nightly or label-triggered; PR CI runs the consumed surface, the governance
  spine, and the update sentinel.

### 1b. Make the update channel a first-class product

- `just doctor`: checks prerequisites (uv, just, git auth), a clean tree, and
  drift (is this project behind the latest foundation tag, cruft-style).
- `just foundation-update --preview`: dry-run the 3-way merge diff before
  applying.
- Ship a `renovate.json` in spawned projects using Renovate's first-class
  `copier` manager (auto-opens `copier update` PRs), and run Renovate or
  Dependabot on the foundation itself.
- Scheduled float-build (cron) that flags when the pinned matrix has drifted out
  from under the presets, before users hit it.
- Reposition: the README leads with the governed-update value; the moat is the
  headline, not a footnote below the spin-up paths.
- The pull-up harvest path: a `harvest` skill plus a `HARVEST.md` ritual that
  promotes a battle-tested pattern, skill, or ADR from a real spawned project
  back into the foundation, gated by the two-real-instances bar. This closes the
  compounding loop the charter promises (today it is push-down only).

Acceptance: every prior version updates green in CI; golden snapshots diff on
content change; `CHANGELOG` is generated; `just doctor` reports drift; one
documented harvest round-trip from a real project into the foundation.

## Phase 2: governance teeth + security depth (v0.5.0)

- Gate enforcement: a CI job maps a PR diff to the gates it triggers and fails
  when `docs/GATES.md` does not show them ratified, with a PR-description
  exemption escape hatch. Converts the advisory gate system to enforced.
- Discovery parity with spec-kit: a clarify gate (a ratified assumption ledger
  before planning) and an analyze pass (cross-artifact consistency: CHARTER vs
  VISION vs PRD).
- ADR integrity: an index file, append-only validation, and supersession-pointer
  checks (today honor-system).
- Build provenance and SBOM: `actions/attest-build-provenance` plus an SBOM
  (syft) for the signed auto-updating desktop binaries, reaching SLSA Build L2+.
- Generated CI gains Dependabot and CodeQL; harden `run-heavy` (per-user rate
  limit, an `AbortController` timeout, a payload-size cap, an SSRF allowlist for
  the Modal endpoint).

Acceptance: a PR touching a gated surface without ratification fails; the desktop
release emits provenance and an SBOM; the edge function has limits.

## Phase 3: adoption and proof (v0.6.0)

This category wins on proof, not feature lists.

- A branded entry point: `create-groundwork` (npx) or a memorable wrapper that
  runs doctor, then copier, then the first run.
- A real one-command deployed preview for the web preset (a wired `just deploy`
  and a Vercel deploy path, not placeholder commands).
- Foreground the first run: after scaffold, offer to install deps and start the
  dev server or run `just verify`.
- One runnable example app and a published scaffold-to-deploy transcript; a
  minimal docs page.
- `CONTRIBUTING.md`: the two-real-instances bar, where a new skill/loop/ADR goes,
  the CI gate it must pass, and the promote-from-a-real-project path.
- The positioning paragraph: why groundwork over superpowers, spec-kit, and
  create-t3-app, in one repeatable sentence; plus a measured outcome from the one
  real project.

Acceptance: a new user reaches a live URL in minutes; CONTRIBUTING exists; the
positioning paragraph is in the README.

## Phase 4+: at-scale architecture (v0.7.0+, demand-gated)

Build only when a second and third real project exist.

- Factor the duplicated primitives (the Supabase client, EnvBadge, the
  `/api/health` contract) into a shared layer, with a CI invariant that the
  per-preset contracts agree.
- A non-JS backend preset (Python/FastAPI or Go) proving the spine generalizes
  past the TypeScript family, with a pluggable `verify`.
- A preset/skill registry seam (manifest-driven) so a new surface is additive,
  not a core edit plus a hand-named conditional directory.
- Conditional skill and loop shipping from `.copier-answers.yml` plus VISION
  inference (today they ship unconditionally).
- The stage-3 feature-delivery orchestrator and roadmap-review loops, and the
  evaluator-optimizer loop.
- Fleet-scale governance: versioned GATES and LOOPS schemas with a migration
  path, and an optional cross-project rollup.
- Vendored, curated external skills (anthropics/skills, VoltAgent) pinned by
  commit, when the roster demands them.

## Explicit non-goals (do not build)

- No marketplace, no workflow DSL, no agent hierarchies, no telemetry
  infrastructure, no large speculative skill library.
- Do not add presets speculatively. As part of the Phase 1 rebalance, demote
  desktop and hybrid to render-only and experimental in CI until a real project
  consumes them.

## Sequencing rationale

Phase 0 is independent and ships immediately. Phase 1a (testing and release
engineering) is the safety net under everything else, so it comes before the rest
of Phase 1 and all later phases. Phase 1b (update as product) is the moat and the
positioning win, and depends on 1a being trustworthy. Phase 2's gate-enforcement
reuses the content-validating lint from 1a. Phase 3 is adoption, which is only
worth doing once the product underneath is trustworthy. Phase 4 is demand-gated
on real projects.
