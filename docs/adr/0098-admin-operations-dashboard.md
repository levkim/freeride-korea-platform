# ADR 0098: Admin Operations Dashboard

## Context

The admin home page still mixed mock counts and placeholder source alert numbers. After membership, inquiry, review queue, and comment moderation flows were added, operators need the first admin screen to show what should be handled next.

## Decision

Update the admin dashboard to summarize operational workload.

- Read review queue, member, and inquiry counts from their repositories.
- Show actionable cards for review items, member upgrades, open inquiries, and reported comments.
- Link each card directly to the matching admin workflow.
- Add a daily operating order and a storage-mode data summary.

## Consequences

The admin home page becomes a practical operations cockpit instead of a static placeholder. Comments remain mock v1 until authenticated comment persistence is added.
