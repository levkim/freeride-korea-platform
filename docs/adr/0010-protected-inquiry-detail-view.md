# ADR 0010: Protected Inquiry Detail View

## Status

Accepted

## Context

The Contact / Join admin list masks personal information, but operators still need a place to review full inquiry details when handling a request.

## Decision

Each inquiry has a detail route under `/admin/contact-join/[id]`. The list shows masked requester data and a short message preview. The detail page shows full requester information and the original message.

When database/authentication is added, this route should require admin permission and record access logs.

## Consequences

The admin can triage safely from the list and only reveal sensitive data when intentionally opening a review detail.
