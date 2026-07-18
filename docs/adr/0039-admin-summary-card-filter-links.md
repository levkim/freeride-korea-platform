# ADR 0039: Admin Summary Card Filter Links

## Status

Accepted

## Context

Admin category summary cards show total, current result, review, published, and needs revision counts. Seeing the count is useful, but administrators should be able to jump directly to the corresponding filtered list.

## Decision

Make admin category summary cards clickable.

- `전체 콘텐츠` resets category, status, and search filters.
- `현재 조건` keeps the active category, status, and search filters.
- Status cards keep the active category and search query while switching the status filter.

## Consequences

The summary cards become navigation shortcuts for daily CMS work. Administrators can move from workload overview to filtered action lists without manually adjusting filter buttons.
