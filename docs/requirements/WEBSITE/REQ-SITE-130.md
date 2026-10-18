# REQ-SITE-130: Individual Without Personal-Org Auto-Create

## Status: COMPLETE

## Metadata
- **Category**: WEBSITE
- **Subcategory**: CHECKOUT
- **Priority**: P0
- **Phase**: 14
- **Status**: COMPLETE
- **Dependencies**: REQ-SITE-129|REQ-SITE-125
- **Blocks**: REQ-SITE-131
- **External ID**: rtmx-ai/REQ-MONO-032b

## Requirement

Individual tab SHALL NOT create or reuse a personal organization for
Checkout. SITE-125 personal-org behavior is superseded.

## Acceptance Criteria

1. [ ] No `ensurePersonalOrg` / Personal-named org create on Individual.
2. [ ] Individual does not default to Team Checkout quantity 1.
3. [ ] Playwright: entering Individual does not POST personal org.

## Effort Estimate

0.5 weeks
