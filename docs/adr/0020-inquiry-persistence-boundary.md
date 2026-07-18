# ADR 0020: Inquiry Persistence Boundary

## Status
Accepted

## Context
The public Contact / Join form validates submissions, but local development may run before Supabase credentials are configured. The form should still work without crashing and should be ready for real persistence.

## Decision
Add an inquiry repository that writes to `inquiry_entries` when Supabase admin environment variables are present.

The repository has two modes:

- `mock`: validate the form and show a received message without database persistence.
- `supabase`: insert the inquiry into `inquiry_entries`.

The public page reports mock mode so admins understand that local submissions are not persisted.

## Consequences
- Contact / Join is ready for Supabase persistence.
- Local development remains stable without credentials.
- Public inquiry collection uses the same server-only Supabase boundary as review actions.
