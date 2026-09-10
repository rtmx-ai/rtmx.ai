# REQ-SITE-112: Self-serve Managed Checkout Funnel

## Metadata
- **Category**: WEBSITE
- **Subcategory**: BILLING
- **Priority**: P0
- **Phase**: 7
- **Status**: MISSING
- **Dependencies**: REQ-SITE-102, REQ-SITE-110
- **External ID**: rtmx-ai/REQ-MONO-020d

## Requirement

rtmx.ai SHALL provide a self-serve managed Team Checkout funnel:
sign-in, create/select organization, mint or use an admin credential,
and start Stripe Checkout against the fixed managed sync host. The page
MUST NOT ask buyers to paste an ops-issued key or choose a sync server
URL for the hosted path.

## Rationale

SITE-110 closed Team Checkout chrome for private beta but still assumes
an external credential. SITE-101..104 target the post-pay dashboard.
This requirement is the acquisition funnel that makes managed Sync
buyable without sales/ops in the loop.

## Acceptance Criteria

1. [ ] Unauthenticated `/checkout` redirects to OAuth sign-in.
2. [ ] After sign-in, buyer can create/select an org in-browser.
3. [ ] Buyer can mint an admin API key (shown once) and/or start Checkout
      with the session.
4. [x] Sync server is fixed (`PUBLIC_RTMX_SYNC_HTTP_URL`); no editable
      field on `/checkout` or `/billing/manage`. (Partial — landed ahead of
      OAuth; private-beta key paste remains until 020a–c.)
5. [ ] Playwright covers sign-in gate, fixed host, and key-mint chrome.
6. [x] Self-managed `/license` retains an editable server URL.

## Out of Scope

- Full rooms dashboard (REQ-SITE-103/104)
- Enterprise self-serve Checkout
- Replacing server ONBOARD APIs (already COMPLETE)

## Test Strategy

- `tests/e2e/checkout.spec.ts` — fixed host, sign-in gate
- Cross-project: `system/features/self-serve-managed-checkout/`

## Effort Estimate

1.5 weeks (website; depends on SITE-102)
