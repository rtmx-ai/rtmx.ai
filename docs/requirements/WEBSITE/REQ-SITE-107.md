# REQ-SITE-107: Checkout success and cancel pages

## Status: MISSING
## Priority: HIGH
## Phase: 5
## External ID: rtmx-ai/REQ-MONO-011e

## Description

rtmx.ai shall serve success and cancel routes for Stripe Checkout.
Success SHALL NOT itself entitle the org (webhooks do). For
`managed_sync` it SHALL reveal the issued sync URL and API key after
the webhook has materialized (poll or push). Cancel SHALL leave the
org unlicensed and invite retry. No card data on these pages.

## Acceptance Criteria

- [ ] GET success does not call Stripe to mark paid
- [ ] PaaS success shows sync URL + one-time API key once entitled
- [ ] Cancel explains nothing was charged and no tenant was created
- [ ] URLs used in Checkout Session creation are these routes, not
      app.rtmx.ai placeholders

## Test Cases

- `tests/e2e/checkout.spec.ts`
