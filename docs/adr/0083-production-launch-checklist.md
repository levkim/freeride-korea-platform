# ADR 0083: Production Launch Checklist

## Status

Accepted

## Context

The project has hosting setup documentation, GitHub Actions visibility, preflight QA, smoke QA, health checks, and Supabase setup documents. The remaining operational need is a single checklist that guides launch day decisions.

## Decision

Add `docs/deployment/production-launch-checklist-v1.md`.

The checklist covers:

- repository and CI status
- local preflight
- Supabase schema, RLS, and Storage
- hosting settings
- required environment variables
- post-deploy QA
- admin review
- final launch decision

## Consequences

Production launch work can be tracked step by step without searching across README, ADRs, admin pages, and database documents. The checklist does not replace technical QA; it organizes the launch sequence.
