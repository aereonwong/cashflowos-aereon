-- AereonDashboard — the daily tech & travel news digest, kept.
-- The 9am cron still texts the digest to Telegram exactly as before; it now also
-- saves each story here, one row per story, so the News page can show history
-- and filter it. Re-running a day never duplicates: (digest_date, headline) is unique.
create table if not exists news_items (
  id           bigint generated always as identity primary key,
  digest_date  date        not null,
  section      text        not null,  -- tech | travel | malaysia | angles
  headline     text        not null,
  summary      text        not null default '',
  url          text,
  source       text,                  -- the story's website, e.g. theverge.com
  created_at   timestamptz not null default now(),
  unique (digest_date, headline)
);
create index if not exists news_items_date_idx on news_items (digest_date desc);
create index if not exists news_items_section_idx on news_items (section);
-- Server-side only, like every other table here: RLS on, no policies.
alter table news_items enable row level security;
