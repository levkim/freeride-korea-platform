# ADR 0005: Model Events as Scheduled Content

## Status

Accepted

## Context

FREERIDE KOREA needs to publish unofficial Freeride Asia events and official competition information for FIS Freeride World Championships, Freeride World Tour, FWT Challenger, FWT Qualifier, and FWT Junior.

Event status should not require daily manual updates. The requested operation model is:

- Before the start date: upcoming
- During the event window: live
- After the end date: completed
- Cancelled: manually selected by an administrator

## Decision

Events are modeled as scheduled content with start/end datetime fields, timezone, series category, officiality, location/resort, media, summary, description, and link fields.

The public event status is calculated from `startsAt`, `endsAt`, and `cancelled`. The `cancelled` flag is the only manual status override in v1.

FIS Freeride World Championships is treated as an Official Major category with hierarchy equal to or above Freeride World Tour in the admin information architecture.

## Consequences

- Admins do not need to manually switch events from upcoming to live to completed.
- Cancellation remains a deliberate editorial action.
- The data model can later move from seed data to Supabase without changing the frontend contract.
- Official and unofficial events can share one content structure while remaining visibly distinct.
