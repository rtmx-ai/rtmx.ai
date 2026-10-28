# REQ-SITE-160: Remove dashboard requirement-ID leak

## Status: NOT_STARTED
## Priority: P0
## Phase: 27
## External ID: rtmx-ai/REQ-MONO-058b

## Description

/dashboard user-facing copy SHALL NOT expose internal SITE-/REQ- IDs.

## Files

rtmx.ai/src/pages/dashboard.astro

## Acceptance Criteria

1. [ ] Subtitle/lede has no SITE-103, SITE-104, or other REQ-/SITE- tokens.
2. [ ] Copy describes org-scoped Sync rooms in product language.
3. [ ] E2E or content assertion fails if SITE-\d+ appears in dashboard chrome.
