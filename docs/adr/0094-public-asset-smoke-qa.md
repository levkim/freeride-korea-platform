# ADR 0094: Public Asset Smoke QA

## Context

The production header logo can fail independently from page routes when static assets are renamed, optimized differently by the host, or referenced through an incompatible image path.

## Decision

Add `qa:assets` to check the main public brand images over HTTP before release.

- The check requests the header logo and primary hero images.
- Each asset must return a 2xx status and an `image/*` content type.
- `qa:release` now runs the asset check after route, SEO, and runtime checks.

## Consequences

Logo and key visual regressions are caught before deployment instead of only after manual browser review.
