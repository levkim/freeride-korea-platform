# ADR 0037: Admin Category Content Search

## Status

Accepted

## Context

Category and status filters help narrow admin content lists, but operators still need to find a specific content item quickly by title, subtype, summary, body text, or tags.

## Decision

Add URL-based keyword search to `/admin/site-categories`.

- The query string key is `q`.
- Search combines with `category` and `status` filters.
- Search checks id, kind, subtype, Korean and English title, summary, body, and tags.
- The search form preserves the current category and status filters.
- Resetting search keeps category and status filters active.

## Consequences

Administrators can quickly locate content without leaving the category management page. The search remains server-rendered and URL-addressable, which keeps behavior simple before introducing a richer CMS client interface.
