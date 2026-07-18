# ADR 0042: Review Actions Sync Content Status

## Status

Accepted

## Context

The review detail page records administrator actions such as approval, revision requests, rejection, and publishing. Previously the persistence boundary inserted a `review_events` row, but did not update the review queue item or the linked content entry.

That meant the audit trail could say an item was published while the actual content remained in its previous status.

## Decision

When a review action is submitted in Supabase mode:

- read the current `review_queue_items.status` and linked `content_id`
- update `review_queue_items.status` to the mapped next status
- update the linked `content_entries.status` when the review item has a content reference
- refresh `content_entries.published_at` when the next status is `published`
- insert a `review_events` row with both `from_status` and `to_status`

Review items without linked content, such as member upgrade or source alert tasks, only update the review queue status and review event log.

## Consequences

Administrator review actions now change the operational state of the CMS, not just the audit trail.

The updates are still handled through the server-only Supabase admin boundary, so local development can continue in mock mode until credentials are configured.
