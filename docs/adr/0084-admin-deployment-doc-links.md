# ADR 0084: Admin Deployment Document Links

## Status

Accepted

## Context

The project now has production launch and hosting setup documents. The admin deployment page shows runtime state and commands, but operators may still need to know which repository documents are the source of truth for launch execution.

## Decision

Add a deployment document section to `/admin/deployment`.

The section lists:

- production launch checklist
- hosting setup
- Supabase schema
- RLS hotfix

Each item includes the repository path and a short purpose.

## Consequences

Operators can move from the admin status screen to the correct launch documents without searching the repository. The admin page remains a status dashboard, while the markdown files remain the operational source of truth.
