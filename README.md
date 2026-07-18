# FREERIDE KOREA Webapp

Next.js web application for the FREERIDE KOREA public website, member portal, and admin operations platform.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase-ready structure
- Human-in-the-loop admin workflow

## First Routes

- `/`
- `/about`
- `/contact-join`
- `/account`
- `/admin`
- `/admin/review-queue`

## Commands

```powershell
npm run dev
npm run lint
npm run qa:links
npm run qa:release
npm run build
```

`qa:links` checks rendered internal links against the local server. Run the dev server first.
`qa:release` runs lint and the internal-link QA pass together.

## Data Mode

The app currently supports two data modes:

- `mock`: runs with typed seed data from `content/seed/site-data.ts`
- `supabase`: uses Supabase when `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured

Copy `.env.example` to `.env.local` and fill the values after creating the Supabase project.

Database schema:

```text
docs/database/supabase-schema-v1.sql
```

Storage setup:

```text
docs/database/supabase-storage-v1.md
```

## Notes

Initial screens use typed mock data. Supabase Auth, database tables, RLS policies, and AI/source-monitor integrations will be connected after the UI and data structure are reviewed.
Comments are currently implemented as a v1 UI and moderation flow with mock data; `comments` and `comment_events` are included in the Supabase schema for the next persistence step.
Image upload UI v1 is ready on admin forms. Actual file persistence should use the `content-images` Supabase Storage bucket documented in `docs/database/supabase-storage-v1.md`.
