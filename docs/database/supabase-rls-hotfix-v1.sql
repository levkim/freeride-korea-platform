-- FREERIDE KOREA Supabase RLS hotfix v1
-- Purpose:
-- 1. Resolve Supabase Advisor critical warnings for public tables with RLS disabled.
-- 2. Prevent anon/authenticated clients from directly changing operational data.
-- 3. Allow only safe public reads for already published public content.
--
-- Run this in Supabase SQL Editor after the base schema exists.
-- Server-side actions using SUPABASE_SERVICE_ROLE_KEY continue to work because
-- the service role bypasses RLS. Do not expose the service role key to clients.

alter table public.members enable row level security;
alter table public.content_entries enable row level security;
alter table public.event_entries enable row level security;
alter table public.content_links enable row level security;
alter table public.review_queue_items enable row level security;
alter table public.inquiry_entries enable row level security;
alter table public.review_events enable row level security;
alter table public.inquiry_events enable row level security;
alter table public.comments enable row level security;
alter table public.comment_events enable row level security;

drop policy if exists "public read published content entries" on public.content_entries;
create policy "public read published content entries"
on public.content_entries
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "public read published event entries" on public.event_entries;
create policy "public read published event entries"
on public.event_entries
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.content_entries ce
    where ce.id = event_entries.content_id
      and ce.status = 'published'
  )
);

drop policy if exists "public read published content links" on public.content_links;
create policy "public read published content links"
on public.content_links
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.content_entries ce
    where ce.id = content_links.content_id
      and ce.status = 'published'
  )
);

drop policy if exists "public read visible comments on published content" on public.comments;
create policy "public read visible comments on published content"
on public.comments
for select
to anon, authenticated
using (
  status = 'visible'
  and (
    exists (
      select 1
      from public.content_entries ce
      where ce.id = comments.target_content_id
        and ce.status = 'published'
    )
    or
    exists (
      select 1
      from public.content_entries ce
      where ce.id = comments.target_event_id
        and ce.status = 'published'
    )
  )
);

-- No anon/authenticated direct write policies are created in this hotfix.
-- Writes for inquiries, comments, drafts, review actions, and admin operations
-- must go through validated Next.js server actions using the server-only
-- Supabase service role boundary.
