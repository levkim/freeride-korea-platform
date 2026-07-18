# ADR 0036: Admin Category Status Filters

## Status

Accepted

## Context

The admin category content list now supports operating category filters. As content moves through draft, review, needs revision, approved, published, rejected, hidden, and archived states, administrators also need to inspect content by publishing status.

## Decision

Add URL-based status filters to `/admin/site-categories`.

- The category filter remains in the `category` query string.
- The status filter uses the `status` query string.
- Category and status filters can be combined, such as `?category=education&status=review`.
- The default value for both filters is `all`.

## Consequences

Administrators can quickly narrow the content list by both operating category and publishing state. This makes the edit queue easier to scan before a dedicated advanced CMS dashboard is built.
