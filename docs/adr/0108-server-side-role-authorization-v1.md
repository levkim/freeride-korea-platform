# ADR 0108: Server-Side Role Authorization v1

## Status

Accepted

## Context

FREERIDE KOREA now supports real member login, member-created posts, comments, and admin moderation flows. Until this point, admin pages were protected mainly by the administrator access key, and some member-facing write paths relied on page-level UI flow.

That is not enough for production operation. A user can bypass visible buttons and submit server actions directly, so content writing, member management, moderation, and workflow policy changes must be checked again on the server.

## Decision

Introduce a shared server authorization helper in `lib/authz/server.ts`.

The first version uses these rules:

- Admin mutation actions require a valid admin access cookie.
- CMS workflow policy changes can be made by an administrator or an executive member.
- Member board writing requires a signed-in member account.
- Culture and marketplace posts can be created by general members.
- Resource posts require regular member level or above.
- Tour and shop proposals require regular member level or above.
- Education content requires executive level or admin publishing flow.
- News, video, and event drafts require executive level or admin publishing flow.
- Comments and comment reports require a signed-in member.
- Editing and hiding member posts still require ownership.

## Consequences

Server actions now enforce the same operational policy that the admin UI describes. This reduces the risk of unauthorized writes if a route or form is accessed directly.

The admin area still uses the administrator access key as the primary production control. A later version should connect admin capabilities to real authenticated member accounts, add Supabase RLS coverage for each role, and record every privileged mutation in an admin action log.

