# 0000. Record architecture decisions

- Status: accepted
- Date: 2026-06-23
- Deciders: Wyatt Long

## Context

The groundwork foundation needs a durable, committed record of its own architecturally significant decisions, so future maintainers (human or agent) understand why it is built the way it is.

## Decision

We use Architecture Decision Records in Michael Nygard's format. Each is a numbered markdown file in `docs/adr/`. Records are immutable once accepted; to change a decision we add a new ADR that supersedes the old one. Smaller ratified calls live in `DECISIONS.md`.

## Consequences

- The foundation's structural choices (Copier, the AGENTS.md spine, the gate system, the preset taxonomy) get numbered records as they are made.
- This same practice ships to spawned projects via `template/docs/adr/`.
