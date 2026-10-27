# REQ-SITE-145: Customer billing manage home

## Status: COMPLETE
## Priority: P0
## Phase: 19
## External ID: rtmx-ai/REQ-MONO-037b

## Description

`/billing/manage` SHALL be a signed-in **billing home**: current plan /
entitlement, seats and period when paid, billing history, and secondary Open
Stripe Billing Portal. Account → Billing SHALL land here. The default
above-the-fold UX MUST NOT be org-ref + `rtmx_ad_` API key fields.

## Acceptance Criteria

- [x] Signed-in load calls Sync billing summary with session credentials
- [x] Plan/status region visible without portal redirect
- [x] History region present (list or empty state)
- [x] Portal button secondary; advanced API-key path optional/collapsed
- [x] Account Billing → `/billing/manage`
- [x] Playwright coverage for signed-in home

## Dependencies

- REQ-SITE-108 (portal; demoted as primary UX)
- rtmx-sync/REQ-BILLING-018
- rtmx-ai/REQ-MONO-037b
- rtmx-ai/REQ-MONO-037d
