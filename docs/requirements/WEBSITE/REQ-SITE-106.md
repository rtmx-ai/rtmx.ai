# REQ-SITE-106: Pricing names license vs hosted Checkout

## Status: MISSING
## Priority: HIGH
## Phase: 5
## External ID: rtmx-ai/REQ-MONO-011a

## Description

The pricing page shall distinguish Team self-managed (license
acquisition, `/license`) from Team hosted (Stripe Checkout for
`managed_sync` / `hosted_app`). Enterprise and On-Prem remain
sales-assisted. The CLI Apache-2.0 claim stays visible.

## Acceptance Criteria

- [ ] Hosted Team CTA does not go to `/license` or the waitlist
- [ ] Self-managed Team still reaches `/license`
- [ ] Hosted CTA is disabled or redirects to sign-in when there is
      no org session
- [ ] Enterprise / On-Prem do not start Checkout

## Test Cases

- `tests/e2e/licensing.spec.ts` extended, or `tests/e2e/checkout.spec.ts`
