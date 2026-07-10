# ADR-0004: Select Custom Web App Stack

Date: 2026-07-10
Status: Accepted
Phase: Phase 1

## Context

FREERIDE KOREA requires more than a brand website. The project includes a public website, admin CMS, member roles, member-submitted drafts, admin publishing approval, Review Queue, official source monitoring, AI output logs, applications, tours, programs, events, resources, and marketplace review.

These requirements are difficult to model cleanly with a basic website builder or a plugin-heavy CMS.

## Decision

We will use the following direction:

```text
Next.js + TypeScript + Supabase/PostgreSQL + Custom Admin
```

The project owner confirmed this direction on 2026-07-10.

## Options Considered

- WordPress with plugins:
  Fast to launch, but long-term permission, AI, monitoring, and review workflows may become fragile.

- Webflow / Framer with external CMS:
  Good for visual brand pages, but weak for member roles, admin approval, applications, and source monitoring.

- Headless CMS with custom frontend:
  Strong for content, but still likely needs a custom backend for permissions, applications, AI logs, and monitoring.

- Custom Web App:
  More development work, but best match for the planned operating platform.

## Consequences

Positive:

- Clean data model for members, content, applications, reviews, AI outputs, and audit logs.
- Fine-grained control over authoring and publishing permissions.
- Review Queue and Official Source Monitor can be first-class features.
- Easier long-term expansion to payments, advanced notifications, mobile app, and AI tools.

Trade-offs:

- Higher initial development effort.
- Admin UI must be built.
- Requires stronger development discipline and phased MVP planning.

## Follow-up

- Create MVP development roadmap v1.
- Define initial project structure.
- Convert backend data model into database schema planning.
- Keep future stack changes in a superseding ADR.
