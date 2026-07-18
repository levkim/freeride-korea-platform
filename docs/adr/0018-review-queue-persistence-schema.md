# ADR 0018: Review Queue Persistence Schema

## Status
Accepted

## Context
The admin review queue handles more than content entries. It includes member upgrade requests, official source alerts, AI drafts, category drafts, marketplace listings, shop items, and potentially inquiry follow-up tasks. The previous `review_events` table was tied directly to `content_entries`, which was too narrow.

## Decision
Add `review_queue_items` as the primary review subject table.

Review items can reference:

- content entries
- members
- inquiries
- source alerts
- AI drafts

Add `review_events` as an append-only event log attached to `review_queue_items`. Review actions include submit, approve, request revision, reject, publish, hide, archive, assign, and comment.

## Consequences
- Admin review history is no longer limited to content.
- Approval, revision, rejection, and publishing actions can share one event model.
- Future Supabase server actions can insert review events without changing the admin UI.
