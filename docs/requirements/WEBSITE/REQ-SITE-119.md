# REQ-SITE-119: Login Shows Only Configured OIDC Providers

## Status: COMPLETE

## Metadata
- **Category**: WEBSITE
- **Subcategory**: AUTH
- **Priority**: P0
- **Phase**: 8
- **Status**: COMPLETE
- **Dependencies**: REQ-SITE-118
- **Blocks**: REQ-SITE-120
- **External ID**: rtmx-ai/REQ-MONO-029b

## Requirement

`/login` SHALL call `GET {PUBLIC_RTMX_SYNC_HTTP_URL}/auth/providers` and
render sign-in controls only for providers the sync host reports as
configured.

## Acceptance Criteria

1. [x] On load, `/login` fetches `/auth/providers` from the managed sync HTTP URL.
2. [x] Unlisted providers are hidden or disabled (no click-through to 503).
3. [x] If the providers request fails, show a clear error (do not assume all IdPs work).
4. [x] Playwright covers a mocked providers payload (e.g. github-only).

## Out of Scope

- Implementing the sync endpoint (REQ-ONBOARD-006)
- Microsoft button (REQ-SITE-120)

## Test Strategy

- `tests/e2e/oauth.spec.ts` — route mock for `/auth/providers`

## Effort Estimate

0.5 weeks
