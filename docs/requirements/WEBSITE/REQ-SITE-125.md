# REQ-SITE-125: Individual Tab Personal Org Path

## Status: MISSING

## Metadata
- **Category**: WEBSITE
- **Subcategory**: CHECKOUT
- **Priority**: P0
- **Phase**: 13
- **Status**: MISSING
- **Dependencies**: REQ-SITE-124
- **Blocks**:
- **External ID**: rtmx-ai/REQ-MONO-031c

## Requirement

Individual tab SHALL start hosted Team Checkout at quantity 1 against a
personal organization (created if the user has none suitable), without
requiring the Team org picker flow.

## Acceptance Criteria

1. [ ] Individual tab path creates or reuses a personal org.
2. [ ] Stripe Checkout quantity is 1; offering remains managed Team.
3. [ ] User is not forced through Team multi-seat UI.
4. [ ] Playwright or mocked Checkout request asserts quantity=1.

## Effort Estimate

0.5 weeks
