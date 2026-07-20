begin;
drop schema if exists public cascade;
create schema public;
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on schema public to postgres, anon, authenticated, service_role;
set search_path = public;

-- FREERIDE KOREA CMS schema v1
-- This is the planned persistence contract for Supabase/Postgres.
-- The current app uses seed data until the database connection is added.

create type member_type as enum (
  'general',
  'regular',
  'executive',
  'athlete',
  'supporting'
);

create type member_status as enum (
  'active',
  'reviewing',
  'suspended'
);

create type content_kind as enum (
  'news',
  'video',
  'event',
  'program',
  'tour',
  'culture',
  'marketplace',
  'resource',
  'shop'
);

create type publish_status as enum (
  'draft',
  'review',
  'needs_revision',
  'approved',
  'published',
  'rejected',
  'hidden',
  'archived'
);

create type event_series as enum (
  'fis-freeride-world-championships',
  'freeride-world-tour',
  'fwt-challenger',
  'fwt-qualifier',
  'fwt-junior',
  'freeride-asia'
);

create type event_officiality as enum (
  'official',
  'unofficial'
);

create type inquiry_type as enum (
  'athlete-program',
  'education',
  'freeride-tour',
  'membership',
  'business-partner',
  'sponsorship',
  'media',
  'general'
);

create type inquiry_status as enum (
  'new',
  'reviewing',
  'needs_reply',
  'closed'
);

create type review_subject_kind as enum (
  'content',
  'member-upgrade',
  'source-alert',
  'ai-draft',
  'inquiry'
);

create type review_action as enum (
  'submit',
  'approve',
  'request_revision',
  'reject',
  'publish',
  'hide',
  'archive',
  'assign',
  'comment'
);

create type comment_target_type as enum (
  'news-video',
  'event',
  'category-content'
);

create type comment_status as enum (
  'visible',
  'hidden',
  'reported',
  'deleted'
);

create type comment_action as enum (
  'create',
  'mark_visible',
  'hide',
  'delete',
  'report',
  'pin',
  'unpin'
);

create table members (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  member_type member_type not null default 'general',
  status member_status not null default 'active',
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table content_entries (
  id uuid primary key default gen_random_uuid(),
  kind content_kind not null,
  status publish_status not null default 'review',
  title_ko text not null,
  title_en text not null,
  summary_ko text not null,
  summary_en text not null,
  body_ko text,
  body_en text,
  image_url text,
  source_url text,
  youtube_url text,
  metadata jsonb not null default '{}'::jsonb,
  author_id uuid references members(id),
  approved_by uuid references members(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table event_entries (
  content_id uuid primary key references content_entries(id) on delete cascade,
  series event_series not null,
  officiality event_officiality not null,
  season text not null,
  country text not null,
  location text not null,
  resort text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null,
  cancelled boolean not null default false,
  official_link text,
  registration_link text,
  replay_or_results_link text,
  check (ends_at >= starts_at)
);

create table content_links (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references content_entries(id) on delete cascade,
  label text not null,
  url text not null,
  sort_order integer not null default 0
);

create table review_queue_items (
  id uuid primary key default gen_random_uuid(),
  subject_kind review_subject_kind not null,
  content_id uuid references content_entries(id) on delete cascade,
  member_id uuid references members(id),
  inquiry_id uuid,
  title text not null,
  status publish_status not null default 'review',
  risk text not null default 'low' check (risk in ('low', 'medium', 'high')),
  required_author_role member_type,
  required_publish_role text not null default 'admin',
  submitted_by uuid references members(id),
  assigned_to uuid references members(id),
  source_url text,
  created_at timestamptz not null default now()
);

create table inquiry_entries (
  id uuid primary key default gen_random_uuid(),
  inquiry_type inquiry_type not null,
  status inquiry_status not null default 'new',
  name text not null,
  email text not null,
  phone text,
  riding_experience text,
  requested_member_type text,
  title text not null,
  message text not null,
  assigned_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table review_queue_items
  add constraint review_queue_items_inquiry_fk
  foreign key (inquiry_id) references inquiry_entries(id) on delete cascade;

create table review_events (
  id uuid primary key default gen_random_uuid(),
  review_item_id uuid not null references review_queue_items(id) on delete cascade,
  action review_action not null,
  from_status publish_status,
  to_status publish_status,
  actor_id uuid references members(id),
  note text not null,
  created_at timestamptz not null default now()
);

create table inquiry_events (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references inquiry_entries(id) on delete cascade,
  from_status inquiry_status,
  to_status inquiry_status not null,
  actor_id uuid references members(id),
  note text,
  created_at timestamptz not null default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  target_type comment_target_type not null,
  target_content_id uuid references content_entries(id) on delete cascade,
  target_event_id uuid references content_entries(id) on delete cascade,
  author_id uuid not null references members(id) on delete cascade,
  body text not null,
  status comment_status not null default 'visible',
  report_count integer not null default 0 check (report_count >= 0),
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (target_type = 'event' and target_event_id is not null and target_content_id is null)
    or
    (target_type in ('news-video', 'category-content') and target_content_id is not null and target_event_id is null)
  )
);

create table comment_events (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references comments(id) on delete cascade,
  action comment_action not null,
  from_status comment_status,
  to_status comment_status,
  actor_id uuid references members(id),
  note text,
  created_at timestamptz not null default now()
);

create index content_entries_kind_status_idx on content_entries(kind, status);
create index content_entries_published_at_idx on content_entries(published_at desc);
create index event_entries_series_season_idx on event_entries(series, season);
create index event_entries_schedule_idx on event_entries(starts_at, ends_at);
create index review_queue_items_status_risk_idx on review_queue_items(status, risk);
create index review_queue_items_subject_idx on review_queue_items(subject_kind, created_at desc);
create index review_events_item_created_idx on review_events(review_item_id, created_at desc);
create index inquiry_entries_type_status_idx on inquiry_entries(inquiry_type, status);
create index inquiry_entries_created_at_idx on inquiry_entries(created_at desc);
create index comments_content_target_idx on comments(target_type, target_content_id, created_at desc);
create index comments_event_target_idx on comments(target_type, target_event_id, created_at desc);
create index comments_status_report_idx on comments(status, report_count desc);
create index comment_events_comment_created_idx on comment_events(comment_id, created_at desc);


commit;

select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;

