# ADR 0082: Hosting Setup Handoff

## Status

Accepted

## Context

The project now has CI, local preflight QA, health checks, smoke QA, Supabase setup runbooks, and admin deployment readiness pages. The next operational gap is a clear set of hosting platform settings before connecting a real deployment service.

## Decision

Add a hosting handoff baseline.

The handoff includes:

- repository and production branch
- Node.js version
- install, build, and start commands
- health check path
- required environment variables
- preflight and post-deploy QA commands

The same information is linked from README and summarized in `/admin/deployment`.

## Consequences

The team can connect a hosting platform with fewer missing decisions. The handoff remains platform-neutral while still being specific enough for a Next.js App Router deployment.
