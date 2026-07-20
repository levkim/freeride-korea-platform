# ADR 0090: Member Status Lookup v1

## Context

Full member login requires Supabase Auth and a more complete account model. Before that work, new members still need a way to confirm whether their membership or upgrade inquiry was received.

## Decision

Add an unauthenticated status lookup to `/account` using email and phone number.

- The lookup only succeeds when the submitted phone number matches an inquiry record for that email.
- The result shows minimal status information: member name, membership type, joined date, recent inquiry statuses, and upgrade review queue statuses.
- It does not expose message bodies, contact details, or unrelated member data.

## Consequences

Members get a useful confirmation path before full login exists. This is not a replacement for authenticated account management, but it reduces support burden during the launch phase.
