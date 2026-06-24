---
title: Deploy
status: draft
updated: YYYY-MM-DD
---

# Deploy guide

> Template. Placeholders only. Never commit real credentials here (see
> `docs/SECURITY_CHECKLIST.md`). Fill the commands for this project's stack.

Three independent targets (adjust to the project):

1. Database: schema and storage
2. Compute: backend or pipeline
3. Web host: frontend

## Order matters

Bring up in this order so compute can write to the database, and the frontend's
env points at the live backend URL last (so the frontend never builds against a
dead endpoint):

```text
DB migrations -> compute secret + deploy -> set frontend env -> frontend build
```

## 1) Database

```bash
# apply the schema and migrations to the linked project
<migration push command>
```

## 2) Compute

```bash
# create the secret bundle once (placeholders only)
<create secret: KEY=<value> ...>
# deploy; app and secret names come from env vars, never hardcoded
<APP_NAME=... SECRET_NAME=... deploy command>
# verify
curl -s <backend url>/api/health   # expect app_env / version / git_sha
```

## 3) Web host

Set env (set the API base URL to the live backend URL from step 2, LAST):

| Variable | Value |
|---|---|
| `API_BASE_URL` | `<live backend url>` |
| `<other vars>` | `<placeholder>` |

Then trigger the build. Confirm the deploy scope matches the intended target
before shipping.

## Troubleshooting (real failure modes)

- Every request 4xx including the health check. Curl the endpoint and read the
  body before theorizing. On a managed host this often means a workspace spend
  limit rather than app logic; raise the limit, do not add retries.
- Backend cannot write to the DB. The secret's service key does not match the
  linked project.
- Frontend says the backend is unreachable. The API base URL is stale; re-set it
  to the current backend URL and rebuild.
- Wrong things deployed. The CLI auth switched scope; verify the active account
  or team and redeploy to the right one.
