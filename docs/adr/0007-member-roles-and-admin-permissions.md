# ADR 0007: Member Roles And Admin Permissions

## Status

Accepted

## Context

FREERIDE KOREA needs one registration flow that initially creates a general member. After registration, the operating team can upgrade members to regular, executive, athlete, or sponsorship member levels. Different levels can draft different types of content, but publication must stay under admin control.

## Decision

The membership model has five public member types:

- `general`: free base member.
- `regular`: annual-fee official member.
- `executive`: editorial and operations member.
- `athlete`: approved athlete member from FWT Qualifier Level 3 or higher.
- `supporting`: sponsorship member supporting athletes, safety education, and freeride culture.

Content drafting follows the CMS workflow policy:

- General members can draft culture and marketplace content.
- Regular and athlete members can draft tours and education/program content.
- Executive members can draft news, video, and event content.
- Admins approve and publish all content.

## Consequences

The admin member screen can show current levels, approval status, and a permission matrix before the database is connected. Supabase can later store the same member type values defined in `docs/database/supabase-schema-v1.sql`.
