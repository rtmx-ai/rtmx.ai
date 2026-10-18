# REQ-SITE-125: Individual Tab Personal Org Path

## Status: COMPLETE

## Metadata
- **Category**: WEBSITE
- **Subcategory**: CHECKOUT
- **Priority**: P0
- **Phase**: 13
- **Status**: COMPLETE
- **Dependencies**: REQ-SITE-124
- **Blocks**:
- **External ID**: rtmx-ai/REQ-MONO-031c
- **Superseded by**: REQ-SITE-129|REQ-SITE-130|REQ-SITE-131 (MONO-032)

## Requirement

Individual tab SHALL start hosted Team Checkout at quantity 1 against a
personal organization (created if the user has none suitable), without
requiring the Team org picker flow.

> **Historical.** Transitional personal-org path. Forward: account-centric
> Individual (SITE-129–131).

## Acceptance Criteria

1. [x] Individual tab path creates or reuses a personal org.
2. [x] Stripe Checkout quantity is 1; offering remains managed Team.
3. [x] User is not forced through Team multi-seat UI.
4. [x] Playwright or mocked Checkout request asserts quantity=1.

## Effort Estimate

0.5 weeks
