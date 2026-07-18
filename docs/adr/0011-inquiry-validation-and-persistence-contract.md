# ADR 0011: Inquiry Validation And Persistence Contract

## Status

Accepted

## Context

The public Contact / Join form and the admin inquiry inbox now share the same inquiry categories. Before connecting Supabase writes, the app needs a stable validation and persistence contract.

## Decision

Inquiry submissions use a Zod schema with:

- inquiry type
- name
- email
- optional phone
- optional riding/activity experience
- optional requested member type
- title
- message
- privacy consent

The Supabase schema includes `inquiry_entries` and `inquiry_events`. The list view can mask personal data, while the detail view can display full inquiry data for authorized admins.

## Consequences

The next implementation can connect the public form to a server action and Supabase insert without changing the admin screens or inquiry type model.
