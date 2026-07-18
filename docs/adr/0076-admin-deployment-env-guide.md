# ADR 0076: Admin Deployment Environment Guide

## Status

Accepted

## Context

ADR 0075 added `qa:deploy-env`, but operators still need an in-app place to see which environment variables are required and where each value comes from.

The project is still allowed to run in mock mode locally, so the guide should inform operators without blocking normal development.

## Decision

Add an environment variable section to `/admin/deployment`.

The section shows:

- variable key
- purpose
- value source
- required or optional status
- current configured state

## Consequences

The deployment page now acts as both a readiness checklist and an operator handoff guide. Before hosting, the operator can open the admin page and see the exact variables that must be configured.
