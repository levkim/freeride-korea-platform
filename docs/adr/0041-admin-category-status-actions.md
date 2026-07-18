# ADR 0041: Admin Category Status Actions

## Status

Accepted

## Context

Administrators can now list, search, filter, preview, and edit category content from `/admin/site-categories`. They also need a lightweight way to move content between operational states without opening the edit form each time.

## Decision

Add inline status actions to the category content list:

- `게시` sets the content status to `published`
- `검토중` sets the content status to `review`
- `숨김` sets the content status to `hidden`
- `보관` sets the content status to `archived`

The action posts to a server action, validates the requested status, updates `content_entries.status` when Supabase admin credentials are available, and falls back to mock mode during local UI development.

When content is published, `published_at` is refreshed so public listings can sort recently published items correctly.

## Consequences

Administrators can publish or remove category content from public exposure faster while keeping the same review-state vocabulary used elsewhere in the CMS.

Full approval history is still handled by review queue events; this action is intentionally a direct operational shortcut for administrator-controlled category content.
