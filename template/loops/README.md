# Loops

A loop is a bounded, self-checking work cycle an agent runs to drive a task to a
defined done state without a human turning the crank each pass. Where the
alignment gates in `docs/GATES.md` decide what gets built, loops decide how a
repeating build-or-fix task is executed: the agent does work, runs a
deterministic check, reads the result, and either stops or iterates. The cycle
is the unit, not the keystroke.

This directory holds the loop definitions. The active-loops state file is
`loops/LOOPS.md`, the loop analog of the gate state table: it lists which loops
are candidate, active, paused, or retired, and is read at session start before a
loop is run.

## When a loop is the right tool

Loops are not free. Each one is a standing promise that an agent can run a task
unattended within a budget and know when it is finished. Most work does not
clear that bar and should stay a plain task. A loop earns its place only by
passing the appropriateness gate below. This gate is to loops what the
triviality exemption in `AGENTS.md` is to alignment gates: a cheap, explicit
filter that keeps the machinery off work that does not need it.

### Loop appropriateness gate

Add a loop only when all four conditions hold. If any one fails, do the work as
a normal task and do not write a loop file.

1. The work repeats. The same shape of task recurs often enough that a defined
   cycle pays for the cost of writing and maintaining it. A one-off does not.
2. Verification is automated. There is a deterministic check (a `just` command
   that exits non-zero on failure) that decides pass or fail without a human
   reading the output. If the only check is the agent judging its own work, the
   loop is not ready.
3. The budget absorbs retries. The token and wall-clock cost of several
   iterations is acceptable for the value of the outcome. A loop that can only
   afford one pass is just a task.
4. The agent has real tools. The agent can actually do the work and run the
   check inside the loop: edit files, run `just verify`, read the failure. A
   loop over tools the agent cannot invoke is theater.

These mirror the conditions Anthropic names for when an agentic loop is worth
building rather than a single shot. When in doubt, the answer is no: a missing
deterministic check or an uncapped budget turns a loop into a way to burn tokens
confidently.

## Loop file schema

Each loop is a `loops/<name>.loop.md` file with YAML front-matter and a prose
body. The front-matter is the contract; the body is how to run it well.

```yaml
---
trigger: <what starts this loop: a user phrase, a failing check, a labeled task>
goal: <the explicit done-definition. If you cannot state what done looks like in
  one falsifiable sentence, there is no loop. "Tests pass" is a goal; "improve
  the code" is not.>
doer: <the agent or sub-agent that performs the work each cycle>
checker:
  type: deterministic | llm-judge   # prefer deterministic; see the rule below
  command: <the exact just command, e.g. `just verify`>
exit:
  hard_cap: <max iterations, e.g. 6>
  budget: <cost or token ceiling for the whole loop>
  no_progress: <the signal that a cycle changed nothing, e.g. identical failing
    test set and unchanged diff two cycles running>
  circuit_breaker: <the condition that means stop and escalate, e.g. the check
    errors in a new way, or the diff starts deleting unrelated code>
handoff: <the committed artifact the loop writes when it stops: a passing diff,
  a plan file, a triage finding>
---
```

The four `exit` fields are mandatory and non-negotiable. A loop without all four
stops is a runaway, not a loop. They are restated as guardrails below because
they are the part most often shortcut.

## Mandatory guardrails

Every loop ships with four stops. The doer checks them every cycle, before doing
more work.

- Hard iteration cap. A fixed maximum number of cycles. Reaching it stops the
  loop, pass or not.
- Budget ceiling. A cost or token limit for the whole loop, independent of the
  iteration count. Whichever ceiling is hit first wins.
- No-progress detection. A defined signal that a cycle accomplished nothing (the
  same check fails the same way and the diff did not move). Two such cycles stop
  the loop; spinning is not iterating.
- Circuit breaker. A defined condition that means something is wrong enough to
  stop and escalate rather than retry: the check starts erroring in a new way,
  the work begins damaging unrelated code, or an exit signal itself is unclear.

When a circuit breaker trips, the loop does two things and stops: it files a
Now / P0 finding into the existing triage (root cause and file:line, per the
`AGENTS.md` triage rule), and it logs one line to `DECISIONS.md` recording that
the loop tripped and why. No new logging system, no separate loop journal. The
finding and the one-liner are the whole record.

## Deterministic check over self-assessment

The checker that decides whether a cycle passed is a deterministic command
bound to the justfile (`just verify`, `just test`, `just lint`, `just build`,
`just health`), never the doer grading its own output. An agent asked whether
its work is good will tend to say yes. A loop's authority to keep spending comes
from a check it does not control. An `llm-judge` checker is allowed only as a
second layer on top of a deterministic gate (for example, a rubric pass after
tests are already green), never as the sole arbiter of pass or fail.

## Inner and outer loops

Loops nest. An inner loop is an execution loop: it drives one well-scoped unit
of work to a green check (write the failing test, make it pass; reproduce the
bug, fix it). An outer loop is an orchestration loop: it sequences inner loops
across a larger body of work (review the roadmap and pick the next item; carry a
feature from plan to merged). The deterministic-check rule applies at every
level; an outer loop's check is just coarser.

v0.3 of groundwork ships only inner / execution loops. The outer
orchestration loops, a roadmap-review loop and a feature-delivery orchestrator,
are deferred: they need the inner loops to be stable and the gate and triage
plumbing to be exercised in real projects first. Adding them before then would
be generalizing against a hypothetical, which the guardrails forbid.

## Selecting a loop

The discovery interview (Charter and the early gates) surfaces the shape of the
work. Map its answers to the loops worth standing up:

| Discovery answer | Loop to consider |
|---|---|
| Building features with a test suite and a green-bar definition of done | `tdd-red-green-refactor` (inner) |
| Working from a ratified plan in `docs/plan/` toward a passing `just verify` | `plan-execute-verify` (inner) |
| Hunting a hard, reproducible bug or a performance regression | a diagnose-style inner loop (reproduce, minimize, fix, regression-test) |
| Sequencing many items across a roadmap, hands-off | outer orchestration loop, deferred past v0.3 |
| One-off change, or no deterministic check exists yet | no loop; do it as a task |

If the work is not in the table and does not clear the appropriateness gate, it
is a task, not a loop.
