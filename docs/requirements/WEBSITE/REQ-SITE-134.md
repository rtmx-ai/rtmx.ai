# REQ-SITE-134: Graceful session expiry UX

## Status: COMPLETE
## Priority: P0
## Phase: 16
## External ID: rtmx-ai/REQ-MONO-034a (pairs with ONBOARD-013; chrome UX)

## Description

When `sessionStorage` still holds a Sync Bearer token that the server rejects
(401), the site SHALL treat the user as signed out: clear local session state,
update header chrome, and prompt soft re-sign-in. It MUST NOT leave “signed in”
chrome beside a red “Sign out and sign in again” callout.

Active sessions SHALL benefit from server sliding renewal (ONBOARD-013) so
routine use does not hit expiry while the tab is open.

## Acceptance Criteria

- [x] Header `SessionChrome` validates token via `GET /auth/me` on load when a
      token is present
- [x] On 401: clear `rtmx.session`, show Sign in chrome, dispatch
      `rtmx:session-cleared`
- [x] Checkout (and similar) on 401: soft message with Sign in link; no red
      “Sign out and sign in again” copy
- [x] Playwright covers stale-token → signed-out chrome + soft checkout prompt

## Dependencies

- REQ-SITE-114
- rtmx-sync REQ-ONBOARD-013
