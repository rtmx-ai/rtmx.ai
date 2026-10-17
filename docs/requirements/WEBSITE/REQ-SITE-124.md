# REQ-SITE-124: Collapsed Organization Create/Select UI

## Status: MISSING

## Metadata
- **Category**: WEBSITE
- **Subcategory**: CHECKOUT
- **Priority**: P0
- **Phase**: 13
- **Status**: MISSING
- **Dependencies**: REQ-SITE-123|REQ-SITE-112
- **Blocks**: REQ-SITE-125
- **External ID**: rtmx-ai/REQ-MONO-031b

## Requirement

Checkout organization UI SHALL NOT show select and create as two always-on
parallel controls. Zero memberships → create-only. One or more → single
selector with create-as-option.

## Acceptance Criteria

1. [ ] Zero orgs: no org `<select>`; Create organization + name field.
2. [ ] ≥1 orgs: one selector; create available without a permanent second row.
3. [ ] Creating an org selects it for the subsequent Checkout action.
4. [ ] Playwright covers both branches.

## Out of Scope

- Visibility public/private (SITE-127)
- Removing advanced API-key escape hatch (may stay collapsed)

## Files to modify

- `src/pages/checkout.astro`
- `tests/e2e/checkout.spec.ts`

## Effort Estimate

0.5 weeks
