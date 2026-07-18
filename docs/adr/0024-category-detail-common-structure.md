# ADR 0024: Category Detail Common Structure

## Status

Accepted

## Context

FREERIDE KOREA has several category-style sections: Athlete Program, Safety Education, Freeride Tour, Culture, Marketplace, Resources, and Shop. These sections need individual detail pages, but the editorial structure should remain consistent so that future CMS publishing, admin approval, and Supabase-backed content can share the same rendering path.

## Decision

Create one shared category content model and one shared public detail component.

- `CategoryContentItem` defines common fields for category detail content.
- `categoryContentItems` provides seeded examples for current development and design review.
- `getCategoryContentById` and `listCategoryContent` read from Supabase when configured, with seeded fallback during local development.
- Public routes under each category validate the content kind/subtype before rendering the shared `CategoryDetailPage`.

## Consequences

All category detail pages now share the same core structure: hero, bilingual title and summary, detail facts, body copy, policy note, and inquiry CTA. This reduces duplicate page work and keeps future CMS data easier to map.

Some category-specific fields remain generalized for v1. If later sections need richer models, such as tour itineraries, education curriculum modules, marketplace pricing, or downloadable resources, those can be added as structured child tables or metadata fields without replacing the public page shell.
