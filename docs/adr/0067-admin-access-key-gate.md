# ADR 0067: Admin Access Key Gate

## Status

Accepted

## Context

The admin console exists before Supabase Auth and role-based administrator accounts are connected. Public data is protected by RLS planning, but the admin pages themselves should not be left open in a production deployment.

## Decision

Add a temporary environment-variable based admin access gate.

When `ADMIN_ACCESS_KEY` is set:

- `/admin/*` routes require the matching key
- `/admin/login` stays public so operators can enter the key
- a secure, httpOnly cookie grants access for 12 hours

When `ADMIN_ACCESS_KEY` is missing, local development continues in open dev mode.

## Consequences

The site has a simple protection layer before Supabase Auth is implemented. This is not the final permission model. It should later be replaced by Supabase Auth, admin user records, and role-based checks.
