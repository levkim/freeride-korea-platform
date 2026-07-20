# ADR 0109: Supabase Content Image Upload v1

## Status

Accepted

## Context

The platform had an image upload UI, but it only generated a preview and kept the image field as a URL/path input. Operators and members need actual image file upload for news/video, events, category content, and member board posts.

The storage bucket decision was already made in ADR 0062: use one public Supabase Storage bucket named `content-images`.

## Decision

Add a shared server-side content image upload helper.

- Accept image files from server action `FormData`.
- Allow only JPG, PNG, WEBP, and GIF files.
- Limit representative image uploads to 5MB.
- Upload files to the configured Supabase Storage bucket.
- Store the public Storage URL back into the existing `imageUrl` field.
- Delete the previous Storage object when a category/member post image is replaced or explicitly removed.
- Keep manual image URL entry available for existing local brand assets and external image workflows.
- Allow Next Image to render public Supabase Storage image URLs.

## Consequences

Admin and member content forms can now persist real images instead of URL-only placeholders. The existing content model remains unchanged because image references still use the `imageUrl` field.

This version does not add a full media library, image cropper, automatic resizing, or per-user Storage RLS. Those can be added later after the basic upload flow is stable.

