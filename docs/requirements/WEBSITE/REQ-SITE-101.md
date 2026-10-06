# REQ-SITE-101: Authenticated dashboard route

## Metadata
- **Category**: WEBSITE
- **Subcategory**: AUTH
- **Priority**: HIGH
- **Phase**: 5
- **Status**: COMPLETE
- **Dependencies**: REQ-SITE-102
- **Blocks**: REQ-SITE-103|REQ-SITE-104
- **Notes**: Trails paying (MONO-020/021). Header chrome is SITE-114 (thinner).

## Requirement

rtmx.ai SHALL provide a `/dashboard` route that requires authentication.
Unauthenticated visitors SHALL be redirected to login with a safe return
`next` parameter. Authenticated visitors SHALL see a minimal signed-in
shell (identity + org context) as the front door to org-scoped rooms
(SITE-103/104).

## Acceptance Criteria

1. [x] Unauthenticated `GET /dashboard` redirects to
      `/login?next=/dashboard` (or equivalent).
2. [x] Authenticated visit renders a dashboard shell (may be minimal).
3. [x] Session missing/expired is treated as unauthenticated.
4. [x] Playwright covers redirect and signed-in shell smoke.
5. [x] Does not block SITE-114 or MONO-021.

## Decomposition

1. Unauthenticated GET /dashboard redirects to login with safe next=/dashboard
2. Authenticated visit renders a minimal signed-in dashboard shell
3. Missing or expired session is treated as unauthenticated
4. Playwright covers redirect and signed-in shell smoke
5. Dashboard auth gate does not block SITE-114 or MONO-021

## Out of Scope

- Live room WebSocket (SITE-103)
- Org-scoped room list UI (SITE-104)

## Effort Estimate

1.5 weeks
