# REQ-SITE-135: Silent OAuth re-auth without a click

## Status: MISSING
## Priority: P0
## Phase: 16
## External ID: rtmx-ai/REQ-MONO-034c

## Description

After SITE-134 graceful expiry, the site SHALL attempt silent IdP re-auth
(no user click) when Sync reports 401 and the browser may still hold an IdP
SSO cookie. Implementation depends on Sync ONBOARD-014 / MONO-034b.

## Acceptance Criteria

- [ ] Spec + Gherkin in `system/features/silent-oauth-reauth/`
- [ ] On 401: try silent restore once before SITE-134 clear
- [ ] Success: session restored; page continues
- [ ] Failure: SITE-134 signed-out chrome (no red “sign out again” callout)
- [ ] Playwright covers silent success (mocked) and failure paths

## Dependencies

- REQ-SITE-134
- rtmx-sync REQ-ONBOARD-014
