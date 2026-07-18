# ADR 0019: Supabase Admin Persistence Boundary

## Status
Accepted

## Context
Review actions now have server action validation, but the project may run locally before Supabase credentials are configured. The app should not crash just because the database is not connected yet.

## Decision
Add a server-only Supabase admin client boundary.

The review action repository behaves in two modes:

- `mock`: Supabase admin environment variables are missing, so the action is validated but not persisted.
- `supabase`: `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present, so the review action is inserted into `review_events`.

The UI reports mock mode after a successful action so the admin understands that persistence is not active yet.

## Consequences
- Local development can continue without database credentials.
- Supabase persistence can be enabled by adding environment variables rather than redesigning actions.
- Service role access stays behind server actions and is not exposed to the browser.
