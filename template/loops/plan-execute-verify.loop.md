---
trigger: A ratified plan slice is ready to implement. The PRD / Plan gate is ratified in docs/GATES.md, the slice is the smallest vertical cut in docs/plan/<slug>.md, and its acceptance criteria are written.
goal: The slice is implemented and verify passes with the plan's acceptance criteria met. Done means just build && just lint are green (plus just test when the slice carries tests), the slice's stated acceptance criteria are demonstrably satisfied, and the plan status reflects this slice as done.
doer: The implementing agent. Writes the slice as one vertical cut end to end, then runs the checker.
checker:
  type: deterministic
  command: just build && just lint
  with_tests: just test
  note: Run just test in addition whenever the slice adds or changes behavior under test. Behavior-bearing slices should route through the tdd loop for the test itself; this loop's checker confirms the slice still builds, lints, and passes that test.
exit:
  - hard_iteration_cap: 5 execute->verify cycles on one slice.
  - cost_token_budget: stop at the budget the plan or the operator set for the slice; if none is set, stop at the same point as the iteration cap.
  - no_progress: two consecutive cycles with the same failing check and no reduction in the failure set.
  - circuit_breaker: the slice cannot pass verify within the cap, or verify reveals the slice was the wrong cut (the approach does not hold end to end). File a Now / P0 finding into the existing triage and log one line to DECISIONS.md, then stop.
handoff: On success, update the slice's status in docs/plan/<slug>.md to done and hand the next slice back into this loop. If the next slice is behavior work, hand to the tdd loop first and return here for integration. On a tripped breaker, the filed Now finding and DECISIONS line are the handoff.
---

# Plan-Execute-Verify loop

The inner execution loop for a single planned slice. You take one ratified slice
from docs/plan, cut it as a thin vertical line through the whole stack, and prove
it holds before widening. This is the outer of the two inner loops: it owns the
slice; the tdd loop owns each behavior inside the slice.

## Philosophy

A slice is a tracer bullet. The point of the first cut is not to finish the
feature; it is to fire one round through every layer the feature touches
(datastore, compute, surface) and see where it lands. A slice that runs end to
end, even trivially, has proven the approach. A slice that is broad but stops at
a layer boundary has proven nothing and hidden the risk.

So cut the smallest slice that still crosses every layer. Build it. Verify it.
The slice is real only once verify is green and its acceptance criteria hold. The
plan is a set of these slices; you walk them one at a time, and each green verify
is a checkpoint you can hand off or stop at.

## Anti-pattern: big-bang implement-everything-then-verify

Writing the whole feature across every layer and saving verification for the end.
The first signal arrives after the largest possible investment, so a wrong
assumption costs the most to unwind and the failure points at no single layer.

WRONG: Implement the schema, the compute, and three surfaces for the whole
feature. Run verify once at the end. It fails. The break could be in any of the
four pieces, and the cut may have been wrong from the start.

RIGHT: Cut slice one as one record through schema -> compute -> one surface. Run
verify. Green. Cut slice two on top. Run verify. Each cycle's failure points at
the one thing that cycle changed, and a wrong approach surfaces on the first
slice when it is cheapest to redirect.

## Phases

### 1. Plan (read the slice)

Read the slice in docs/plan/<slug>.md and confirm the PRD / Plan gate is ratified
in docs/GATES.md. Restate, for this slice only: the one layer-crossing change, the
exact files and lines it touches, and its acceptance criteria. Confirm the cut is
the smallest line that still crosses every layer the slice names. If the slice is
actually several cuts, split it and take the first. If it carries behavior, note
that the tdd loop owns those tests.

### 2. Execute (cut the slice)

Write the slice as one vertical line, end to end. Touch only the files the slice
names. Do not widen to adjacent improvements, do not generalize against a single
instance, and do not pull the next slice's work forward. Behavior work goes
through the tdd loop and returns here. Keep the diff small enough that a single
verify failure points at one change.

### 3. Verify (the core)

This is the core phase. Run the checker: `just build && just lint`, and `just
test` when the slice has tests. Green build and lint is necessary but not
sufficient; the slice is done only when its written acceptance criteria are also
demonstrably met. If verify fails, read the actual error before forming a
hypothesis, make the smallest fix, and run the checker again. If green but a
criterion is unmet, the slice is not done; treat the gap as the next failure and
return to execute. Every claim of done is falsifiable by re-running the checker.

## Per-cycle checklist

- Is this still the smallest cut that crosses every layer the slice names?
- Did I touch only the files the slice names, with no widening or pull-forward?
- Did behavior work route through the tdd loop and come back here?
- Did `just build && just lint` pass (and `just test` if the slice has tests)?
- Are the slice's written acceptance criteria demonstrably met, not just assumed?
- Which exit condition am I closest to, and how many cycles have I spent?

## Exit criteria

Stop at the first of these:

- Success: verify is green and the acceptance criteria hold. Go to handoff.
- Hard cap: 5 execute -> verify cycles on this slice.
- Budget: the slice's cost or token budget is reached.
- No progress: two cycles in a row with the same failing check and no smaller
  failure set.
- Circuit breaker: the slice will not pass within the cap, or verify shows the
  cut was wrong (the approach does not hold end to end).

A tripped breaker files a Now / P0 finding into the existing triage (root cause,
file:line, and which exit tripped) and logs one line to DECISIONS.md. No new
logging channel; reuse triage and DECISIONS.md.

## Handoff

- On success: set the slice's status to done in docs/plan/<slug>.md, bump its
  updated date, and hand the next slice back into this loop. If the next slice is
  behavior work, hand to the tdd loop first and return here to integrate and
  verify. When the last slice is done, the plan is complete and ready for its
  gate's next step.
- On a tripped breaker: the filed Now finding and the one DECISIONS.md line are
  the handoff. Do not silently retry past the cap.

## How it composes

This loop is the outer of the two inner loops. It walks the plan slice by slice
and owns each slice end to end. Inside a slice, behavior is built by the tdd loop
(red -> green -> refactor); that loop returns a passing test, and this loop's
verify confirms the slice still builds, lints, and passes it before the slice is
called done. Plan-execute-verify answers "is this slice the right cut and does it
hold end to end"; tdd answers "does this one behavior do what it should."
