---
name: harvest
description: Promotes a battle-tested pattern, helper, skill, loop, gate rule, or ADR from this real project back UP into the groundwork foundation, so every project inherits it on the next update. It confirms the pattern clears the two-real-instances bar, generalizes it out of this project's specifics, then opens a pull request against the foundation that adds it to the template with the CI coverage the foundation requires (golden snapshot, option or update matrix) and a DECISIONS.md line. Use when a pattern, helper, skill, loop, gate rule, or architectural decision has proven itself in real use here and should live in the foundation rather than only in this project, or when the user says "harvest this", "promote this upstream", "push this back to groundwork", or "contribute this to the foundation".
---

# harvest

groundwork pushes improvements one way by default: a foundation release flows
down into a project through `copier update`. Harvest is the other direction. It
takes something that earned its keep in a real project and promotes it into the
foundation, so the next `copier update` carries it into every project. This is
the compounding loop the charter promises, and it is the only way the foundation
gets better from real use instead of guesswork.

The foundation-side ritual and acceptance checklist live in the foundation repo's
`HARVEST.md`. This skill is the project-side how-to: it gets a proven pattern out
of this project and into a clean pull request against the foundation.

## Philosophy

Harvest what is proven, generalized, and worth carrying for everyone. A harvest
is a promotion, not a copy. The pattern leaves behind this project's names,
secrets, and one-off choices and arrives in the foundation as a parameterized,
tested default. If it cannot be generalized without losing its value, it stays
here.

## The bar: two real instances

A pattern earns a foundation slot only when it has proven itself in real use.
That means it is in production-grade use in at least two real projects, or in one
real project plus a concrete, written general case for why every project benefits.
A future project is not an instance. A pattern that is only a good idea is a
proposal for an ADR, not a harvest. Check the bar first; if it is not met, stop
and record the idea instead.

## Anti-pattern: harvesting the un-generalized

WRONG: copy this project's `lib/foo.ts` verbatim into the template, keeping its
project name, its env keys, and its product assumptions. The foundation now ships
one project's specifics to everyone, and the next `copier update` overwrites real
projects with them.

RIGHT: extract the reusable core, replace project specifics with copier answers
or documented placeholders, give it a sensible default, and prove it renders and
builds for every scaffold it touches before it lands.

## Steps

1. Confirm the bar. Name the pattern and where it is proven. State the two real
   instances, or the one instance plus the written general case. If the bar is
   not met, stop: open an ADR or a DECISIONS.md note in this project instead and
   say so.
2. Classify it. Decide what kind of foundation change it is, because that sets
   where it goes:
   - a procedure agents reach for -> a `skills/<name>/SKILL.md` (mind the 8 to 12
     ceiling; replace a weaker skill rather than append);
   - a repeatable work cycle -> a `loops/<name>.loop.md`;
   - a always-on rule -> a line in `AGENTS.md`;
   - a stack or governance decision -> an ADR plus a `DECISIONS.md` line;
   - scaffolded code or config -> template files under the right scaffold, gated
     on a copier answer when it is optional.
3. Generalize. Strip this project's name, secrets, and one-off choices. Replace
   them with copier answers (add a question to `copier.yml` if the pattern is
   optional) or clearly named placeholders. Pick a default that is right for most
   projects.
4. Add the coverage the foundation requires. A pattern is not done until CI
   proves it: refresh the golden snapshots (`scripts/snapshot.py update`); add or
   extend an option-matrix combination if it introduces a toggle; make sure the
   every-prior-version update test still passes; keep the content lint green if
   it touches a loop or gate.
5. Record it. Add a dated `DECISIONS.md` line in the foundation stating what was
   promoted and why it cleared the bar. Use a conventional-commit title
   (`feat:` or `fix:`) so release-please captures it in the changelog.
6. Open the pull request against the foundation repo (the `_src_path` in this
   project's `.copier-answers.yml`), not against this project. Summarize the
   pattern, the two real instances, the generalization, and the coverage added.

## Handoff

A clean harvest leaves an open foundation pull request that adds the generalized
pattern with its tests and a DECISIONS.md line, ready for the foundation owner to
review against `HARVEST.md`. Once it merges and the foundation cuts a release,
this project picks the pattern back up through `just foundation-update`, now as a
shared default rather than a local one.
