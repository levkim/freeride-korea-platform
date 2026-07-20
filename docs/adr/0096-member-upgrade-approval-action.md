# ADR 0096: Member Upgrade Approval Action

## Context

Member upgrade requests enter the admin review queue, but approving the review item and changing the member grade were separate operations. That made the workflow easy to miss during launch operations.

## Decision

When an admin approves a `member-upgrade` review item, the review action also updates the linked member.

- Read the linked inquiry's requested member type.
- Map Korean request labels to member types.
- Update the member to the requested type and set the member status to active.
- Close the linked inquiry after a successful upgrade.
- Show a confirmation message on the review detail page.

## Consequences

Membership upgrade approval becomes a single operational step. If the requested label cannot be mapped safely, the review action still saves and the admin is told to update the member manually.
