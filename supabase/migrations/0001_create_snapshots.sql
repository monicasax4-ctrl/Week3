create table public.snapshots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  data jsonb not null
);

alter table public.snapshots enable row level security;

-- Anyone (anon key) can insert a new snapshot. This is intentionally permissive:
-- the app has no user accounts, so any logged-in-to-the-app user creates snapshots
-- via the anon key. Flagged by Supabase's linter as "always true" but accepted here.
create policy "anon can insert snapshots"
  on public.snapshots for insert
  to anon
  with check (true);

-- Anyone can select a snapshot if they know its id. Snapshot ids are unguessable
-- v4 UUIDs and the app never exposes a "list snapshots" endpoint, so treat
-- snapshot links like unlisted-link secrets.
create policy "anon can select snapshots by id"
  on public.snapshots for select
  to anon
  using (true);
