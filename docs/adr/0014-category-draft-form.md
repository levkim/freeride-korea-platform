# ADR 0014: Category Draft Form

## Status
Accepted

## Context
The public category pages and admin category operations page define the site structure, but admins still need a shared input flow before category-specific CMS tables are connected.

## Decision
Create a shared draft form at `/admin/site-categories/new`.

The form supports:

- Program and safety education
- Freeride tour
- Culture
- Marketplace
- Resources
- SHOP

Program and safety education share the `program` content kind and are separated by subtype. The form validates bilingual title, summary, and body fields before any persistence is connected.

## Consequences
- The team can review category content requirements before building persistence.
- Future Supabase insert actions can reuse the validation schema.
- Category-specific forms can still split later if the shared form becomes too broad.
