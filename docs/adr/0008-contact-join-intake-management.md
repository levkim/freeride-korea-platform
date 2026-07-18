# ADR 0008: Contact Join Intake Management

## Status

Accepted

## Context

FREERIDE KOREA receives multiple types of inbound requests: athlete program, education, freeride tour, membership, business partnership, sponsorship, media, and general questions. These should not be mixed into one unmanaged email-like list.

## Decision

The admin area includes a Contact / Join inbox with inquiry type, requester, contact information, status, assigned operator, and created date. The initial statuses are:

- `new`
- `reviewing`
- `needs_reply`
- `closed`

Membership upgrade requests can later connect to the Members page and Review Queue.

## Consequences

The public contact form can evolve into a structured intake flow. Supabase can store the same inquiry type and status values defined in the app types.
