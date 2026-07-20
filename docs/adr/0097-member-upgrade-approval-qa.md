# ADR 0097: Member Upgrade Approval QA

## Context

Member upgrade approval now updates three operational records: the review queue item, the linked member, and the linked inquiry. This workflow needs a repeatable check because it touches live Supabase table relationships.

## Decision

Add `qa:member-upgrade-approval`.

- Create a temporary member, membership inquiry, and member-upgrade review item.
- Simulate approval by updating the review item, member grade/status, inquiry status, and review event.
- Verify the member becomes the requested grade, the member is active, the inquiry is closed, and the review item is approved.
- Delete all temporary records after the check.

## Consequences

Launch operators can verify the member upgrade approval data path without leaving test rows behind.
