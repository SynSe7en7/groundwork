---
title: Charter
status: accepted
owner: Wyatt Long
updated: 2026-06-23
---

# Charter — groundwork

## Thesis (the bet)

A single, model-agnostic foundation that new projects are spawned from will make every new build start aligned and consistent, and will let improvements flow back into existing projects, so the cost of starting and maintaining many projects drops sharply.

## Who it is for

One builder, plus any agent or collaborator, starting web, mobile, desktop, or hybrid apps, working across different AI coding tools and branches, who wants the same guardrails, gates, and stack defaults every time without re-deriving them.

## What success looks like

- A new project is one `copier copy` away, arrives with the gates and guardrails in place, and reads cleanly whether driven from Claude, Cursor, or Codex.
- A foundation improvement reaches existing projects with `just foundation-update` rather than manual copying.
- The four presets (web, mobile, desktop, hybrid) each render and build from a clean spawn.

## Out of scope

- Multi-tenant auth, a plugin or marketplace system, an arbitrary workflow DSL, or agent hierarchies. Every generalization must be demanded by at least two real projects.
- Becoming a published framework or a runtime dependency. It is a starting point, not a library.

## Constraints

- Model-agnostic: no load-bearing dependence on one vendor's memory or slash commands. `AGENTS.md` is the spine.
- Cross-OS: bridges are pointer files, not symlinks, so they survive Windows and the GitHub template path.
- Secrets are env-driven placeholders, never real values.
- Voice: no em-dashes or double hyphens, no emojis, no negation-setup phrasing.

## Owner / decision-maker

Wyatt Long.
