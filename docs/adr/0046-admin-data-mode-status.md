# ADR 0046: Admin Data Mode Status

## Status

Accepted

## Context

The app can run in mock mode with seed data or in Supabase mode when admin environment variables are configured. Administrators need to know which mode the current local or production instance is using before trusting form submissions and review actions.

## Decision

Expose a Supabase admin status helper and show the current data mode on `/admin`.

The dashboard now displays:

- current mode: `mock` or `supabase`
- whether Supabase admin credentials are configured
- missing environment variables
- schema file location
- current source of data

Add `.env.example` with the required Supabase variables and document the two modes in the README.

## Consequences

The team can safely continue local UI development in mock mode while having a clear handoff path to Supabase persistence.

This also reduces confusion when a form validates successfully but does not write to a real database because credentials are missing.
