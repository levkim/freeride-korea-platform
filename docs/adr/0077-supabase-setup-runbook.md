# ADR 0077: Supabase Setup Runbook

## Status

Accepted

## Context

The admin data setup page already shows Supabase environment state, schema objects, RLS policy summary, storage setup, and live diagnostics. However, the actual operator sequence was still split across multiple sections and documents.

Before a real Supabase project is created, the team needs a simple runbook that says what to apply first and what to check next.

## Decision

Add a `Setup Runbook` section to `/admin/data-setup`.

The runbook lists:

- base schema SQL
- RLS hotfix SQL
- Storage bucket setup
- deployment environment QA
- live DB check page

## Consequences

The Supabase handoff is easier to follow. The project can still remain in mock mode locally, but once Supabase is created the operator has a clear setup order inside the admin UI.
