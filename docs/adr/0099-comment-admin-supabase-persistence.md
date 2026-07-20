# ADR 0099: Comment Admin Supabase Persistence

## Context

The comments schema already defines `comments` and `comment_events`, but the admin comment page still used mock-only data. That meant comment moderation buttons did not affect operational records.

## Decision

Connect admin comment moderation to Supabase.

- Read admin comments from `comments` when Supabase admin env vars are configured.
- Resolve author labels from `members`.
- Resolve target titles from `content_entries`.
- Persist moderation actions to `comments`.
- Record moderation history in `comment_events`.
- Explain the empty Supabase comment state in the admin UI.
- Keep public comment display on the existing seed fallback until member authentication and public comment creation are added.

## Consequences

Administrators can moderate persisted comment rows, while the public comment authoring flow remains intentionally gated behind the later authentication step.

`qa:comment-moderation` verifies the Supabase comment moderation path with temporary rows and cleans them up after the check.
