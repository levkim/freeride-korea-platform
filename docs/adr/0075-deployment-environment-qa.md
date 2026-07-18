# ADR 0075: Deployment Environment QA

## Status

Accepted

## Context

The project now has release QA, CI, `/healthz`, and a browser-readable `/health` page. The next deployment risk is not code correctness, but missing production environment configuration: real domain, temporary admin access key, Supabase project credentials, and content image storage bucket.

These checks should not block local development because the project intentionally runs in mock mode before Supabase is created.

## Decision

Add `npm run qa:deploy-env`.

The script checks:

- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_ACCESS_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_CONTENT_BUCKET`

`qa:deploy-env` is separate from `qa:release`.

## Consequences

Local release QA can continue passing in mock mode, while production deployment has a dedicated command that fails when required hosting and Supabase variables are not ready.

The admin deployment readiness page and README can point operators to this command before a real hosting launch.
