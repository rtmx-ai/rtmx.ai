# REQ-SITE-122: Privacy and Terms Published With Footer Links

## Status: COMPLETE

## Metadata
- **Category**: WEBSITE
- **Subcategory**: LEGAL
- **Priority**: P0
- **Phase**: 12
- **Status**: COMPLETE
- **Dependencies**:
- **Blocks**:
- **External ID**: rtmx-ai/REQ-MONO-030

## Requirement

rtmx.ai SHALL publish `/privacy` and `/terms` with identifiable legal
headers and SHALL link Privacy and Terms from the site legal bar / footers
on splash pages.

## Acceptance Criteria

1. [x] `/privacy` renders Privacy Policy heading and privacy@ contact.
2. [x] `/terms` renders Terms of Service heading and legal@ contact.
3. [x] `data-testid="site-legal-bar"` (or page footer legal nav) links to `/privacy` and `/terms` on key splash routes.
4. [x] Playwright `tests/e2e/legal.spec.ts` covers publication and footer links.

## Test Strategy

- `tests/e2e/legal.spec.ts`

## Effort Estimate

0.25 weeks (already shipped)
