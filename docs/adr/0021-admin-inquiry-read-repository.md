# ADR 0021: Admin Inquiry Read Repository

## Status
Accepted

## Context
The public Contact / Join form can now persist inquiries when Supabase is configured, but the admin inquiry inbox still read only from seed data.

## Decision
Add read methods to the inquiry repository:

- `listInquiries`
- `getInquiryById`

Both methods support two modes:

- `mock`: return seed data when Supabase admin environment variables are missing.
- `supabase`: read from `inquiry_entries`.

The admin inquiry list and detail pages now use this repository and display which mode is active.

## Consequences
- Admin inquiry screens are ready for real database data.
- Local development remains stable without Supabase credentials.
- The public submission and admin reading paths now share one persistence boundary.
