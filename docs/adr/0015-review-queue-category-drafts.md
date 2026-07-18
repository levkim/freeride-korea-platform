# ADR 0015: Review Queue for Category Drafts

## Status
Accepted

## Context
Category content can now be drafted in the admin UI, but the workflow needs to make it clear that drafts are not published directly. FREERIDE KOREA requires member contribution and admin publishing to remain separate.

## Decision
Represent program, tour, culture, marketplace, resource, and shop drafts as review queue items.

The review queue should show:

- Review kind
- Submitter
- Current status
- Risk level
- Required author role
- Required publisher role
- Created date
- Review actions

## Consequences
- Category drafts follow the same review path as news, video, events, member upgrades, and source alerts.
- Admins have a single operational surface for approval work.
- Future Supabase persistence can store the review event history without changing the UI model.
