# ADR 0088: Membership Registration QA

## Context

Membership registration now writes to Supabase before public launch. This is more important than a purely visual smoke test because a broken members, inquiries, or review queue relation would make the launch workflow unreliable.

## Decision

Add `npm run qa:membership`.

The check creates a synthetic general member, a membership inquiry, and a member-upgrade review queue item, then deletes all test rows in reverse dependency order.

## Consequences

Operators can verify the live Supabase schema and service-role write path before deployment or after environment changes. The script does not test browser rendering, but it checks the database contract that powers membership v1.
