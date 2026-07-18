# ADR 0070: SEO Smoke Test

## Status

Accepted

## Context

The site now has public metadata, `robots.txt`, and `sitemap.xml`. These files are easy to break during routing, metadata, or deployment configuration changes.

## Decision

Add `scripts/qa-seo.mjs` and expose it as `npm run qa:seo`.

The smoke test checks:

- home page response
- title and description metadata
- Open Graph title and description
- `robots.txt` response
- `/admin` disallow rules
- sitemap reference from robots
- required public pages in `sitemap.xml`

`npm run qa:release` now runs lint, internal-link QA, and SEO QA.

## Consequences

Pre-release checks cover both navigation and basic discoverability. The script remains local-server based so it can also be pointed at a preview URL with `QA_BASE_URL`.
