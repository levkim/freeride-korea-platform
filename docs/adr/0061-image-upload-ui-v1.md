# ADR 0061: Image Upload UI v1

## Context

Admin authoring forms previously accepted only an image URL. Operators need a clearer image workflow before Supabase Storage is connected, especially for news/video, events, and category content.

## Decision

Add a shared Image Upload UI v1 component.

- Keep the existing `imageUrl` field so current validation and persistence continue to work.
- Add an image file picker and local preview.
- When a file is selected, generate a future storage path under `/storage/content-images`.
- Do not upload files yet; actual Supabase Storage writes will be enabled after auth and bucket policy setup.
- Reuse the component across category content, events, and news/video authoring forms.

## Consequences

Administrators can prepare posts with a more realistic image workflow now, while the app keeps the current URL-based persistence contract until Supabase Storage is implemented.
