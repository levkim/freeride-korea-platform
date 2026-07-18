# ADR 0009: Mask Sensitive Inquiry Data In Admin Lists

## Status

Accepted

## Context

Inquiry lists can expose personal names, emails, phone numbers, and detailed messages. Even in the admin area, list views should avoid unnecessary exposure of personal data.

## Decision

The Contact / Join admin list masks requester data:

- requester name is partially masked
- email local part is partially masked
- phone number middle digits are masked
- message body is truncated to a short preview

Full inquiry details should later be available only in a protected review detail view or modal.

## Consequences

The admin list remains useful for triage while reducing accidental exposure of personal information.
