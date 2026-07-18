# Supabase Storage v1

FREERIDE KOREA content images should use one shared Supabase Storage bucket first.

## Bucket

```text
content-images
```

The bucket name can be overridden with:

```text
SUPABASE_STORAGE_CONTENT_BUCKET=content-images
```

## Intended Usage

- 대표 이미지: events, news/video, category content
- 본문 이미지: later rich-text/editor phase
- 관리자 업로드: admin server actions only
- public read: allowed for published content images

## Object Path Convention

```text
{content-kind}/{content-id-or-slug}/{timestamp}-{slug-file-name}.{extension}
```

Examples:

```text
events/yeti-alaska-haines-pro/1720000000000-main.jpg
news-video/freeride-training-camp/1720000000000-cover.png
category/freeriding-education/1720000000000-hero.webp
```

## Recommended Policies

The first production connection should keep writes server-only:

- Public users can read published bucket objects.
- Browser clients do not write directly to storage in v1.
- Admin server actions upload with the Supabase service role key.
- Later, member-authenticated uploads can be added with signed upload URLs and moderation rules.

## Setup Checklist

1. Create the `content-images` bucket in Supabase Storage.
2. Keep the bucket public-read if content images must render without signed URLs.
3. Restrict insert/update/delete operations to server-side service-role actions.
4. Add `SUPABASE_STORAGE_CONTENT_BUCKET=content-images` to `.env.local`.
5. Restart the Next.js dev server after changing environment variables.
