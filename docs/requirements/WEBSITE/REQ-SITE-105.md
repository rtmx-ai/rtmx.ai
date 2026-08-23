# REQ-SITE-105: Pricing CTA starts entitlement acquisition

## Status: COMPLETE
## Priority: HIGH
## Phase: 5
## External ID: rtmx-ai/REQ-MONO-016d

## Description

When monetization MVP is enabled, the Team pricing CTA shall start checkout
or a license-request flow instead of only "Join Waitlist". The page shall
continue to state that the RTMX CLI is free under Apache 2.0 and that
pricing applies to RTMX Sync collaboration.

## Acceptance Criteria

- [x] MVP flag/config (build-time or env) switches Team CTA off waitlist-only
- [x] CTA starts Stripe Checkout, a license-request form that creates a
      downloadable entitlement, or an equivalent acquisition path
- [x] Enterprise / On-Prem may remain contact-sales
- [x] OSS clarification section remains visible (REQ-SITE-011)
- [x] Waitlist form-proxy may remain for newsletter; it is not the Team buy path

## Implementation

`PUBLIC_RTMX_MONETIZATION_MVP` (default enabled) points the Team CTA at
`/license`. That page issues and downloads a signed license from the
customer's own rtmx-sync using an admin API key, then explains installation.

An API key is the credential because rtmx.ai holds no session with a
self-managed server, and a headless admin key is what such an operator
already has. Stripe checkout for the hosted SKU layers on top of the same
license API rather than replacing it.

Cross-origin calls require the server to set `RTMX_ALLOWED_ORIGINS`; without
it the browser is blocked and the page says so explicitly.

## Test Cases

- `tests/e2e/licensing.spec.ts` (`pricing entitlement CTA`, `license acquisition page`)

## Dependencies

- REQ-SITE-011 (free vs paid copy)
- REQ-BILLING-010 / portal API on rtmx-sync for license download
