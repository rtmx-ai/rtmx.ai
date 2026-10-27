# REQ-SITE-152: Branded HTTP 404 for missing paths

## Status: COMPLETE
## Priority: P0
## Phase: 21
## External ID: rtmx-ai/REQ-MONO-043a

## Description

Missing paths on `https://rtmx.ai/...` SHALL return **404** with a branded
RTMX page (not only a bare Starlight title). Include recovery links to Home,
Docs (`/docs` after MONO-042; `/` docs entry acceptable until then), Sync, and
Sign in.

## Acceptance Criteria

- [x] Custom 404 component/content overrides default minimal page
- [x] Status code remains 404
- [x] Recovery links present and correct
- [x] Playwright covers a missing-path URL

## Dependencies

- rtmx-ai/REQ-MONO-043a
- rtmx-ai/REQ-MONO-043b
