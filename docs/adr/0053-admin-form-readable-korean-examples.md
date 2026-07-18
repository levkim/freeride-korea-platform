# ADR 0053: Admin Form Readable Korean Examples

## Context

After moving admin screens toward Korean-first operation, some category content form section labels and examples still used English phrases such as `Education operations`, `Culture operations`, `Shop operations`, `Tour operations`, and English-only difficulty labels.

These labels are visible to Korean operators during content creation, while some internal values still need to stay stable for routing, permissions, and seed data compatibility.

## Decision

Translate visible category form section labels and example text into Korean while keeping internal values where they are already used by code.

- Section labels use Korean operational wording.
- Difficulty option display text is Korean.
- Athlete and culture example placeholders use Korean descriptions.
- Existing option `value` attributes remain unchanged where they are used as internal values.

## Consequences

The admin form reads more naturally for Korean operators without requiring a database migration or changing existing routing and permission logic.
