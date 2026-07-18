# ADR 0027: Education Operations Fields

## Status

Accepted

## Context

Education content needs more operational detail than a normal category post. Avalanche safety, FREERIDING skills, backcountry development, and WFR-related courses require instructor information, external operator details, required gear, difficulty, insurance notes, and cancellation/refund rules.

## Decision

Add optional education operations fields to the shared category content model:

- instructor
- operator
- difficulty
- requiredGear
- insuranceNote
- cancellationPolicy

The admin category draft form displays these fields only when the selected subtype is an Education subtype. Public category detail pages show an `Education Operations` block only when at least one of these fields is present.

Supabase category content stores these fields in `content_entries.metadata`, a JSONB field, so future category-specific data can be expanded without creating a new table for every category too early.

## Consequences

Education pages can now communicate operational readiness and safety expectations more clearly. The shared category detail page stays reusable, while Education gets the extra details it needs.
