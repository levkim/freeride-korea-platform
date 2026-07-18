# ADR 0079: CI Smoke QA

## Status

Accepted

## Context

ADR 0078 added `npm run qa:smoke` for local and post-deploy route checks. The GitHub Actions workflow already builds the app, starts it locally, and runs release QA. However, the smoke test should also run automatically on push and pull request validation so broken critical routes are caught before deployment.

## Decision

Add `npm run qa:smoke` as a separate GitHub Actions step after `npm run qa:release`.

## Consequences

CI now checks both the broader release QA suite and the focused critical-route smoke test. This adds a small amount of CI time, but improves confidence that public entry points, admin readiness pages, health endpoints, robots, and sitemap respond correctly.
