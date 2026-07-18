# ADR 0063: Custom Tour Detail Route

## Status

Accepted

## Context

The Freeride Tour list showed a `Custom Freeride Expedition` item with a `상세 보기` button, but that button linked to `/contact-join`. This made the action label inconsistent with the destination.

## Decision

Add a dedicated `/freeride-tour/custom-freeride-expedition` detail page backed by a `tour` category content seed item.

The list now maps:

- `tour-1` to `/freeride-tour/japan-powder-freeride-tour`
- `tour-2` to `/freeride-tour/custom-freeride-expedition`

The separate `신청 / 문의` button still links to `/contact-join`.

## Consequences

- `상세 보기` always opens a detail page.
- Inquiry actions remain explicit.
- Future CMS-backed tour items can use the same detail route pattern.
