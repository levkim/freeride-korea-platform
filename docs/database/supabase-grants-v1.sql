-- FREERIDE KOREA Supabase grants v1
-- Run this if the schema exists but the app receives permission denied errors.
-- It is safe to run repeatedly.

grant usage on schema public to anon, authenticated, service_role;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
grant all privileges on all functions in schema public to service_role;

grant select on public.content_entries to anon, authenticated;
grant select on public.event_entries to anon, authenticated;
grant select on public.content_links to anon, authenticated;
grant select on public.comments to anon, authenticated;
