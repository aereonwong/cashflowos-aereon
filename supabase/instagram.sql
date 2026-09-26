-- AereonDashboard — Instagram snapshots.
-- One row per refresh: the profile counters + the posts (with their insights)
-- exactly as Instagram returned them. The app reads the newest row, so the tab
-- loads instantly and never depends on a live API call.
create table if not exists ig_snapshots (
  id          bigint generated always as identity primary key,
  captured_at timestamptz not null default now(),
  username    text,
  profile     jsonb       not null default '{}'::jsonb,
  posts       jsonb       not null default '[]'::jsonb
);
create index if not exists ig_snapshots_captured_idx on ig_snapshots (captured_at desc);
-- Server-side only, like every other table here: RLS on, no policies.
alter table ig_snapshots enable row level security;
