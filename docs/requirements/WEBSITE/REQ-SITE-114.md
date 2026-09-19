# REQ-SITE-114: Header shows signed-in identity

## Metadata
- **Category**: WEBSITE
- **Subcategory**: AUTH
- **Priority**: HIGH
- **Phase**: 8
- **Status**: MISSING
- **Dependencies**: REQ-SITE-102
- **External ID**: rtmx-ai/REQ-MONO-021d

## Requirement

rtmx.ai SHALL show signed-in identity in the global site header when a
session exists, with Sign out. When signed out, the header SHALL offer
Sign in without dominating marketing heroes.

## Rationale

SITE-102 stores session for Checkout only in `sessionStorage`; users
see no “I am authenticated as me” after GitHub login. SITE-101 dashboard
trails paying; this thin chrome closes the identity gap now.

## Acceptance Criteria

1. [ ] Signed-in: header shows email or display name from session.
2. [ ] Sign out clears session and updates chrome.
3. [ ] Signed-out: Sign in links to `/login` (with safe `next` when known).
4. [ ] Does not require `/dashboard` (SITE-101) to be implemented.
5. [ ] Playwright covers signed-in vs signed-out header states.

## Files (expected)

- `src/components/HeaderNav.astro` (or Header session widget)
- `tests/e2e/session_chrome.spec.ts`

## Effort Estimate

0.5 weeks
