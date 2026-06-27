# 0001. Enforce alignment gates in generated projects

- Status: accepted
- Date: 2026-06-27
- Deciders: Wyatt Long

## Context

Generated projects shipped advisory "tripwires" in CI: they warned (and exited 0)
when a PR added a dependency without an ADR, or added a UI surface before
`DESIGN.md` was locked. The advisory comment said to promote a tripwire to a hard
gate only after living with it and writing an ADR. The world-class roadmap's
Phase 2 calls for exactly that: give the alignment gates teeth so the gate system
is enforced rather than honor-system.

## Decision

Generated-project CI enforces the alignment gates. A shipped script
(`scripts/check-gates.sh`, run by `.github/workflows/ci.yml` on pull requests)
maps the PR diff to the gates it triggers and fails the PR when a triggered gate
is not satisfied:

- Stack & Architecture: triggered by a change to a dependency manifest
  (`package.json`, `pyproject.toml`, `Cargo.toml`).
- Design theme: triggered by a newly added user-facing surface
  (`.tsx/.jsx/.vue/.svelte`, or a `components/app/pages/screens` path).
- Deployment & Security: triggered by `supabase/migrations/`, `.env*`, or the
  deploy/security docs.

A triggered gate passes when its status in `docs/GATES.md` is `ratified` or
`superseded`, when its artifact (an ADR, `DESIGN.md`, the security/deploy docs) is
updated in the same PR (the gate is being ratified now), or when the PR body
carries an exemption line `gate-exempt: <key>` with key `stack`, `design`, or
`deploy`. Otherwise the PR fails with a message naming the gate and the fix.

## Consequences

- The gate system moves from advisory to enforced. The first change to a gated
  surface in a project must ratify that gate or record an explicit exemption; once
  ratified, routine work inside the decided architecture passes.
- The exemption escape hatch keeps enforcement from blocking legitimate routine
  changes (for example a dependency bump within an already-decided stack), while
  leaving a recorded reason in the PR.
- The enforcement logic is a shipped, version-controlled script, tested against
  block/pass/ratify/exempt scenarios, so projects inherit and update it through
  the normal foundation-update channel.
- This is the foundation beginning to dogfood its own ADR and gate model.
