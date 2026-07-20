# ADR 0104: Member nickname display name

## Status

Accepted

## Context

Members need a public nickname separate from their real name. The nickname
should appear after login and should be used when a member leaves posts or
comments.

The current database already stores a member display field as `members.name`,
and comments resolve author labels from that field.

## Decision

Add a required `nickname` field to the `/account` signup form.

For v1, store the nickname as the member display name in `members.name`. Store
the real name and nickname in Supabase Auth user metadata during signup. When an
authenticated user has no existing member row, create the member row using
`user_metadata.nickname` first, then fall back to `user_metadata.name` or email.

## Consequences

- Logged-in account cards show the public nickname.
- Future member-authored comments and posts can keep using `members.name` as the
  displayed author nickname.
- Existing members without a nickname continue to display their current member
  name until an account/profile edit feature is added.
