# ADR 0058: Member Comments v1 Foundation

## Context

FREERIDE KOREA needs member comments on posts and boards, but authentication and Supabase-backed member sessions are not fully connected yet. Adding an unrestricted comment form before identity, moderation, and reporting rules are ready would create operational risk.

## Decision

Implement a comments v1 foundation before enabling live writes.

- Define comment target types for news/video, events, and category content.
- Add a public comment section to detail pages.
- Show a disabled/member-login guidance state for comment writing.
- Add an admin comments page for moderation planning.
- Support visible, reported, hidden, and deleted comment statuses in the model.
- Keep mock comments in a repository until Supabase persistence and authentication are connected.

## Consequences

The site now has a clear place for member comments and admin moderation without allowing anonymous or unmanaged live writes. The next step can connect this model to Supabase tables, member authentication, and server actions.
