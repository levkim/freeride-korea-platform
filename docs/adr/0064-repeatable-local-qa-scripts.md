# ADR 0064: Repeatable Local QA Scripts

## Status

Accepted

## Context

Manual Playwright and HTTP checks found and fixed route issues, but the same checks need to be repeatable before future releases.

## Decision

Add local QA commands:

- `npm run qa:links`: checks rendered internal links from key public/admin pages.
- `npm run qa:release`: runs lint and internal-link QA together.

The link QA script expects the local dev server to be running at `http://localhost:3000` unless `QA_BASE_URL` is provided.

## Consequences

- Route regressions can be caught quickly.
- The project now has a simple pre-release QA habit before Supabase/GitHub deployment work.
- Visual QA still requires Playwright/manual review for layout and mobile issues.
