# ADR 0050: Korean-First Admin Content

## Status

Accepted

## Context

FREERIDE KOREA is connected to international freeride competitions, but the primary website users and administrators are Korean. Requiring English fields for every admin draft makes the CMS slower and more complex than needed.

## Decision

Make admin content entry Korean-first.

- Korean title, summary, and body fields remain required.
- English fields are removed from admin draft forms.
- Existing database and TypeScript structures can keep Korean/English fields for future expansion.
- Server-side form parsers copy Korean values into English fields when no English input is provided.
- Public pages can continue to use existing localized data contracts without forcing administrators to write English.

This applies first to:

- category content drafts
- News & Video drafts
- Event drafts

## Consequences

Administrators can publish and review content faster with a simpler form.

The system still remains compatible with future English pages or translation workflows because the data shape is preserved internally.
