# REQ-SITE-135: Silent OAuth re-auth without a click

## Status: COMPLETE
## Priority: P0
## Phase: 16
## External ID: rtmx-ai/REQ-MONO-034c

## Description

After SITE-134 graceful expiry, the site SHALL attempt silent IdP re-auth
(no user click) when Sync reports 401. Uses Sync `prompt=none` login
(ONBOARD-014). On success the browser follows the authorize URL
automatically; on failure (or GitHub 409) SITE-134 signed-out chrome applies.

## Acceptance Criteria

- [x] On `/auth/me` 401: try silent restore once (`rtmx.oauth.silent_attempted`)
- [x] Prefer last `rtmx.oauth.provider`, then google / microsoft / github
- [x] GitHub / unsupported → continue; clear local session (SITE-134)
- [x] Supported provider → top-level navigate to `authorization_url` (no click)
- [x] Callback clears `silent_attempted` on success
- [x] Playwright: failure path (SITE-134) + silent start (SITE-135)

## Dependencies

- REQ-SITE-134
- rtmx-sync REQ-ONBOARD-014
