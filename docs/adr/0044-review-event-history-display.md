# ADR 0044: Review Event History Display

## Status

Accepted

## Context

Review actions are now persisted to `review_events` and synchronized with review queue and content statuses. The review detail page still showed a static two-row history, so administrators could not see real action notes or status transitions.

## Decision

Add review event reading to the review queue repository and render those events on `/admin/review-queue/[id]`.

The event history displays:

- action label
- administrator note
- from/to status badges when available
- actor label
- action date

When Supabase admin credentials are missing or no events exist, the page falls back to a seed-style submitted/queued history.

## Consequences

Administrators can inspect the actual audit trail for each review item after Supabase is connected.

Local development remains useful because fallback history still explains why the item is in the queue.
