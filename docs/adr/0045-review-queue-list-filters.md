# ADR 0045: Review Queue List Filters

## Status

Accepted

## Context

The admin review queue can contain content drafts, member upgrades, source alerts, AI drafts, inquiries, marketplace items, and shop items. As the queue grows, administrators need to narrow the list by type, status, risk, and keyword.

The previous list also showed quick action buttons that did not submit review actions, which could confuse administrators.

## Decision

Add URL-based filters to `/admin/review-queue`:

- review type
- review status
- risk
- keyword search

Add summary cards for total, current result count, review-needed count, and high-risk count.

Remove non-functional inline action buttons from the table and keep row actions focused on opening the review detail page, where action notes and validated review actions are handled.

## Consequences

Administrators can triage the review queue faster without losing the audit-safe detail action flow.

The filter state is shareable through the URL and survives refreshes.
