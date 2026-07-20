# ADR 0103: Member authentication v1

## Status

Accepted

## Context

The site could create member records through the public contact/join flow, but
members could not log in with their own account. Member-grade authoring,
comments, marketplace posts, resources, and personal application history all
need an authenticated member identity before they can be safely opened.

## Decision

Add Supabase Auth based member login v1 on `/account`.

The v1 flow:

- supports email/password signup and sign-in
- creates or reuses a `members` table row as `general` during signup
- reads the Supabase Auth session from server cookies
- connects the authenticated user to the `members` row by normalized email
- shows the member grade and account status on `/account`
- keeps the existing unauthenticated status lookup as a fallback support flow

The app requires `NEXT_PUBLIC_SUPABASE_ANON_KEY` in addition to the existing
Supabase URL and service role key. If the anon key is not configured, `/account`
shows an operator-facing setup warning instead of exposing a broken login form.

## Consequences

- Public member login can be enabled once the anon public key is added to Sites.
- All new signups still start as `general` members.
- Grade upgrades remain controlled by administrator review.
- Future member-authenticated writing features can use the same session/member
  lookup boundary.
