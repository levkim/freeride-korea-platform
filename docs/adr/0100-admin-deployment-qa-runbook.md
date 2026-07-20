# ADR 0100: Admin Deployment QA Runbook

## Context

The platform now has several operational QA scripts for membership registration, member upgrades, comment moderation, assets, smoke checks, and Supabase connectivity. The admin deployment page listed only broad release commands, so operators could miss workflow-specific checks.

## Decision

Expand `/admin/deployment` into a QA runbook.

- List workflow-specific QA commands.
- Use Windows-friendly `npm.cmd` commands.
- Include production-domain command examples using `cmd /c set QA_BASE_URL=...`.
- Clarify that Sites handles the production runtime.

## Consequences

Operators can run the right QA for the operational area they just changed, without searching through `package.json` or prior ADRs.
