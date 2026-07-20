# ADR 0093: Admin Member Action Feedback

## Context

The admin member list can update member grades and account status, but the post-submit redirect only changed the URL query string. Operators need visible confirmation after saving.

## Decision

Show result banners on `/admin/members`.

- `result=updated` shows a success message.
- `result=invalid` shows a validation error.
- `mode=mock` explains that the update was not persisted.

## Consequences

Member grade updates are easier to operate and less ambiguous during launch administration.
