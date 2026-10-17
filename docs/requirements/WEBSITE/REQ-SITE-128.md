# REQ-SITE-128: Pricing Copy for Public Free vs Private Paid

## Status: COMPLETE

## Metadata
- **Category**: WEBSITE
- **Subcategory**: MARKETING
- **Priority**: P1
- **Phase**: 13
- **Status**: COMPLETE
- **Dependencies**: REQ-SITE-127|REQ-SITE-121
- **Blocks**:
- **External ID**: rtmx-ai/REQ-MONO-031g

## Requirement

`/pricing` (and checkout helper copy) SHALL state that public organizations
for open-source collaboration on managed Sync are free, and that private
hosted Sync requires a Team trial or subscription. Copy SHALL NOT claim
SLAs or E2E defaults forbidden by SITE-121 / MONO-030.

## Acceptance Criteria

1. [ ] Pricing mentions public/OSS free collaboration.
2. [ ] Pricing states private hosted Sync is paid/trial.
3. [ ] legal_claims / pricing Playwright still green (no SLA/E2E regressions).
4. [ ] Ship only after BILLING-017 is COMPLETE (same gate as SITE-127).

## Effort Estimate

0.25 weeks
