# ADR 0043: Review Queue Read Repository

## Status

Accepted

## Context

Review actions now persist to Supabase and synchronize review queue/content status. However, the admin review queue list and detail pages still read directly from seed data.

This creates a mismatch after Supabase is connected: administrators can write review activity to the database, but the review screens may not show that live data.

## Decision

Add a review queue read repository.

The repository:

- reads `review_queue_items` in Supabase mode
- falls back to seeded review queue data when Supabase admin credentials are missing or no rows are available
- resolves content review items to their linked `content_entries.kind`
- maps non-content review subjects such as member upgrades, source alerts, AI drafts, and inquiries directly to admin-facing kinds

Use this repository from:

- `/admin/review-queue`
- `/admin/review-queue/[id]`
- `/admin`

## Consequences

The review queue UI now follows the same persistence boundary as review actions.

Local development remains seed-backed, while production can display live Supabase review tasks without changing the page components again.
