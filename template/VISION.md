---
# Machine-readable facets. The discovery session fills these; selection and
# later automation read them. Replace every angle-bracket placeholder.
domains: [<primary domain, e.g. carbon-mrv>, <secondary, optional>]
surfaces: [<web | mobile | desktop | api | cli | batch ...>]
data_sensitivity: <none | internal | pii | regulated-claims>
gtm_motion: <self-serve | sales-led | plg | internal-tool | marketplace>
primary_jobs:
  - <the top job the user hires this to do, in their words>
  - <the next job, optional>
status: draft   # draft | accepted
updated: YYYY-MM-DD
---

# Vision — <Project name>

> Template. Replace every angle-bracket placeholder. The discovery skill fills
> this in Round 1 alongside `CHARTER.md`, then sets status to accepted when the
> owner signs off. This is the working-backwards artifact: write it as if the
> thing already shipped and worked, then check whether the bet still holds.
> Charter is the boundary; this is the bet and the why.

## Press release (from the future)

Dated <a realistic ship date>. One paragraph, written as if it already happened.
Lead with the customer and the job, name the outcome in plain terms, and state
the single thing that is now true that was not true before.

<One paragraph. Who can now do what they could not, and why that matters to them.
No internal jargon. A skeptical outsider should be able to read it and tell what
changed for a real person.>

## Customer FAQ

Five to eight questions a real prospective user or buyer would ask, answered
honestly. These are the questions that decide whether they adopt, not the ones
that flatter the idea.

1. <Who is this for, and who is it explicitly not for?>
   <Answer.>
2. <What did they do before this existed, and why was that painful enough to
   switch?>
   <Answer, anchored in a concrete recent episode, not a hypothetical.>
3. <What does it cost them, in money, time, or change of habit?>
   <Answer.>
4. <What has to be true for it to work for them on day one?>
   <Answer.>
5. <How do they know it is working? What do they see?>
   <Answer, tied to the North Star below.>
6. <What is the most likely reason they bounce or churn?>
   <Answer, honest.>
7. <optional>
8. <optional>

## North Star and input metrics

One North Star metric that captures delivered value, and two or three input
metrics the team can actually move that should drive it. Pick the North Star that
is hard to game by doing the wrong thing.

- North Star: <the one metric that means we are delivering the value above>
- Input 1: <a lever the team controls that should move the North Star>
- Input 2: <a second lever>
- Input 3: <optional third lever>

## Why this loses (steelman)

Argue the other side as hard as an investor who wants to pass. Name the failure
modes that would actually kill this, and for each, the cheapest test that would
tell you early.

- <The strongest reason this never finds its market or its users.>
  Earliest cheap test: <what would surface this before heavy build>
- <The strongest reason it is technically or operationally infeasible at the
  needed quality or cost.>
  Earliest cheap test: <...>
- <The strongest reason that even if it works, it does not pay for itself or
  cannot be defended.>
  Earliest cheap test: <...>

If none of these have a cheap early test, that is the real risk. Say so here, and
carry it into the PRD as the first thing to de-risk.
