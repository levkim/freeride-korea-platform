# Production Launch Checklist v1

Use this checklist when FREERIDE KOREA moves from local/mock mode to a public hosting deployment.

Final prelaunch audit:

```text
docs/deployment/final-prelaunch-audit-v1.md
```

## 1. Repository

- [ ] Confirm latest work is pushed to `main`.
- [ ] Open GitHub Actions and confirm the latest CI run is successful.
- [ ] Confirm the CI badge in README is passing.

GitHub Actions:

```text
https://github.com/levkim/freeride-korea-platform/actions/workflows/ci.yml
```

## 2. Local Preflight

Run before hosting handoff:

```powershell
npm run qa:preflight
```

Expected result:

- [ ] build passes
- [ ] release QA passes
- [ ] smoke QA passes
- [ ] temporary server on port `3100` exits

## 3. Supabase

- [ ] Create the Supabase project.
- [ ] Run `docs/database/supabase-schema-v1.sql`.
- [ ] Run `docs/database/supabase-rls-hotfix-v1.sql`.
- [ ] Confirm Supabase Advisors no longer show public table RLS critical warnings.
- [ ] Create the `content-images` Storage bucket.
- [ ] Confirm `/admin/data-setup` shows expected table and bucket status after environment variables are set.

## 4. Hosting

Use the settings in:

```text
docs/deployment/hosting-setup-v1.md
```

Required baseline:

```text
Repository: levkim/freeride-korea-platform
Production branch: main
Node.js version: 20
Install command: npm ci
Build command: npm run build
Start command: npm run start
Health check path: /healthz
```

## 5. Environment Variables

Set these in the hosting platform:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
ADMIN_ACCESS_KEY=<16+ character temporary admin key>
NEXT_PUBLIC_SUPABASE_URL=<Supabase project URL>
SUPABASE_SERVICE_ROLE_KEY=<Supabase service role key>
SUPABASE_STORAGE_CONTENT_BUCKET=content-images
```

Then run:

```powershell
npm run qa:deploy-env
```

Expected result:

- [ ] required variables pass
- [ ] production URL is not localhost
- [ ] admin access key is set
- [ ] Supabase URL and service role key are set

## 6. Post Deploy

Replace the URL with the real domain:

```powershell
QA_BASE_URL=https://your-domain.example npm run qa:smoke
QA_BASE_URL=https://your-domain.example npm run qa:release
curl https://your-domain.example/healthz
```

Expected result:

- [ ] `/healthz` returns JSON with `"ok": true`
- [ ] `/health` opens in the browser
- [ ] public pages return 200
- [ ] `/robots.txt` is available
- [ ] `/sitemap.xml` is available

## 7. Admin Review

- [ ] Open `/admin/deployment`.
- [ ] Confirm GitHub Actions link is visible.
- [ ] Confirm hosting settings are visible.
- [ ] Confirm environment variable status.
- [ ] Open `/admin/data-setup`.
- [ ] Confirm data mode is `supabase` when production persistence is intended.
- [ ] Confirm admin access is protected by `ADMIN_ACCESS_KEY`.

## 8. Launch Decision

Launch only when:

- [ ] GitHub Actions latest main run is successful.
- [ ] `npm run qa:preflight` passes locally.
- [ ] Hosting environment variables are configured.
- [ ] Supabase schema, RLS, and Storage are configured.
- [ ] Post-deploy smoke QA passes on the real domain.
