# ADR 0066: Admin Data Mode Sidebar

## Status

Accepted

## Context

The project can run in mock/seed mode before Supabase exists, and later in Supabase mode after environment variables are configured. Individual admin pages explain this in several places, but operators need a persistent reminder while moving through the admin console.

## Decision

Add a data mode panel to the admin sidebar.

The sidebar now shows:

- current mode: `Mock / seed` or `Supabase`
- a short operational explanation
- a direct link to `/admin/data-setup`

The same change also restores the admin navigation labels to readable Korean.

## Consequences

Operators can see the current storage mode without opening a specific form. This reduces the chance of assuming data has been persisted before Supabase is connected.
