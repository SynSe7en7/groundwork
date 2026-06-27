# Harvest ritual

How a pattern proven in a real project gets promoted into the foundation. This is
the pull-up half of the governed-update loop: `copier update` pushes the
foundation down into projects; harvest pulls a proven pattern up so the next
release carries it to every project. The project-side how-to is the `harvest`
skill shipped in `template/skills/harvest/`; this file is the foundation-side
acceptance checklist for the maintainer reviewing the incoming pull request.

## The bar (gate before anything else)

A pattern earns a foundation slot only when it is proven in real use: in at least
two real projects, or in one real project plus a written, concrete general case
for why every project benefits. A future project is not an instance. If the bar
is not met, the right home is an ADR or a `DECISIONS.md` note, not the template.

## Acceptance checklist

A harvest pull request is ready to merge when all of these hold:

- [ ] The bar is stated in the PR: the two real instances, or the one instance
      plus the general case.
- [ ] The pattern is generalized: no project name, secret, or one-off choice
      remains; project specifics are copier answers or documented placeholders,
      with a sensible default.
- [ ] It lands in the right place for its kind: a `skills/<name>/SKILL.md` (within
      the 8 to 12 ceiling, replacing a weaker skill rather than appending), a
      `loops/<name>.loop.md`, a line in `AGENTS.md`, an ADR plus a `DECISIONS.md`
      line, or template files gated on a copier answer when optional.
- [ ] CI coverage proves it: golden snapshots refreshed
      (`scripts/snapshot.py update`); a new toggle has an option-matrix
      combination; the every-prior-version update matrix is green; the content
      lint is green if a loop or gate changed.
- [ ] A dated `DECISIONS.md` line records what was promoted and why it cleared the
      bar, and the commit title is conventional (`feat:`/`fix:`) so release-please
      captures it.

## After merge

Cut a release the usual way (merge release-please's release PR). Real projects
then pick the pattern up through `just foundation-update`, now a shared default.
Track which patterns came from harvest in `DECISIONS.md` so the compounding loop
is visible over time.

## Status

The harvest mechanism (this ritual plus the `harvest` skill) is in place. The
first documented end-to-end round-trip waits on a second real project generated
from groundwork and tracked via a committed `.copier-answers.yml`; today the only
consumer was hand-wired rather than scaffolded, so there is nothing yet to
round-trip for real. See the World-Class Roadmap, Phase 1b.
