# REQ-SITE-123: Unified Purchase Hub Tabs + Common CTA

## Status: MISSING

## Metadata
- **Category**: WEBSITE
- **Subcategory**: CHECKOUT
- **Priority**: P0
- **Phase**: 13
- **Status**: MISSING
- **Dependencies**: REQ-SITE-112
- **Blocks**: REQ-SITE-124|REQ-SITE-125|REQ-SITE-126
- **External ID**: rtmx-ai/REQ-MONO-031a

## Requirement

`/checkout` SHALL present Individual, Team, and Self-hosted as tabs within
one view and a single primary CTA whose behavior matches the active tab.

## Acceptance Criteria

1. [ ] Tabs Individual | Team | Self-hosted with `data-testid` hooks.
2. [ ] Exactly one primary submit/CTA control for acquisition.
3. [ ] CTA label reflects Stripe vs license download for the active tab.
4. [ ] Playwright: tab switch updates CTA (`tests/e2e/checkout.spec.ts`).

## Out of Scope

- Org empty-state (SITE-124)
- Visibility toggle (SITE-127)

## Files to modify

- `src/pages/checkout.astro` (and/or extracted components)
- `tests/e2e/checkout.spec.ts`

## Effort Estimate

0.5 weeks
