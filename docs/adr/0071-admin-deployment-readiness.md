# ADR 0071: Admin Deployment Readiness Page

## Status

Accepted

## Context

The project now has GitHub commits, SEO metadata, sitemap/robots, release QA commands, Supabase setup documents, RLS SQL, and a temporary admin access gate. Before actual hosting, the operator needs a single place to see what remains incomplete.

## Decision

Add `/admin/deployment` and link it from the admin sidebar.

The page checks and explains:

- GitHub main branch workflow
- production site URL
- admin access key
- Supabase environment state
- Supabase RLS follow-up
- Storage bucket follow-up
- release QA commands

The page is dynamic because it reads environment variables.

## Consequences

Deployment preparation becomes easier to audit without reading several documents. The page is not a substitute for real CI/CD, but it gives operators a clear preflight checklist before hosting.
