# ADR 0022: Inquiry Status Actions

## Status
Accepted

## Context
Admin inquiry list and detail pages can read from Supabase or seed data, but inquiry handling still needed a server-side action contract.

## Decision
Add inquiry action validation and persistence boundary.

Inquiry detail pages can now submit:

- next status
- assigned owner text
- admin note

When Supabase is configured, the action updates `inquiry_entries` and inserts an `inquiry_events` record. Without Supabase credentials, the action validates in mock mode and reports that no DB write happened.

## Consequences
- Inquiry handling now mirrors review action handling.
- Admins have a clear place to record inquiry decisions.
- Supabase persistence can be activated by adding environment variables.
