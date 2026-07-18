# ADR 0028: Tour Operations Fields

## Status

Accepted

## Context

Freeride Tour content needs operational fields beyond a normal category post. A real tour page needs itinerary, guide or tour leader, partner operator, required participant level, included and excluded items, required gear, insurance notes, and cancellation/refund rules.

## Decision

Add optional tour operations fields to the shared category content model:

- tourGuide
- itinerary
- includedItems
- excludedItems
- requiredLevel

Tour content also reuses the existing common operations fields:

- operator
- difficulty
- requiredGear
- insuranceNote
- cancellationPolicy

The admin category draft form displays these fields only when `tour` is selected. Public category detail pages show a `Tour Operations` block only when at least one tour operations field is present.

## Consequences

Freeride Tour pages can now support actual trip recruitment and inquiry workflows. The design keeps tour-specific information in `content_entries.metadata`, matching the Education operations approach and avoiding premature schema fragmentation.
