# ADR 0101: Admin access cookie stores a hash token

## Status

Accepted

## Context

The production admin area is currently protected by a temporary `ADMIN_ACCESS_KEY`
until a full Supabase Auth role system is introduced. The previous gate compared
the cookie value directly with the configured access key, which meant the raw
admin key was stored in the browser cookie after login.

## Decision

Store only a SHA-256 token derived from `ADMIN_ACCESS_KEY` in the admin cookie.
The access key itself remains only in server-side environment variables.

The proxy now verifies the cookie by hashing the configured key and comparing it
with the stored token. The login action sets the same derived token after a
successful access-key check.

## Consequences

- The raw temporary admin key is no longer written to the browser cookie.
- Rotating `ADMIN_ACCESS_KEY` invalidates existing admin sessions after the next
  deployment.
- This remains a temporary gate. Supabase Auth with role-based access should
  replace it when the admin/member authentication phase begins.
