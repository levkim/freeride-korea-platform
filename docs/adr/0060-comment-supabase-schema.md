# ADR 0060: Comment Supabase Schema

## Context

Comment UI and moderation flows now exist in mock mode. Before live member writes are enabled, the database contract should define how comments, reports, pins, and moderation events will be stored.

## Decision

Extend the Supabase schema with comment persistence tables.

- `comment_target_type` distinguishes news/video, event, and category content targets.
- `comment_status` tracks visible, hidden, reported, and deleted states.
- `comment_action` records create, visibility, report, delete, pin, and unpin events.
- `comments` stores member-authored comment bodies, target references, report counts, and pinned state.
- `comment_events` stores moderation history as an append-only event log.

## Consequences

The next implementation step can connect the existing comment repository and admin actions to Supabase without changing the public UI or admin moderation flow.
