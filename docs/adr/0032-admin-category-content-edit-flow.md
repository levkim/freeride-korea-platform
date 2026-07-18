# ADR 0032: Admin Category Content Edit Flow

## Status

Accepted

## Context

Category content now includes Athlete Program, Education, Freeride Tour, Culture, Marketplace, Resources, and SHOP fields. Administrators need to modify these records after creation without duplicating the field model or bypassing the publishing workflow.

Public content queries only read approved or published content, but admin edit screens must be able to load content in draft, review, needs revision, approved, or published status.

## Decision

Use the existing category draft form for both creation and editing.

- `CategoryDraftForm` accepts an optional initial item and server action.
- `/admin/site-categories/[id]/edit` loads existing category content with an admin-only repository query.
- Submitted edits update the content entry and set it back to `review`.
- A new review queue item is created for the edit so publishing control remains separated from editing.
- Mock mode validates the edit flow without writing to the database when Supabase admin environment variables are missing.

## Consequences

The admin can edit every structured field already defined for category content while keeping the same approval model. Future per-role permissions can be added around the edit route without changing the form contract.
