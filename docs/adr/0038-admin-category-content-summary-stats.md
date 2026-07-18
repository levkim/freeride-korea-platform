# ADR 0038: Admin Category Content Summary Stats

## Status

Accepted

## Context

The admin category content list now supports category filters, status filters, and keyword search. Operators still need a quick sense of workload before scanning the table.

## Decision

Add summary statistic cards above the category content table.

The cards show:

- Total content count
- Current filtered result count
- Review count
- Published count
- Needs revision count

Counts are derived from the admin category content list already loaded for the page.

## Consequences

Administrators can immediately see how many items exist, how many match the current filter/search, and how many need review or revision. This improves the page as a practical daily CMS work surface without adding a separate dashboard yet.
