# ADR 0086: Supabase Seed Data

Date: 2026-07-20

## Status

Accepted

## Context

The production Supabase project will start with empty tables after the schema and RLS SQL are applied. FREERIDE KOREA already has reviewed mock content for public pages, admin demos, events, news/video, and category content. If that content is not migrated at launch, the connected production site can appear incomplete even though the app is functioning.

## Decision

Add a deterministic seed generator at `scripts/generate-supabase-seed.mjs` and commit the generated SQL at `docs/database/supabase-seed-v1.sql`.

The generated seed SQL inserts starter members, public content entries, and event entries from `content/seed/site-data.ts`. The SQL is intended to be run after:

1. `docs/database/supabase-schema-v1.sql`
2. `docs/database/supabase-rls-hotfix-v1.sql`

and before production QA.

## Consequences

- Supabase setup now has a clear order: schema, RLS, seed data, Storage, environment variables, QA.
- The first production site check can verify real database reads without waiting for manual content entry.
- The seed source remains the typed local data, so the SQL can be regenerated when the starter content changes.
- Future real CMS edits should supersede seed content rather than treating seed rows as permanent official records.
