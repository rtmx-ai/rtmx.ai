# REQ-SITE-126: Self-Hosted Tab and /license Redirect

## Status: MISSING

## Metadata
- **Category**: WEBSITE
- **Subcategory**: CHECKOUT
- **Priority**: P0
- **Phase**: 13
- **Status**: MISSING
- **Dependencies**: REQ-SITE-123|REQ-SITE-105
- **Blocks**:
- **External ID**: rtmx-ai/REQ-MONO-031d

## Requirement

Self-hosted acquisition SHALL live as a tab on `/checkout`. `/license`
SHALL redirect to that tab. License issue/download behavior from SITE-105
SHALL remain available.

## Acceptance Criteria

1. [ ] Self-hosted tab embeds issue + download chrome.
2. [ ] `/license` → `/checkout` Self-hosted tab (302 or client redirect).
3. [ ] Pricing “Self-managed license” reaches the tab.
4. [ ] Playwright covers redirect and download affordance.

## Files to modify

- `src/pages/checkout.astro`
- `src/pages/license.astro` (redirect)
- `tests/e2e/checkout.spec.ts`, `tests/e2e/licensing.spec.ts`

## Effort Estimate

0.5 weeks
