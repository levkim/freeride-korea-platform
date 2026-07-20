# ADR 0102: Admin editable authoring policies

## Status

Accepted

## Context

FREERIDE KOREA needs different content authoring permissions by member grade.
The first workflow model kept those rules in code, which made the site safer
early on but required a developer change whenever operations wanted to adjust a
category policy.

The user decided that administrators and executive members should be able to
change member-grade authoring permissions.

## Decision

Add editable workflow policies to the admin CMS workflow page.

The policy controls:

- minimum member grade allowed to author each content kind
- publish actor role
- policy editor role
- default publish status
- whether admin review is required
- operator notes

Policies are stored as a JSON settings document in Supabase Storage:

`content-images/_settings/workflow-policies.json`

If Supabase Storage is unavailable, the app falls back to the bundled default
policies so the admin page and publishing workflow continue to work.

## Consequences

- Administrators can change authoring policy without a code change.
- The member matrix reads the same policy source, so the admin view reflects
  saved rules.
- News, video, event, and category draft creation use the saved policy when
  creating review queue requirements.
- This is still compatible with the future auth phase, where executive member
  accounts can call the same policy action after role verification.
