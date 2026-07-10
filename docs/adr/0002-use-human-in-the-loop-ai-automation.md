# ADR-0002: Use Human-in-the-loop AI Automation

Date: 2026-07-10
Status: Accepted
Phase: Phase 0

## Context

FREERIDE KOREA will use AI to support operations such as translation, summaries, tag suggestions, official source monitoring, inquiry classification, and draft generation.

However, the project includes high-responsibility areas such as avalanche safety, WFR-related education, freeride tour safety notices, membership approval, athlete member approval, refund / insurance / legal language, and used safety gear marketplace review.

## Decision

AI will be used as an operations assistant, not as an autonomous publisher or decision maker.

AI may:

- Generate drafts.
- Translate Korean / English content.
- Summarize official sources.
- Suggest tags and categories.
- Detect missing fields.
- Detect risk keywords.
- Create review queue candidates.

AI may not:

- Publish content automatically.
- Approve or reject members.
- Judge avalanche risk.
- Publish WFR / emergency response guidance without review.
- Change refund / insurance / legal language.
- Judge or guarantee used safety gear condition.
- Publish official source changes without admin verification.

## Options Considered

- Full automation: fast, but unsafe for official and safety-sensitive operations.
- No AI: safe, but inefficient and hard to scale.
- Human-in-the-loop AI: balances efficiency, safety, and official responsibility.

## Consequences

Positive:

- Admin workload is reduced without losing control.
- Safety-sensitive information remains human-reviewed.
- Official source monitoring can happen automatically without automatic publishing.
- AI activity can be logged and audited.

Trade-offs:

- Admin review remains necessary.
- Some workflows are slower than full automation.
- The system needs review queues, AI output logs, and audit logs.

## Follow-up

- Define AI output storage in the backend data model.
- Build Review Queue before enabling AI-assisted publishing workflows.
- Add source monitoring alerts without auto-publish behavior.
