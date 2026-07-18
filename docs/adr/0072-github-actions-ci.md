# ADR 0072: GitHub Actions CI

## Status

Accepted

## Context

The project is now pushed to GitHub and has local release checks for lint, internal links, SEO metadata, sitemap, robots, and production build. These checks should run automatically when code is pushed or reviewed.

## Decision

Add `.github/workflows/ci.yml`.

The workflow runs on pushes and pull requests to `main`:

- `npm ci`
- `npm run lint`
- `npm run build`
- start the built app on port 3000
- `npm run qa:release`

`NEXT_PUBLIC_SITE_URL` is set to `http://localhost:3000` inside CI so metadata, robots, and sitemap checks use the local test server.

## Consequences

GitHub will catch basic regressions before deployment. The workflow still does not replace production smoke testing after a real hosting URL is configured.
