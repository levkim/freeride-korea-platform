# ADR 0095: Member Upgrade Review Context

## Context

Membership upgrade requests are created from the public inquiry form and enter the admin review queue. Administrators need to see the applicant, current member level, requested level, riding experience, and original inquiry before approving or rejecting the request.

## Decision

Show member upgrade context on review detail pages for `member-upgrade` items.

- Read the linked `member_id` and `inquiry_id` from `review_queue_items`.
- Display applicant, current grade, requested grade, contact, riding experience, and inquiry message.
- Provide direct links to the inquiry detail page and member management page.

## Consequences

Administrators can make membership decisions from one review screen while still using the member management page as the place where grade changes are saved.
