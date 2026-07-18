# ADR 0074: Human-Readable Health Page

## Status

Accepted

## Context

ADR 0073 added `/healthz` as a JSON endpoint for runtime monitoring. This works for scripts and hosting checks, but it is not a friendly page for an operator opening the URL in a browser.

## Decision

Add `/health` as a human-readable status page.

`/health` shows:

- service name
- site URL
- data mode
- Supabase configuration status
- timestamp

`/healthz` remains the JSON endpoint for automated monitoring.

## Consequences

Operators can quickly verify app status in the browser, while monitors and QA scripts continue to use `/healthz`.
