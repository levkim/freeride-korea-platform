# ADR 0033: Admin Category Content List

## Status

Accepted

## Context

The admin category page previously described category structures and linked to one sample edit page per category. As content grows, administrators need an operational list of actual category content records, not only structural cards.

## Decision

Add an admin-only category content list to `/admin/site-categories`.

- The list shows title, category kind, subtype, status, summary, and edit action.
- The list reads from Supabase when admin environment variables are available.
- In mock mode, the list falls back to seed category content.
- Each row links to `/admin/site-categories/[id]/edit`.

## Consequences

Administrators can manage real category content from one place. The page now supports both structural planning and day-to-day edit access without creating separate navigation yet.
