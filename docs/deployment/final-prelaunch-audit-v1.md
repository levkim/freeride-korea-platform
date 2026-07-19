# Final Prelaunch Audit v1

Date: 2026-07-20

This document records the final prelaunch check before moving FREERIDE KOREA from local/mock development preparation into real Supabase and hosting setup.

## Summary

Status: ready to move to real service connection.

The codebase, QA commands, health checks, deployment documents, CI workflow, and admin readiness screens are in place. The remaining blockers are not code-preparation issues; they are external service decisions and configuration.

## Verified Locally

Latest checked commit before this audit:

```text
b2a88b4 Add admin deployment document links
```

Commands run:

```powershell
npm run qa:preflight
npm run qa:deploy-env
```

`qa:preflight` result:

- build passed
- TypeScript passed
- internal link QA passed
- SEO QA passed
- runtime `/healthz` QA passed
- smoke QA passed
- temporary production server on port `3100` exited

`qa:deploy-env` result:

- expected not ready
- `NEXT_PUBLIC_SITE_URL` missing
- `ADMIN_ACCESS_KEY` missing
- `NEXT_PUBLIC_SUPABASE_URL` missing
- `SUPABASE_SERVICE_ROLE_KEY` missing
- `SUPABASE_STORAGE_CONTENT_BUCKET` uses default `content-images`

This is expected because the real domain, Supabase project, and production admin key have not been created yet.

## Ready Assets

QA and runtime:

- `npm run qa:preflight`
- `npm run qa:release`
- `npm run qa:smoke`
- `npm run qa:runtime`
- `npm run qa:deploy-env`
- `/health`
- `/healthz`

Deployment documents:

- `docs/deployment/hosting-setup-v1.md`
- `docs/deployment/production-launch-checklist-v1.md`
- `docs/deployment/final-prelaunch-audit-v1.md`

Database documents:

- `docs/database/supabase-schema-v1.sql`
- `docs/database/supabase-rls-hotfix-v1.sql`
- `docs/database/supabase-storage-v1.md`

Admin pages:

- `/admin/deployment`
- `/admin/data-setup`
- `/admin/login`
- `/admin/review-queue`
- `/admin/site-categories`
- `/admin/contact-join`
- `/admin/comments`

GitHub:

- repository: `levkim/freeride-korea-platform`
- branch: `main`
- CI workflow: `.github/workflows/ci.yml`
- CI URL: `https://github.com/levkim/freeride-korea-platform/actions/workflows/ci.yml`

## Remaining External Decisions

These are the only things that should block the next phase:

- choose the hosting platform
- decide the production domain
- create the Supabase project
- create `ADMIN_ACCESS_KEY`
- configure hosting environment variables
- run Supabase schema, RLS, and Storage setup
- deploy from `main`
- run post-deploy QA against the real domain

## Next Phase

Proceed to real service connection in this order:

1. Create Supabase project.
2. Apply schema SQL.
3. Apply RLS hotfix SQL.
4. Create `content-images` Storage bucket.
5. Choose hosting platform.
6. Configure environment variables.
7. Deploy `main`.
8. Run post-deploy smoke QA.

No more preparatory checklist work is recommended before starting this phase.
