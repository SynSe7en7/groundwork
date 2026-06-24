# 0000. Record architecture decisions

- Status: accepted
- Date: YYYY-MM-DD
- Deciders: <owner>

## Context

We need a durable, committed record of the architecturally significant decisions
made on this project, with their rationale, so future maintainers (human or
agent) understand why the system is built the way it is. Decisions kept only in
chat history or a single tool's private memory are lost.

## Decision

We will use Architecture Decision Records, in the format described by Michael
Nygard. Each record is a short markdown file in `docs/adr/`, numbered
sequentially (`NNNN-title.md`), copied from `docs/adr/_TEMPLATE.md`. Records are
immutable once accepted: to change a decision we write a new ADR that supersedes
the old one, and mark the old one superseded with a pointer.

ADRs are the artifact of the Stack & Architecture gate (see `docs/GATES.md`).
They are written just-in-time, when a load-bearing choice is made, not upfront.

## Consequences

- Every significant architecture choice gets a numbered, reviewable record.
- The default stack (Supabase backbone, Vercel web, Modal for heavy compute only)
  is the assumed baseline; an ADR is needed to deviate from it.
- Routine work inside an already-decided architecture needs no ADR.
