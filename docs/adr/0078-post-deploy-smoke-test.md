# ADR 0078: Post Deploy Smoke Test

## Status

Accepted

## Context

The project has release QA, runtime health checks, deployment environment QA, and admin runbooks. After a real hosting deployment, operators still need a quick command that checks whether the important public and admin routes respond.

Internal link QA is useful, but a post-deploy smoke test should be smaller, faster, and focused on critical entry points.

## Decision

Add `npm run qa:smoke`.

The script checks:

- public top-level pages
- admin entry and readiness pages
- `/health` and `/healthz`
- `robots.txt`
- `sitemap.xml`

It uses `QA_BASE_URL` when provided, so the same command can test local development or the real deployed domain.

## Consequences

After deployment, the operator can run one short smoke test before sharing the site. This does not replace full QA or manual review, but it catches broken routes, server errors, and missing static files quickly.
