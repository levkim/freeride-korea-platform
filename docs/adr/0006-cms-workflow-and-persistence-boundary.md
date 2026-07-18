# ADR 0006: CMS Workflow And Persistence Boundary

## Status

Accepted

## Context

FREERIDE KOREA needs member-submitted content, admin approval, official event/news updates, education programs, tours, marketplace listings, and resource links. The current app is still using seed data, but the admin UI should already follow the future CMS rules.

## Decision

The app will use a shared workflow policy before adding a real database:

- General members can draft culture posts and marketplace listings.
- Regular members and above can draft tour and education/program content.
- Executive members and above can draft news, video, and event content.
- Admins are the only role that can approve and publish content.
- New submitted content starts in `review`.
- Public pages only show `published` content after the database layer is added.
- Event status remains schedule-driven, with only `cancelled` as a manual admin override.

The Supabase/Postgres schema is documented in `docs/database/supabase-schema-v1.sql`. Until Supabase is connected, seed data remains the public source of truth.

## Consequences

Admin screens can be built now without locking the project into a temporary local-storage model. The next implementation can add Supabase tables, server actions, and media uploads while reusing the same types and workflow policy.
