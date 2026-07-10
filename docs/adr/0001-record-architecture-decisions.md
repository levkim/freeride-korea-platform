# ADR-0001: Record Architecture Decisions

Date: 2026-07-10
Status: Accepted
Phase: Phase 0

## Context

FREERIDE KOREA is growing from a brand direction project into a website, admin CMS, AI-assisted operations system, event/news monitoring system, membership platform, course/tour application system, and marketplace.

The project will involve many decisions over time. If those decisions are not recorded, it will become difficult to understand why the system was designed in a certain way.

## Decision

We will use ADRs to record important architecture and product decisions during development.

ADRs will be stored in:

```text
website/adr/
```

The project will also maintain an ADR phase checklist in:

```text
website/adr-process-v1.md
```

## Options Considered

- No ADRs: faster at first, but decisions become hard to trace.
- Long planning documents only: useful for strategy, but too broad for technical decisions.
- Lightweight ADRs: short, searchable, and easy to maintain.

## Consequences

Positive:

- Important decisions are easy to revisit.
- Future developers can understand the reasoning.
- Changes in direction can be tracked without rewriting history.
- Safety and AI automation boundaries stay clear.

Trade-offs:

- Developers must remember to write ADRs at decision points.
- Too many small ADRs can become noise, so only important decisions should be recorded.

## Follow-up

- Review ADR checklist at the end of each development phase.
- Add new ADRs when selecting technology stack, CMS, database, AI automation, and deployment approach.
