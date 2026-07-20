-- FREERIDE KOREA Supabase seed v1
-- Generated from content/seed/site-data.ts.
-- Run after docs/database/supabase-schema-v1.sql and docs/database/supabase-rls-hotfix-v1.sql.

begin;

insert into members (
  id,
  email,
  name,
  member_type,
  status,
  joined_at
) values

on conflict (email) do update set
  name = excluded.name,
  member_type = excluded.member_type,
  status = excluded.status,
  updated_at = now();

insert into content_entries (
  id,
  kind,
  status,
  title_ko,
  title_en,
  summary_ko,
  summary_en,
  body_ko,
  body_en,
  image_url,
  source_url,
  youtube_url,
  metadata,
  published_at
) values

on conflict (id) do update set
  kind = excluded.kind,
  status = excluded.status,
  title_ko = excluded.title_ko,
  title_en = excluded.title_en,
  summary_ko = excluded.summary_ko,
  summary_en = excluded.summary_en,
  body_ko = excluded.body_ko,
  body_en = excluded.body_en,
  image_url = excluded.image_url,
  source_url = excluded.source_url,
  youtube_url = excluded.youtube_url,
  metadata = excluded.metadata,
  published_at = excluded.published_at,
  updated_at = now();

insert into event_entries (
  content_id,
  series,
  officiality,
  season,
  country,
  location,
  resort,
  starts_at,
  ends_at,
  timezone,
  cancelled,
  official_link,
  registration_link,
  replay_or_results_link
) values

on conflict (content_id) do update set
  series = excluded.series,
  officiality = excluded.officiality,
  season = excluded.season,
  country = excluded.country,
  location = excluded.location,
  resort = excluded.resort,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  timezone = excluded.timezone,
  cancelled = excluded.cancelled,
  official_link = excluded.official_link,
  registration_link = excluded.registration_link,
  replay_or_results_link = excluded.replay_or_results_link;

delete from content_links
where content_id in ();

-- No seeded content links.

commit;
