# ADR 0013: Category Operations Admin

## Status
Accepted

## Context
Athlete Program, Safety Education, Freeride Tour, Culture, and SHOP now exist as public pages. They still need a shared operations view before detailed CMS forms are implemented.

## Decision
Create an admin category operations page at `/admin/site-categories`.

The page documents:

- Public path
- Author permission
- Publisher permission
- Required fields
- CMS implementation sequence

Add `shop` as a first-class content kind because SHOP will later manage membership payments, education/tour payments, merchandise, inventory, and refund rules.

## Consequences
- The admin can review the unfinished public categories in one place.
- Future CMS forms can be implemented from a clear category contract.
- SHOP is included in permissions and database content-kind planning before payment work begins.
