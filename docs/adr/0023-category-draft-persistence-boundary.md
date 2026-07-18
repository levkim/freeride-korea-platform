# ADR 0023: Category Draft Persistence Boundary

## Status
Accepted

## Context
The category content form validated fields on the client, but it did not submit through a server action. Category drafts need the same persistence boundary as inquiries and review actions.

## Decision
Add a category draft repository and server action.

When Supabase is configured, category drafts:

- insert into `content_entries` with `review` status
- create a matching `review_queue_items` row

When Supabase is not configured, the form validates and reports mock mode.

## Consequences
- Category content can now flow into the future review queue persistence model.
- Local development remains stable without credentials.
- The shared category form is now closer to a real CMS input surface.
