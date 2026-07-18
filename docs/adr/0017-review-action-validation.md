# ADR 0017: Review Action Validation

## Status
Accepted

## Context
The review detail page had action buttons for approve, request revision, reject, and publish, but they were UI-only. Before Supabase persistence is connected, the app should still define the action contract.

## Decision
Add a server action for review decisions and validate:

- review item id
- action type
- admin note

Action types map to future publish statuses:

- approve -> approved
- request_revision -> needs_revision
- reject -> rejected
- publish -> published

The current implementation redirects back to the detail page with a result message. Supabase persistence will later store the same payload as a review event.

## Consequences
- Review decisions now have a stable form contract.
- Admin comments become required before status changes.
- Future persistence can be connected without redesigning the UI.
