# ADR 0035: Admin Category Content Filters

## Status

Accepted

## Context

The admin category content list can grow across Athlete Program, Education, Freeride Tour, Culture, Marketplace, Resources, and SHOP. Showing every item in one table is useful, but operators need quick category-level filtering for day-to-day editing.

## Decision

Add URL-based filters to `/admin/site-categories`.

- `all` shows every category content item.
- `athlete-program` shows only Freeride athlete development content.
- `education` shows Avalanche Safety, Freeriding, Backcountry, and WFR content.
- Other filters map to their public operating categories.

The filter state is stored in the `category` query string so refreshes and shared admin links preserve the selected view.

## Consequences

Administrators can quickly inspect and edit content by operating category while keeping a single management page. This also reinforces the separation between Athlete Program and Education in the admin workflow.
