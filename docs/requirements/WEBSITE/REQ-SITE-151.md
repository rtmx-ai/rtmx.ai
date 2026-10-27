# REQ-SITE-151: Redirect legacy root docs URLs to /docs

## Status: COMPLETE
## Priority: P0
## Phase: 21
## External ID: rtmx-ai/REQ-MONO-042b

## Description

Legacy documentation URLs at the site root SHALL **301** to the canonical
`/docs/...` path so bookmarks and external links keep working.

## Acceptance Criteria

- [x] `/adapters` → 301 `/docs/adapters`
- [x] `/installation` → 301 `/docs/installation`
- [x] `/adapters/github` → 301 `/docs/adapters/github` (or PM hub after MONO-039)
- [x] Product routes (`/account`, `/sync`, `/pricing`, …) are not redirected
- [x] Playwright asserts Location header / final URL for a sample set

## Dependencies

- REQ-SITE-150
- rtmx-ai/REQ-MONO-042b
