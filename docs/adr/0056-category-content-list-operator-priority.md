# ADR 0056: Category Content List Operator Priority

## Context

The category content admin list already had filters, status actions, and dashboard counts. However, operators still needed to infer which items should be reviewed first. This can slow down day-to-day CMS work once members, executives, and administrators begin submitting more content.

## Decision

Add operator-priority guidance to the category content list.

- Show a short "what to check first" guide based on review, revision, and hidden counts.
- Keep the existing category and status filters, but label each filter group more clearly.
- Rename row action labels from generic view/edit wording to clearer public-view and content-edit wording.

## Consequences

The category content list becomes more task-oriented without changing the underlying review workflow, data model, or status actions.
