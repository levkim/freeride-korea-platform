# ADR 0091: Member Portal Navigation

## Context

The account portal and member status lookup are available at `/account`, but the public navigation did not expose that route. Users who registered through Contact / Join need an obvious path back to status lookup.

## Decision

Add `회원 포털` as a secondary header action.

- Desktop header shows `회원 포털` beside `문의·참여`.
- Mobile menu shows `회원 포털` above `문의·참여` in the call-to-action area.
- The main content navigation remains focused on public site categories.

## Consequences

Members can find their status lookup without crowding the primary category navigation.
