# ADR 0089: Account Portal v1

## Context

Membership registration v1 can create general members in Supabase, but full authentication and member self-service are not ready yet. Showing mock member data on `/account` could confuse users before launch.

## Decision

Replace the mock account page with a launch-ready member portal introduction.

- Explain that all signups start as general membership.
- Link users to Contact / Join for membership registration and upgrade requests.
- Show the planned member portal modules without exposing personal data.
- Keep full login, self-service profile management, and application history for a later authenticated v2.

## Consequences

The public `/account` route is no longer a mock-data page. It gives users a clear next action while keeping private member data out of unauthenticated pages.
