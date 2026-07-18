# ADR 0054: Event Draft Form Section Guidance

## Context

The event draft form already supported the required fields for FREERIDE KOREA events: event identity, series, officiality, schedule, automatic status, links, image, summary, and description. However, all fields were shown as a continuous form, which made it harder for Korean operators to understand the purpose of each group while entering official competition information.

## Decision

Add Korean section guidance to the event draft form.

- Basic event identity fields are grouped under a clear heading.
- Schedule fields explain that status is calculated automatically and only cancellation is manual.
- Link and image fields explain the difference between official, registration, replay/result, and related links.
- Public copy fields explain where summary and detailed description are displayed.

## Consequences

Event entry is easier to review before publication, and future Supabase-backed persistence can keep the same field structure without changing the data model.
