# ADR 0105: Dynamic member header

## Status

Accepted

## Context

The public header now shows account state. Anonymous visitors should see
`로그인/가입`, while authenticated members should see their nickname in the same
header position.

The header reads Supabase Auth cookies on the server. If public pages are
prerendered as static HTML, the header can be cached as anonymous and fail to
reflect the logged-in member state.

## Decision

Set the root app layout to `force-dynamic` so public pages are rendered on
request and the shared header can read the current member session.

## Consequences

- Header account state is consistent across the website after login.
- Member nickname display works from the shared navigation instead of only on
  the account page.
- Public pages are server-rendered on demand, which is acceptable for this v1
  membership phase.
