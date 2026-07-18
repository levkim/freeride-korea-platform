# ADR 0026: Education Author Role

## Status

Accepted

## Context

Education content includes avalanche safety, FREERIDING skills, backcountry development, and WFR-related response. These programs can involve safety standards, instructor qualification, external education centers, insurance, equipment requirements, and cancellation policies.

## Decision

Education content may only be authored by executive members or above.

Freeride athlete program content remains authorable by regular members or above. The shared `program` content kind is therefore handled with subtype-specific author rules:

- `Freeride`: regular member or above
- `Avalanche Safety`, `Freeriding`, `Backcountry`, `WFR`: executive member or above

All publication remains admin-approved.

## Consequences

Review queue entries for education drafts now require `executive` as the minimum author role. Public and admin copy also distinguishes regular-member program/tour proposal rights from executive-level education authoring rights.
