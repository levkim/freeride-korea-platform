# ADR 0040: Admin Public Preview Links

## Status

Accepted

## Context

Administrators can edit category content from `/admin/site-categories`, but they also need to inspect how a content item appears on the public site before or after editing.

## Decision

Add a `보기` action to each admin category content row.

The public route is derived from the content kind and subtype:

- Freeride athlete content links to `/athlete-program/[id]`
- Education content links to `/safety-education/[id]`
- Tour content links to `/freeride-tour/[id]`
- Culture and marketplace content link to `/culture/[id]`
- Shop content links to `/shop/[id]`

## Consequences

Administrators can move directly from the CMS list to the public presentation for a content item. This supports faster QA and reduces the chance of editing without checking the user-facing page.
