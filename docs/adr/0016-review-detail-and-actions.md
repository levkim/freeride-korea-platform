# ADR 0016: Review Detail and Actions

## Status
Accepted

## Context
The review queue lists category drafts and operational requests, but admins need a focused detail page before approving, requesting edits, rejecting, or publishing content.

## Decision
Add `/admin/review-queue/[id]` as the review detail route.

The page shows:

- Review metadata
- Current status and risk
- Required author and publisher roles
- Review criteria
- Action buttons
- Initial review event history

The action buttons are UI-only for now. Supabase persistence will later write status changes as review events.

## Consequences
- Admin review work has a clear detail surface.
- The review queue can link to a specific item instead of keeping every action in the table.
- Future status transitions can be connected without changing the page structure.
