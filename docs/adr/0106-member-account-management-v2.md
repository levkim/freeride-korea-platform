# ADR 0106: Member account management v2

## Status

Accepted

## Context

Members need to manage their own account information after login. The requested
scope includes nickname, name, email, password, contact/profile information,
withdrawal requests, and personal activity lists.

The production `members` table currently stores only email, display name,
member type, status, and timestamps. Adding profile columns would require a
database migration before deployment.

## Decision

Implement account management v2 without requiring a database schema change.

- Store contact/profile fields in Supabase Auth `user_metadata`.
- Keep the public nickname synchronized to `members.name`.
- Store `memberId` in Auth metadata so an email change can reconnect to the
  existing member row after confirmation.
- Treat withdrawal as an admin-reviewed membership inquiry instead of immediate
  deletion.
- Show member activity from existing inquiry, content, and comment tables.

## Consequences

- Members can update profile information from `/account`.
- Email changes follow Supabase's email confirmation behavior.
- Password changes are handled through Supabase Auth.
- Withdrawal requests remain reviewable by operators before any destructive
  account action.
- A later database migration can move profile fields from Auth metadata to a
  dedicated profile table if richer member records are needed.
