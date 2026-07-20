# ADR 0092: Admin Member Grade Actions

## Context

Membership registration v1 creates general members and upgrade review queue items, but administrators still needed a direct way to change member type and account status from the member list.

## Decision

Add admin member update actions on `/admin/members`.

- Administrators can update `member_type` and `status` per member row.
- Writes use a server action and the Supabase service-role repository path.
- Mock mode keeps the UI usable but does not persist updates.

## Consequences

The membership workflow is operationally closed for launch: public signup creates a general member, administrators review upgrade requests, and the member list can store the final grade.

`npm run qa:member-update` verifies the Supabase update path with temporary test data.
