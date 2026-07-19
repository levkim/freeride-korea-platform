# ADR 0080: Local Preflight QA

## Status

Accepted

## Context

The project has separate commands for build, release QA, deployment environment QA, and smoke QA. CI also runs release QA and smoke QA after building and starting the app.

Before pushing or handing off for deployment, operators need one local command that mirrors the important CI confidence checks without requiring them to remember the exact order.

## Decision

Add `npm run qa:preflight`.

The command runs:

- `npm run build`
- a temporary `next start` server on `QA_PORT` or `3100`
- `npm run qa:release`
- `npm run qa:smoke`

The deployment environment check remains separate because it is expected to fail until the real domain, admin key, and Supabase project are configured.

## Consequences

The team can run one preflight command before push or deployment handoff without depending on a separately running dev server. Local development can still use the smaller individual QA commands when faster feedback is needed.
