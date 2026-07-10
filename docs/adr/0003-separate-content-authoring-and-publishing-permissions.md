# ADR-0003: Separate Content Authoring and Publishing Permissions

Date: 2026-07-10
Status: Accepted
Phase: Phase 2

## Context

FREERIDE KOREA should allow members to contribute content, tours, education programs, event information, and community material. At the same time, the public website needs official quality control because it includes safety-sensitive and reputation-sensitive content.

## Decision

We will separate content authoring permission from content publishing permission.

Members may create drafts according to their member type, but public publishing requires admin approval unless a later ADR explicitly changes this.

Initial rules:

- Freeride Tour drafts: Regular Member or higher.
- Education Program drafts: Regular Member or higher.
- News drafts: Executive Member or admin.
- Video drafts: Executive Member or admin.
- Event drafts: Executive Member or admin.
- Culture submissions: member/community submission with admin review.
- Marketplace listings: member submission with admin review.

## Options Considered

- Admin-only creation: safest, but limits community participation.
- Open creation for all members: active, but too risky for official content.
- Separate authoring and publishing permissions: allows contribution while preserving official control.

## Consequences

Positive:

- Members can help build the platform.
- Admins keep final control over public publishing.
- Different content types can have different contribution thresholds.
- Future permission rules can be adjusted without redesigning the CMS.

Trade-offs:

- The system needs configurable permission rules.
- Review Queue becomes more important.
- Admins need clear visibility into who submitted each draft.

## Follow-up

- Add Executive Member to member types.
- Add content permission rules to the backend data model.
- Add authoring and publishing permission controls to admin screens.
- Make all member-submitted content enter Review Queue before publishing.
