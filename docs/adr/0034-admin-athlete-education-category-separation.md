# ADR 0034: Admin Athlete and Education Category Separation

## Status

Accepted

## Context

Athlete Program and Education currently share the internal `program` content kind, because both use the same review and category content storage model. However, they are different public menu categories with different operating purposes and author rules.

Keeping them visually grouped as `Program / Education` in the admin form makes the operator think athlete development and education courses are one category.

## Decision

Separate Athlete Program and Education in the admin UI while keeping the internal storage kind unchanged for now.

- The category draft/edit form shows `선수 프로그램` and `Education / 교육` as separate selectable cards.
- `선수 프로그램` only exposes the `Freeride` subtype.
- `Education / 교육` exposes `Avalanche Safety`, `Freeriding`, `Backcountry`, and `WFR`.
- Admin category content lists and edit headers display the operational category label instead of the raw internal `program` kind.

## Consequences

Administrators can operate Athlete Program and Education as separate menu categories immediately. The database model can still stay compact until a future migration decides whether `education` should become a dedicated content kind.
