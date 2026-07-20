# ADR 0087: Membership Registration v1

## Context

Before public launch, FREERIDE KOREA needs a basic membership path. The site already had a Contact / Join form, but a membership submission only created an inquiry. That meant administrators could review a request, but the member list did not automatically reflect new general members.

## Decision

Membership inquiries now create or reuse a `members` row by email.

- A `membership` inquiry immediately registers the person as an active `general` member.
- Existing members are not downgraded or overwritten when they submit another membership inquiry.
- If the person requests a level above general membership, the inquiry also creates a `member-upgrade` review queue item.
- The admin members page reads from Supabase when configured and falls back to seed data in mock mode.

## Consequences

The public site can accept real general member registrations before login/authentication is introduced. Grade changes remain administrator-controlled, which keeps regular, executive, athlete, and sponsorship member transitions reviewable.

Full account authentication, password login, and member self-service profile management remain future work.
