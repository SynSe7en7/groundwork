---
title: Security checklist
status: draft
updated: YYYY-MM-DD
---

# Security checklist (re-runnable)

> Run this before the first shared-env deploy and again before every promotion to
> prod. It is never exempt at a prod-promotion gate. The seed items below are
> lessons carried from prior projects; keep, adapt, and add to them.

## Secrets

- [ ] No real secret values are committed. Every secret is an env-driven
      placeholder in committed files (`.env.example`, docs use `<...>` not real
      keys). Real values live only in the secret store or an untracked `.env`.
- [ ] No blind `--force` secret overwrites. A `secret create --force` REPLACES
      the whole secret with only the values passed; it does not merge. Never run
      it without ALL existing key-values, or use the dashboard for single-field
      edits.

## Data access (RLS)

- [ ] RLS posture is decided and written down. Default safe pattern: RLS on and
      NO anon-read policy (the service role bypasses RLS for backend writes).
- [ ] If broad anon-read is left on, it is a deliberate, recorded accepted risk
      with a named owner, a rationale, and a deferral tier, plus the trigger that
      re-tiers it to Now (for example, the moment external end-users are on the
      table). Prod stays clean: prod changes only via a full reviewed merge.

## Deploy scope

- [ ] The deploy targets the intended account, team, or scope. CLI auth can
      silently switch scope when the wrong account is approved in a browser;
      verify the active team before deploying.
- [ ] A dev deploy cannot reach prod's compute, secret, or data (stacks are
      parameterized purely by env var; see `docs/ENVIRONMENTS.md`).

## Operational runbook

- [ ] A total outage on a managed host (every request, including the health
      check, returning the same 4xx) is diagnosed by curling the endpoint and
      reading the response body before forming hypotheses. A known cause on Modal
      is the workspace billing-cycle spend limit (`webhook failed: ... spend limit
      reached`); the fix is raising the limit in the dashboard, and app-level
      retry or backoff does not help.
- [ ] Heavy compute stays out of the hot CRUD and auth path; it runs async and
      writes results back to the datastore.
