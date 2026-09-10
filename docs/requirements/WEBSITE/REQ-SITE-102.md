# REQ-SITE-102: OAuth Login (GitHub and Google)

## Metadata
- **Category**: WEBSITE
- **Subcategory**: AUTH
- **Priority**: P0
- **Phase**: 7
- **Status**: MISSING
- **Dependencies**: REQ-SITE-001
- **Blocks**: REQ-SITE-101, REQ-SITE-112
- **External ID**: rtmx-ai/REQ-MONO-020a

## Requirement

rtmx.ai SHALL integrate OAuth login via GitHub and Google. The login
flow SHALL complete against the managed sync host and store a session
token the host accepts per auth-token-v1. SAML remains Enterprise /
sales-assisted and is out of scope for this requirement.

## Rationale

Self-serve Team Checkout (REQ-MONO-020) cannot depend on ops-issued API
keys. SITE-102 is the identity front door and must not wait on the
post-pay dashboard (SITE-101).

## Acceptance Criteria

1. [ ] `/login` offers GitHub and Google sign-in controls.
2. [ ] Completing OAuth stores a session token usable as
      `Authorization: Bearer` against `PUBLIC_RTMX_SYNC_HTTP_URL`
      without `X-RTMX-Bootstrap-Token`.
3. [ ] Unauthenticated visitors hitting `/checkout` are redirected to
      `/login?next=/checkout`.
4. [ ] Playwright covers login chrome and the checkout redirect gate.
5. [ ] Body-email auth bootstrap remains disabled for anonymous callers
      on the managed host.

## Out of Scope

- SAML / Enterprise SSO UI
- Org create/select (REQ-MONO-020b)
- API key mint UI (REQ-MONO-020c)
- Full `/dashboard` rooms UI (REQ-SITE-103/104)

## Test Strategy

- `tests/e2e/oauth.spec.ts` — login chrome + checkout redirect
- `rtmx-sync/tests/test_oauth_exchange.py` — code exchange without bootstrap
- Cross-project: `system/features/self-serve-managed-checkout/`

## Effort Estimate

2.0 weeks
