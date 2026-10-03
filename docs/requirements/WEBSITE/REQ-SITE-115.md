# REQ-SITE-115: Account Management Page

## Metadata
- **Category**: WEBSITE
- **Subcategory**: ACCOUNT
- **Priority**: P0
- **Status**: COMPLETE
- **External ID**: rtmx-ai/REQ-MONO-023c

## Requirement

rtmx.ai SHALL provide `/account` for signed-in users: profile summary,
navigation to orgs/billing/connections, and sign-out. Header identity
SHALL link to `/account`.

## Acceptance Criteria

- [x] Page exists under splash template matching site chrome.
- [x] Unauthenticated visitors redirect to `/login?next=/account`.
- [x] Shows display_name and email from session.
- [x] Sign-out clears `rtmx.session`.
- [x] Lists organizations with admin links; Connections section present.
