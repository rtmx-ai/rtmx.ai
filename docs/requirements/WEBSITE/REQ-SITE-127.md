# REQ-SITE-127: Public/Private Visibility on Org Create

## Status: MISSING

## Metadata
- **Category**: WEBSITE
- **Subcategory**: CHECKOUT
- **Priority**: P1
- **Phase**: 13
- **Status**: MISSING
- **Dependencies**: REQ-SITE-124|REQ-ONBOARD-008
- **Blocks**:
- **External ID**: rtmx-ai/REQ-MONO-031g

## Requirement

When creating an organization from `/checkout`, the user SHALL choose
Public or Private. Public SHALL be described as free for open-source
collaboration on managed Sync; Private as trial/paid.

## Acceptance Criteria

1. [ ] Visibility control on create (default Private).
2. [ ] Copy distinguishes public free vs private paid.
3. [ ] Create payload sends visibility to sync (ONBOARD-008).
4. [ ] Playwright covers control presence and default.

## Gate

Do not enable Public in production UI until REQ-BILLING-017 / MONO-031f is COMPLETE.

## Effort Estimate

0.25 weeks
