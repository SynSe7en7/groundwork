# Architecture Decision Records

Numbered, immutable records of the foundation's architecturally significant
decisions, in Michael Nygard's format (see
[ADR-0000](0000-record-architecture-decisions.md)). To change a decision, add a
new ADR that supersedes the old one; do not edit an accepted record. Smaller
ratified calls live in `../../DECISIONS.md`. Integrity is checked in CI by
`scripts/check_adrs.py` (every ADR has a valid status, is listed here with a
matching status, and a superseded ADR names its successor).

| ADR | Title | Status |
|---|---|---|
| [0000](0000-record-architecture-decisions.md) | Record architecture decisions | accepted |
| [0001](0001-enforce-alignment-gates.md) | Enforce alignment gates in generated projects | accepted |
