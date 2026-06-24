-- groundwork shared schema. One migration set serves every environment.
-- RLS is ON for every table. The safe default is RLS enabled with owner-scoped
-- policies and NO broad anon-read; the service role (trusted server code)
-- bypasses RLS. Record any deliberate broad anon-read as a written accepted
-- risk in docs/SECURITY_CHECKLIST.md.

-- profiles: one row per auth user.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Create a profile row automatically when a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- jobs: the Modal escape-hatch seam. Heavy compute runs off the hot path and
-- writes results back here; clients read their own rows via RLS.
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'queued' check (status in ('queued','running','done','failed')),
  payload jsonb not null default '{}'::jsonb,
  result jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.jobs enable row level security;

create policy "jobs_select_own" on public.jobs
  for select using (auth.uid() = user_id);
create policy "jobs_insert_own" on public.jobs
  for insert with check (auth.uid() = user_id);

create index if not exists jobs_user_id_idx on public.jobs (user_id);
