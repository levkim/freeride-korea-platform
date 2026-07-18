# ADR 0073: Runtime Health Check

## Status

Accepted

## Context

The project now has release QA, sitemap/robots checks, GitHub Actions CI, and an admin deployment readiness page. After hosting, operators and monitoring tools need a simple endpoint that confirms the app is responding.

## Decision

Add `/healthz`.

The endpoint returns JSON with:

- `ok`
- service name
- site URL
- current data mode
- Supabase configured flag
- timestamp

Add `npm run qa:runtime` and include it in `npm run qa:release`.

## Consequences

Hosting and preview environments can be smoke-tested with a lightweight endpoint. The endpoint does not expose secrets and only reports high-level runtime status.
