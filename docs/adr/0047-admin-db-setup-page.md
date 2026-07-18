# ADR 0047: Admin DB Setup Page

## Status

Accepted

## Context

The project is ready to move from mock/seed data into Supabase-backed persistence. The required schema and environment variables exist in documentation, but the operator needs an in-app checklist to understand whether the current running instance is using mock mode or database mode.

## Decision

Add `/admin/data-setup` and link it from the admin sidebar.

The page shows:

- current Supabase admin mode
- required environment variables and missing status
- setup sequence
- schema file path
- planned tables
- persistence areas and current implementation status

## Consequences

The team can continue development without prematurely connecting a database, while keeping the operational handoff to Supabase visible in the admin UI.

This also gives non-developer operators a clear place to check why submissions are or are not being saved to the real database.
