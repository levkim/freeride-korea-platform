# ADR 0065: Supabase RLS Hotfix

## Status

Accepted

## Context

Supabase Advisor can raise a critical warning when public schema tables have Row Level Security disabled. If public tables remain without RLS, anon or authenticated clients may be able to read, change, or delete data depending on grants and client access patterns.

The FREERIDE KOREA app is designed to use server-side repositories and validated server actions for writes. The service role key is server-only and must never be exposed to the browser.

## Decision

Add `docs/database/supabase-rls-hotfix-v1.sql` as the immediate SQL patch for Supabase.

The hotfix:

- enables RLS on all current public tables
- allows public reads only for published public content
- allows public reads for event rows and content links only when their parent content is published
- allows public reads for visible comments only on published targets
- creates no direct public write policies

Admin and write workflows continue through server-side actions using the Supabase service role boundary.

## Consequences

Supabase Advisor critical RLS warnings can be resolved without opening broad table access.

If future client-side Supabase reads are added, they must be covered by explicit policies. Member profile, inquiry, review queue, and moderation data remain private by default.
