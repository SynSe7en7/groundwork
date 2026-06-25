---
title: Decisions
updated: 2026-06-23
---

# Decisions

Running log of ratified calls on the foundation itself that do not warrant a full ADR. Architecture decisions live in `docs/adr/`.

- 2026-06-23: Name is `groundwork`, hosted private under the personal GitHub account SynSe7en7.
- 2026-06-23: Copier is the scaffold and update engine; the repo is also a GitHub template for zero-install spins. Chosen for Copier's 3-way `copier update` drift resolution.
- 2026-06-23: `AGENTS.md` is the canonical instruction file; Claude Code, Gemini CLI, and Aider are bridged by committed pointer files, not symlinks (Windows-safe).
- 2026-06-23: Four presets in v1 (web, mobile, desktop, hybrid). Web defaults to Next.js 16. Spawned projects default to a Proprietary license.
- 2026-06-23: The mobile preset is web-capable from one codebase via Expo + React Native Web + Tamagui, with a `marketing_site` toggle for when SEO must scale. The hybrid preset is the escalation for a first-class shared web-and-native surface.
- 2026-06-23: Jinja delimiters are remapped to square brackets (`[[ ]]` and `[% %]`) and only `.jinja` files are rendered, so framework braces (`{{ }}`, `${{ }}`) and just's `{{var}}` survive untouched.
- 2026-06-24: Installable as a core overlay on existing projects via `project_type: core`, plus `_skip_if_exists` (never clobbers an existing file, so no interactive prompt) and post-copy tasks gated off for core (no git init/commit on an existing repo). See `INSTALL.md`.
- 2026-06-24: The Modal seam ships as a wired example. The web preset gates the standalone seam files (`lib/modal`, `app/api/jobs`) on `use_modal`; mobile, desktop, and hybrid keep the seam present because app code imports it and gating would require conditionalizing cross-file imports. Every seam guards on missing `MODAL_*` env and is safe to delete if unused.
- 2026-06-24: Stack versions are pinned per preset as an internally-consistent, compatible matrix. Mobile tracks a recent Expo SDK with the current Tamagui config; hybrid pins the conservative stable matrix (Expo SDK 54, Tamagui v1) for its shared design system. Cross-preset version alignment is deliberately not forced. Each preset is build-verified by the CI build matrix in `.github/workflows/ci.yml`; a preset that does not build green there is marked experimental rather than claimed as working.
- 2026-06-24: Repo is PUBLIC (reversing the initial private choice). groundwork is generic governance plus scaffolding with no secrets, and private hosting imposed a gh-auth requirement on every install and update that an agent could not self-correct. Public deletes that friction so `uvx copier copy gh:SynSe7en7/groundwork` works for any tool in any environment.
- 2026-06-24: `copier update` content propagation requires that template-owned governance files stay OUT of `_skip_if_exists`. The v0.1.0 list was too broad and silently blocked all governance updates; v0.2.0 shrinks it to user-owned seed-once files only, and a CI job asserts an upstream change actually lands after `copier update`.
