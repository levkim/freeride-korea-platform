# Hosting Setup v1

This document records the first hosting handoff settings for the FREERIDE KOREA webapp.

## Recommended Baseline

Use a hosting platform that supports the Next.js App Router and Node.js runtime.

Common settings:

```text
Repository: levkim/freeride-korea-platform
Production branch: main
Node.js version: 20
Install command: npm ci
Build command: npm run build
Start command: npm run start
Health check path: /healthz
```

## Required Environment Variables

```text
NEXT_PUBLIC_SITE_URL=https://www.freeride.kr
ADMIN_ACCESS_KEY=<16+ character temporary admin key>
NEXT_PUBLIC_SUPABASE_URL=<Supabase project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase anon public key>
SUPABASE_SERVICE_ROLE_KEY=<Supabase service role key>
SUPABASE_STORAGE_CONTENT_BUCKET=content-images
```

`SUPABASE_STORAGE_CONTENT_BUCKET` can be omitted when using the default `content-images` bucket.

## Preflight Before Push Or Handoff

```powershell
npm run qa:preflight
```

## Post Deploy Checks

```powershell
QA_BASE_URL=https://www.freeride.kr npm run qa:smoke
QA_BASE_URL=https://www.freeride.kr npm run qa:release
curl https://www.freeride.kr/healthz
```

## Operator Notes

- Check GitHub Actions after every push to `main`.
- Confirm `/admin/deployment` after environment variables are set.
- Confirm `/admin/data-setup` after Supabase schema, RLS, and Storage are configured.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` in browser code or public logs.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the public browser key used by Supabase Auth.
