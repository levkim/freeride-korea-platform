# ADR 0068: Admin Access Sign Out

## Status

Accepted

## Context

ADR 0067 added a temporary admin access key gate before Supabase Auth is connected. Operators can enter the key and receive an httpOnly cookie, but they also need a clear way to end that admin session.

## Decision

Add a server action that deletes the `fk_admin_access` cookie and redirects to `/admin/login?loggedOut=1`.

The admin sidebar shows a `로그아웃` button only when `ADMIN_ACCESS_KEY` is configured.

## Consequences

The temporary access-key protection is operationally complete enough for local or preview use. The final production model should still move to Supabase Auth and role-based administrator accounts.
