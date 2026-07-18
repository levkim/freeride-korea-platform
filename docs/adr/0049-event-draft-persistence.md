# ADR 0049: Event Draft Persistence

## Status

Accepted

## Context

Events are a core public section for official FWT series, FIS Freeride World Championships, FWT Challenger, FWT Qualifier, FWT Junior, Freeride Asia, and future regional competitions. The admin event form previously validated the shape locally, but did not submit drafts into the CMS workflow.

## Decision

Add a Supabase-ready event repository and submit action.

Event drafts now:

- validate shared event input
- store public content fields in `content_entries`
- store schedule, series, officiality, country, resort, cancellation, and official links in `event_entries`
- store additional related links in `content_links`
- create a `review_queue_items` entry for administrator approval
- fall back to mock mode when Supabase admin credentials are missing

Admin and public event lists now read through the event repository, using Supabase when configured and seed data otherwise.

## Consequences

Events can enter the same review and publishing pipeline as News & Video and category content.

The status display remains computed from schedule and cancellation state, while publishing remains controlled by `content_entries.status`.
