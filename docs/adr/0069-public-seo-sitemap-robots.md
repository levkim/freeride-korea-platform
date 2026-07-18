# ADR 0069: Public SEO Sitemap and Robots

## Status

Accepted

## Context

The public website now has stable top-level pages and seeded detail pages for events, news/video, education, athlete program, tours, culture, and shop. Before deployment, the site should expose basic metadata, a sitemap, and robots rules.

## Decision

Add Korean-first site metadata, `app/sitemap.ts`, and `app/robots.ts`.

The sitemap includes:

- public static pages
- event detail pages
- news/video detail pages
- category detail pages mapped to their public section

The robots file allows public pages and disallows `/admin`.

The canonical site origin is configured with `NEXT_PUBLIC_SITE_URL`, falling back to `http://localhost:3000` in local development.

## Consequences

The public site is easier to index after deployment, while admin routes are kept out of crawler paths. When the production domain is chosen, only `NEXT_PUBLIC_SITE_URL` needs to change.
