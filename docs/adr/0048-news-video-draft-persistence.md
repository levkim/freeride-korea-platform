# ADR 0048: News Video Draft Persistence

## Status

Accepted

## Context

News & Video content is a core public section and should follow the same human-in-the-loop publishing model as category content. The admin page previously documented required fields and displayed seed data, but it did not provide a real draft submission path.

## Decision

Add a Supabase-ready News & Video repository and admin draft form.

The draft form:

- accepts news or video posts
- requires Korean and English title, summary, and body
- requires a representative image URL
- requires YouTube URL for video posts
- accepts source URL and comma-separated tags
- submits to `content_entries` with `status = review`
- creates a matching `review_queue_items` row
- falls back to mock mode when Supabase admin credentials are missing

Public and admin News & Video pages now read through the repository, using Supabase when configured and seed data otherwise.

## Consequences

News & Video can now enter the same review and publishing queue as category content.

This leaves richer media upload/storage as a future enhancement, while supporting URL-based media immediately.
