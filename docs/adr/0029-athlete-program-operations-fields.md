# ADR 0029: Athlete Program Operations Fields

## Status

Accepted

## Context

Athlete Program content is different from Education and Tour content. It needs to manage a rider development pathway rather than a single course or trip. The key operating data is athlete level, target events, season goal, coaching format, video review, and selection criteria.

## Decision

Add optional athlete program operations fields to the shared category content model:

- athleteLevel
- targetEvents
- seasonGoal
- coachingFormat
- videoReview
- selectionCriteria

The admin category draft form displays these fields only when `program` with subtype `Freeride` is selected. Public category detail pages show an `Athlete Program Operations` block only when at least one athlete program field is present.

## Consequences

The Athlete Program page can now support structured rider development workflows while keeping Education and Tour operations separate. The data continues to live in `content_entries.metadata`, keeping the CMS flexible until the operating model needs dedicated relational tables.
