# ADR 0059: Comment Admin Filter Actions

## Context

The first comments foundation added a public comment section and an admin comments page, but moderation buttons were static. Administrators need a workflow shape for filtering by status/target and applying moderation actions before Supabase persistence is connected.

## Decision

Add comment admin filtering and action routing.

- Admin comments can be filtered by status and target type.
- Moderation buttons submit server actions with validated input.
- Available actions are mark visible, hide, delete, pin, and unpin.
- The repository currently returns mock persistence results until Supabase comment tables are implemented.

## Consequences

The comment moderation UI now behaves like the rest of the admin system: validated server action, result redirect, and mock mode. Future Supabase persistence can replace the mock repository function without changing the page-level flow.
