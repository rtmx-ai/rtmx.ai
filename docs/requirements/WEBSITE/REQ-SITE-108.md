# REQ-SITE-108: Customer billing portal

## Status: MISSING
## Priority: HIGH
## Phase: 5
## External ID: rtmx-ai/REQ-MONO-011f

## Description

An authenticated org admin shall open the Stripe Billing Portal from
rtmx.ai to change seats, payment method, and cancel-at-period-end.
RTMX shall not collect PAN or build a parallel subscription-editor.
Seat and cancel outcomes are visible only after the corresponding
webhook materializes.

## Acceptance Criteria

- [ ] CTA calls POST /billing/portal and redirects to Stripe's URL
- [ ] Unauthenticated visitors cannot open a portal session
- [ ] Copy states that cancel takes effect at period end (matching
      billing-api-v1)

## Test Cases

- `tests/e2e/checkout.spec.ts`
