# Contributing to groundwork

groundwork runs on the discipline it ships. A contribution is held to the same
bar a spawned project is: a change is real when a CI check would fail without it.
This guide says what gets in, where it goes, and the gate it must pass.

## The bar: earn each new capability from real use

groundwork deliberately stays small (see [CHARTER.md](CHARTER.md)). New surface is
earned, not added on spec.

- A **new capability** (a skill, a loop, a gate, a workflow) or a **new scaffold
  type** is earned only after it has proven itself in two real projects. This is
  the two-real-instances rule.
- The four existing scaffolds (web, mobile, desktop, hybrid) are already earned
  and stay first-class. The rule gates a fifth scaffold type, not the four.
- Fixes, hardening, and tightening of existing surface do not need the bar. They
  need a test that fails first and passes after.

If a thing has proven itself in exactly one project, it is not ready for the
foundation yet. Keep it in that project until a second project needs it, then
promote it (see "Promoting from a real project").

## Where a change goes

| Change | Lives at | Index it in | CI check that guards it |
| --- | --- | --- | --- |
| A new skill | `template/skills/<name>/SKILL.md` | `template/skills/README.md` and the AGENTS.md skills index | `scripts/lint_skills_loops.py` |
| A new loop | `template/loops/<name>/` | `template/loops/LOOPS.md` and its appropriateness gate | `scripts/lint_skills_loops.py` |
| A foundation decision | `docs/adr/NNNN-title.md` | `docs/adr/README.md` (matching status) | `scripts/check_adrs.py` |
| A decision shipped into projects | `template/docs/adr/` | the shipped adr index | `scripts/check_adrs.py` |
| An alignment gate | `template/docs/GATES.md` + `template/scripts/check-gates.sh` | GATES.md | the `alignment-gates` job in generated CI |
| Any change to generated content | the relevant `template/` file | regenerate the golden manifest in the same PR | `golden-snapshots` |
| The questionnaire or a toggle | `copier.yml` | the option matrix | `option-matrix` |

A skill or loop is content, not a stub: a loop's `exit` declares four concrete
stops (a cap, a budget, a progress signal, a breaker), and a gate marked ratified
names a real artifact. The lint enforces this, so write it real or the PR fails.

## Regenerate the golden snapshot for any generated-content change

CI checks that generated content matches a committed `path -> sha256` manifest.
If you touch anything under `template/`, regenerate and commit the manifest in the
same PR. The diff is the review signal.

```
python3 -m venv /tmp/gw-venv && /tmp/gw-venv/bin/pip -q install copier
COPIER_CMD=/tmp/gw-venv/bin/copier python3 scripts/snapshot.py update   # then commit tests/golden/*.manifest
```

There is no global `copier`/`uv`; validate against a throwaway venv as above. The
same `COPIER_CMD` runs the local checks before you push:

```
COPIER_CMD=/tmp/gw-venv/bin/copier python3 scripts/snapshot.py check    # content drift
python3 scripts/lint_skills_loops.py                                    # skills/loops/gates
python3 scripts/check_adrs.py                                           # ADR integrity
```

## The CI gate

Every pull request runs, on `.github/workflows/ci.yml`:

- **render** (all five scaffolds: web, mobile, desktop, hybrid, core)
- **build** (web full build; mobile and hybrid typecheck; desktop frontend plus the
  Tauri Rust build, cached on the committed `Cargo.lock`)
- **update-matrix** (every prior tag updated to HEAD across all four scaffolds and
  the core overlay, asserting governance propagates and user-owned files are never
  clobbered)
- **option-matrix** (representative non-default toggle combinations)
- **golden-snapshots** (generated content matches the committed manifest)
- **secret-scan** (gitleaks)
- **lint** (skills, loops, gates, and ADRs are well-formed)

The rule that keeps the matrix honest: no item lands in CI before the test, lint,
or build coverage it relies on is green, and a change that moves coverage ships
with its replacement in the same pull request. If a claim is not backed by a
check, it is not a feature.

## Promoting from a real project (the harvest path)

The compounding loop runs both ways. `copier update` pushes a foundation
improvement down into every generated project; `harvest` pulls a pattern that
proved itself in a real project back up so the next release shares it with all of
them. To promote a skill, loop, ADR, or pattern:

1. Confirm it clears the two-real-instances bar (proven in a real project, needed
   by a second).
2. Follow the ritual in [HARVEST.md](HARVEST.md), using the `harvest` skill shipped
   into projects.
3. Bring the CI coverage with it: the promoted surface lands with the check that
   guards it (see the table above), green in the same pull request.

## Workflow

- Branch from `main`; open a pull request into `main`. Direct commits to `main` are
  not the path.
- Use a conventional-commit pull-request title: `feat:` for a new capability (a
  minor bump while pre-1.0), `fix:` for a patch, `ci:`/`chore:`/`docs:` for changes
  that do not ship a release. Squash-merge once CI is green.
- Releases are cut by merging release-please's open release pull request, which
  writes the tag, the GitHub Release, and `CHANGELOG.md`. There is no manual tag.

See [HANDOFF.md](HANDOFF.md) for the current state, the dev loop, and the
hard-won gotchas, and [docs/WORLD_CLASS_ROADMAP.md](docs/WORLD_CLASS_ROADMAP.md)
for what is shipped and what is next.
