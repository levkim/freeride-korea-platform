# ADR 0057: Direct Publish Community And Resource Content

## Context

FREERIDE KOREA category content uses a review workflow for programs, education, tours, and shop-related content because those items can involve safety, payment, schedules, or official operation. The user decided that Culture, Marketplace, and Resources should be lighter-weight content areas and should not require admin review before publication.

## Decision

Culture, Marketplace, and Resources are direct-publish category kinds.

- `culture`, `marketplace`, and `resource` content is saved with `published` status immediately.
- These direct-publish kinds do not create `review_queue_items`.
- Direct-publish content receives `published_at` at save time.
- Program, education, tour, and shop content continue to use review status and review queue creation.
- Admin forms show direct-publish guidance when those categories are selected.

## Consequences

Community and resource content can be posted faster. Administrators still retain after-the-fact controls through the category content list, including hidden, archived, review, and published status actions.
