---
name: scaffold-assignment
description: Recommends and records which groundwork scaffold (web, mobile, desktop, hybrid, or the core governance overlay) fits a project, by mapping its real requirements (where it runs, native device needs, whether web and mobile are both first-class, or whether it is an existing repo) to one scaffold with a one-line rationale, and documents the recorded path for changing scaffold later. Use when spinning up a new project and choosing project_type, when the owner asks "which scaffold", "web or mobile or desktop", or "should this be hybrid", when discovery needs to confirm the assigned scaffold against the emerging requirements, or when a project needs to change its scaffold (for example graduating web to hybrid) as a deliberate, recorded migration.
---

# Scaffold assignment

The scaffold is the one upfront choice Copier cannot defer: it decides which app
surface a project materializes. This skill makes that choice an output of the
project's requirements rather than a default someone clicked past, records why,
and defines the one recorded way to change it later.

It runs at two moments. Before generation, it recommends the `project_type` to
feed Copier. After generation, it is the home for confirming the assignment
against what discovery surfaces and for changing scaffold as a recorded migration.

## The five scaffolds

| Scaffold | What it is | Assign it when |
|---|---|---|
| `web` | Next.js 16 app on Vercel | The product is a website or web app, the browser is the primary reach, and SEO or shareable URLs matter. The default when nothing below applies. |
| `mobile` | Expo / React Native, web-capable via React Native Web | The primary surface is a phone app (App Store / Play), or it needs native device capabilities (camera, push, offline, sensors). A companion website rides the same codebase. |
| `desktop` | Tauri 2, web frontend in the system webview | The product is an installed desktop app: offline-first, filesystem or system integration, native menus, and signed auto-updating binaries. |
| `hybrid` | Turborepo, Expo + Next.js sharing UI via Tamagui/Solito | The product must be both a real web app and a native mobile app, both first-class, sharing screens and logic. Heavier; only when web is a product surface in its own right, not a companion. |
| `core` | Governance overlay, no app scaffold | There is already a codebase. The project adopts the gates, AGENTS.md, hygiene, and CI without a new app. |

## Assignment (before generation)

Hold the discovery cadence: ask two or three questions, offer a one-word default,
then wait. Do not dump the whole matrix. Read anything already stated (a pasted
brief, a `project_description`) before asking.

Ask only what separates the scaffolds:

- Is there an existing repo this is being added to? If yes, the answer is `core`;
  stop here.
- Where does it primarily run: the browser, a phone, or an installed desktop app?
- Does it need a real web presence and a native mobile app, both first-class and
  sharing code? If yes, that is the `hybrid` signal.
- Does it need native device capabilities or app-store distribution? That points
  to `mobile`.
- Is it offline-first with filesystem or system integration? That points to
  `desktop`.

Resolve in this order, taking the first that fits, so the heavier scaffolds are
only chosen on a real signal:

1. Existing repo to govern -> `core`.
2. Web and native mobile both first-class and sharing code -> `hybrid`.
3. Phone-first or needs native device capabilities -> `mobile` (its `target_web`
   toggle still gives a companion website from the same codebase).
4. Installed desktop app, offline or system integration -> `desktop`.
5. Otherwise -> `web` (the default).

Output one line: the recommended scaffold and the single requirement that drove
it, for example "hybrid, because the web app and the field mobile app are both
products and share the booking flow." Confirm with the owner, then generate with
that `project_type` (the `create-groundwork` wrapper and `copier copy` both take
`--data project_type=<scaffold>`).

When two scaffolds are close, prefer the lighter one and name the signal that
would later justify the heavier (most often `web` now, `hybrid` when the mobile
app becomes a product). That signal is the change trigger below.

## Record the assignment (after generation)

The `project_type` is already in `.copier-answers.yml`. Record the human-readable
why so the choice is a justified decision, not a silent answer:

- In `CHARTER.md`, the Constraints `Platform / scaffold` line names the scaffold
  and the one requirement that drove it.
- In `DECISIONS.md`, one dated line: the scaffold assigned and why.

Discovery confirms this in its scaffold round: if the requirements it surfaces
contradict the assigned scaffold (the owner described a native app but the project
generated as `web`), it flags the mismatch and points here to the change path
rather than quietly proceeding.

## Changing scaffold later (the recorded migration)

A scaffold change is always deliberate and recorded, never silent. The usual case
is graduation: a `web` project whose mobile app becomes a first-class product
moves to `hybrid`. The hybrid scaffold keeps its shared UI in `packages/ui`
(Tamagui), consumed by both its web and native apps, so the graduated project has
one home for shared components. (The standalone `mobile` scaffold uses React
Native StyleSheet, not Tamagui; the shared Tamagui layer is a hybrid feature.)

The steps:

1. Record the decision in `DECISIONS.md`, and write an ADR if the change is
   load-bearing (a new runtime, a store distribution requirement, a shared-UI
   layer). The Stack gate owns that ADR.
2. Re-run generation against the new scaffold with `copier recopy --overwrite
   --data project_type=<new>` (recopy re-applies the template with the new
   answer). User-owned files (`_skip_if_exists`: README, CHARTER, the gate docs)
   are preserved; `--overwrite` is needed because template-owned files conflict
   otherwise, and a bare interactive recopy stalls in CI. The new scaffold's
   template reaches the project only once it is released and tagged (or pin it
   with `--vcs-ref`).
3. Update the `CHARTER.md` Platform / scaffold line; `.copier-answers.yml` now
   records the new `project_type`.
4. The prior surface directory (for example `web/`) is left in place; removing it
   is a conscious step recorded under the same migration, not an ad hoc delete.
5. Run `just verify` and reconcile any conflicts before committing.

Never demote by deleting a surface ad hoc. The recorded migration is the only
path, so the history shows when and why the scaffold changed.

## Handoff

This skill writes nothing on its own beyond the assignment record. Pre-generation
it produces the `project_type` the owner confirms. Post-generation it writes:

- the `CHARTER.md` Constraints `Platform / scaffold` line (the scaffold and why),
- one dated line in `DECISIONS.md` for the assignment or any later change,
- an ADR only when a scaffold change is load-bearing (via the Stack gate).

It does not pick skills or loops; that is `discovery` Round 3. It does not build
the product.
