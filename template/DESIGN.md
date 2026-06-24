---
title: Design
status: draft   # draft | locked | accepted
updated: YYYY-MM-DD
---

# Design — tokens and accessibility floor

> Template. The visual system for user-facing surfaces. Fill the tokens, set the
> a11y floor, then set status to locked. UI work that only consumes defined
> tokens does not reopen this gate. The CI tripwire treats `status: locked` or
> `status: accepted` as the signal that UI work is in scope.

## Tokens

Define once; reference everywhere (CSS variables or a tokens file).

| Token | Value | Use |
|---|---|---|
| color.bg | `<hex>` | page background |
| color.fg | `<hex>` | body text |
| color.brand | `<hex>` | primary brand |
| color.accent | `<hex>` | callouts, emphasis |
| font.body | `<family>` | body copy |
| font.head | `<family>` | headings |
| space.unit | `<n>px` | spacing base |
| motion.fast | `<ms>` | snappy transitions |

## Accessibility floor (do not drop below)

- Text contrast meets WCAG AA (4.5:1 body, 3:1 large).
- Every interactive element has a visible `:focus-visible` state.
- Honor `prefers-reduced-motion`; no motion-only information.
- Touch and click targets at least 44x44px.
- No color-only signaling (pair color with shape or label).

## Environment signaling

Any non-prod environment must self-identify in the UI: show an env badge
whenever `app_env` is not `prod`. Prod stays badge-free. The badge reads the
value returned by `/api/health`.
