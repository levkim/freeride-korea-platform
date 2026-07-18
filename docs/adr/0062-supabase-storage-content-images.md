# ADR 0062: Supabase Storage Bucket for Content Images

## Status

Accepted

## Context

The admin forms now have an image upload UI v1 with file selection, preview, and a stored image path field. The next persistence step needs a clear storage target before server actions start uploading files.

## Decision

Use one Supabase Storage bucket named `content-images` for public content imagery.

The bucket name is configurable with `SUPABASE_STORAGE_CONTENT_BUCKET`, defaulting to `content-images` in the Supabase admin boundary.

Uploads will be handled by admin server actions in the first real-storage phase. The browser UI will continue to collect a file and image path, but direct browser-to-storage writes are deferred until authentication and member upload permissions are implemented.

## Consequences

- Events, News & Video, and category content share one predictable media bucket.
- Production setup has a simple handoff checklist.
- Direct member uploads can be added later with signed upload URLs without changing the current content model.
