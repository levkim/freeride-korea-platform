# ADR 0107: Member board authoring v1

## Status

Accepted

## Context

Culture, marketplace, resources, and comments already had display and moderation
structures, but members could not yet write directly after login.

The site needs a first real member contribution flow before deeper permissions,
image upload, payment, and notification work.

## Decision

Add member authoring v1 for public boards and comments.

- Logged-in members can create culture, marketplace, and resource posts from
  `/culture/new`.
- Member board posts are published immediately and store `author_id`.
- Authors can edit or hide their own board posts from `/culture/[id]/edit`.
- Logged-in members can write comments on public content.
- Logged-in members can report comments, which moves the comment into the
  reported moderation flow.
- Admin comment moderation remains responsible for hide, delete, pin, and
  restore-style decisions.

## Consequences

- Public boards now have a real member contribution path.
- Author ownership is checked on the server before edits or hide actions.
- Image handling remains URL-based until Supabase Storage upload is completed.
- Server-side role verification beyond login/member ownership remains the next
  major hardening step.
