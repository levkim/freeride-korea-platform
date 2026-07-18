# ADR 0031: Culture and Shop Operations Fields

## Status

Accepted

## Context

Culture and SHOP are operational categories, not static pages.

Culture content can include stories, photo/video posts, mountain ethics, community guidelines, and marketplace-related member activity. It needs editorial and community standards so member submissions can be reviewed without losing the official tone of FREERIDE KOREA.

SHOP content can include memberships, education payments, tour payments, merchandise, and future sponsorship-related benefits. Before payment integration is implemented, the site still needs to show member requirements, fulfillment rules, and sale or inventory status clearly.

## Decision

Add optional operations metadata for Culture and SHOP category content.

Culture and marketplace content can store:

- `cultureFormat`
- `communityScope`
- `ethicsNote`
- `relatedLink`

SHOP content can store:

- `shopItemType`
- `memberRequirement`
- `fulfillmentMethod`
- `inventoryStatus`
- `benefitSummary`

The admin category draft form shows these fields only for the relevant category. Public category detail pages display `Culture Operations` and `Shop Operations` blocks only when the corresponding values exist.

## Consequences

Culture can now support curated stories, community submissions, ethics guidelines, and marketplace rules within one reviewable content model. SHOP can operate as a practical intake and benefit hub before full payment integration is connected.
