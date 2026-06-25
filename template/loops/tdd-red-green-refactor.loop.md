---
trigger: building or fixing a behavior that has, or should have, an automated test
goal: the new behavior is covered by a test that failed first and now passes, with no regression in the rest of the suite
doer: the working agent, on a feature branch, one behavior at a time
checker:
  type: deterministic
  command: just test
exit:
  hard_cap: 3 fix attempts per cycle (one red test going green)
  budget: a token or cost ceiling set before the loop starts; stop when reached
  no_progress: the same test fails with the same assertion two attempts running
  circuit_breaker: any exit condition trips it; file a Now finding into docs/plan/ triage and log one line to DECISIONS.md
handoff: the passing test plus its implementation on the branch, ready for the plan-execute-verify loop's verify step
---

# Loop: TDD red, green, refactor

The inner loop for any behavior that has an automated test. One cycle covers one
behavior: write a test that fails for the right reason, make it pass with the
least code, then refactor under the green bar. It runs inside a single
plan-execute-verify slice and hands a passing, covered behavior back to that
loop's verify step.

## Philosophy

Test the behavior through its public interface, not its implementation. A test
asserts what a caller observes: a return value, a raised error, a persisted row,
a rendered element. It never reaches into private state or asserts how the work
is done. A test written this way survives refactoring, which is the whole point
of the third phase: you can rewrite the inside freely because the test only
pins the outside.

The red phase is not ceremony. A test that has never failed has never been
shown to test anything. Watch it fail, read the failure, confirm it fails
because the behavior is absent and not because of a typo or a bad import. The
failure message is the first thing you design.

## Anti-pattern: horizontal slicing

Writing all the tests for a feature first, then all the code, breaks the loop.
You lose the per-test red, the suite stays red for a long stretch, and you
cannot tell which code made which test pass.

WRONG: write `test_parse`, `test_validate`, `test_persist` all at once; then
write the parser, validator, and store to turn the whole batch green.

RIGHT: write `test_parse`, watch it fail, write only the parser to pass it,
refactor; then start `test_validate` as its own cycle. One vertical slice of
behavior per cycle, green between each.

## Phases

### 1. Red

Write one test for the next slice of behavior, expressed through the public
interface. Run `just test`. Confirm it fails, and that the failure names the
missing behavior rather than a setup mistake. If the test passes immediately,
the behavior already exists or the test asserts nothing; fix the test before
moving on.

### 2. Green (core)

This is the core phase. Write the least code that makes the failing test pass.
Not the elegant version, not the general version, the smallest change that turns
this one test green. Run `just test`. If other tests broke, you overreached;
narrow the change. Resist building for inputs no current test demands; that is
the generalize-against-real-instances guardrail, and a future test is not a real
instance. You get at most 3 attempts to reach green before the loop exits.

### 3. Refactor

With the bar green, improve the code and the test for clarity and to remove
duplication. Change names, extract helpers, collapse repetition. Do not add
behavior; a refactor that needs a new test is a new red cycle. Run `just test`
after each move so a regression surfaces immediately. End the cycle green.

## Per-cycle checklist

- One behavior chosen, expressed as a caller-observable outcome.
- Red: test written, `just test` run, failure confirmed to be the missing
  behavior.
- Green: least code written, `just test` passing, no other test broken, within
  the 3-attempt cap.
- Refactor: duplication removed, names clear, `just test` still green, no new
  behavior added.
- Branch and PR discipline held; the cycle ran on a feature branch.

## Exit criteria

The loop stops when any of these is true:

- Hard cap: 3 fix attempts on one red-to-green cycle without reaching green.
- Budget: the token or cost ceiling set at the start is reached.
- No progress: the same test fails with the same assertion two attempts in a
  row, which means the diagnosis is wrong, not the code.
- Circuit breaker: any of the above trips it. Stop coding. File a Now (P0)
  finding into the `docs/plan/` triage with root cause and the failing
  `file:line`, and append one dated line to `DECISIONS.md` recording the trip
  and the chosen next step (rethink the approach, or escalate to the diagnose
  loop). No new logging; reuse the triage and `DECISIONS.md` that already exist.

## Handoff

A clean exit leaves a test that failed first and now passes, its implementation,
and a green suite, all on the feature branch. That is the artifact the
plan-execute-verify loop's verify step picks up. A breaker exit leaves the Now
finding in `docs/plan/` and the `DECISIONS.md` line as the artifact, so the next
agent inherits the diagnosis rather than the dead end.
