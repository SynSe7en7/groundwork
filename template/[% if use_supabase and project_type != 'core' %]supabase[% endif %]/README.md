# Supabase backend (shared by every app surface)

One migration set is the single source of truth for the schema across web,
mobile, desktop, and hybrid.

## Local setup

1. `supabase init` to generate `config.toml` (kept out of this template so it
   never drifts from your installed CLI version).
2. `supabase link --project-ref <your-ref>` to link a project.
3. `supabase db push` to apply `migrations/` (schema first, before anything
   reads it).
4. Generate types for the app, for example
   `supabase gen types typescript --linked > ../web/lib/database.types.ts`, and
   regenerate on every migration (the edit-in-both-places rule).

## RLS posture

RLS is on for every table with owner-scoped policies; the service role bypasses
RLS for trusted server writes. Record any broad anon-read as a written accepted
risk in `docs/SECURITY_CHECKLIST.md`.

## Edge function (Modal seam)

`functions/run-heavy/` (present when Modal is enabled) validates the caller's
JWT, enqueues a `jobs` row, and hands off to the Modal HTTPS endpoint. The Modal
secret lives only here as a function secret, never in a client bundle. Deploy
with `supabase functions deploy run-heavy`.
