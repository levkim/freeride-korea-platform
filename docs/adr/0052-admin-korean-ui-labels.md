# ADR 0052: Admin Korean UI Labels

## Context

FREERIDE KOREA is related to international freeride competitions, but the primary website operators and members are Korean users. The public website was already moved toward Korean-first content, while several admin screens still exposed English labels such as workflow table headings, draft badges, category names, and action section labels.

At the same time, some English strings are internal keys used by seeded content, routing, permissions, and review logic. Changing those stored values directly can break existing detail pages or author-role checks.

## Decision

Use Korean labels for visible admin UI copy while keeping existing internal identifiers and subtype values compatible.

- Admin workflow table headers use Korean operational terms.
- News/video draft badges use Korean labels.
- Category operations display Korean category labels.
- Review and inquiry action section labels use Korean.
- Category draft subtype options display Korean labels, but keep internal values such as `Avalanche Safety`, `Freeriding`, `Backcountry`, `Official Link`, and `Membership` for compatibility.

## Consequences

Admin screens are easier for Korean operators to read without forcing an immediate data migration. Future Supabase schema and CMS work can still decide whether to introduce dedicated localized display labels or migrate stored subtype keys.
