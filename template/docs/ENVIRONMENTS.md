---
title: Environments
status: draft
updated: YYYY-MM-DD
---

# Environments

> Template. Two parallel stacks. The point: a dev deploy can never clobber prod.
> Fill the table with real names once the stacks exist.

| | Prod | Develop |
|---|---|---|
| Branch | `main` | `develop` |
| Web host | `<prod url>` | `<develop url>` |
| Compute app | `<prod app name>` | `<develop app name>` |
| Secret | `<prod secret>` | `<develop secret>` |
| Database | `<prod project ref>` | `<isolated develop project ref>` |
| APP_ENV | `prod` (default) | `develop` |

## How the split works

- Compute is separate. Each stack deploys to its own app and reads its own
  secret, so a develop deploy can never overwrite prod's backend. App and secret
  names are env-configurable, never hardcoded.
- Data is isolated. Develop points at its own database project; develop runs
  never write into prod tables.
- You can always tell which you are on. `/api/health` returns `app_env`,
  `version`, and `git_sha`; the frontend shows an env badge whenever `app_env` is
  not `prod`. Prod stays badge-free.

## Promotion gate (present or ship from develop only if it passes TWICE)

Default to prod. Promote develop only after this E2E checklist passes twice in a
row. Tailor the steps to the project:

- [ ] Core happy-path flow completes end to end
- [ ] All expected output renders
- [ ] The env badge reads the env you intended to test
- [ ] Refresh and reopen behavior is understood

## Cleanup

- Pause or delete the isolated develop database when idle to stop charges.
- Develop test data lives only in the develop project; prod needs no cleanup.
