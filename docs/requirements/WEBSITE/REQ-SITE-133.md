# REQ-SITE-133: Adoption recommendations UI

## Status: COMPLETE
## Priority: MEDIUM
## Phase: 15
## External ID: rtmx-ai/REQ-MONO-033f

## Description

Authenticated surfaces SHALL recommend projects already in the Sync adoption
registry (dogfood: `rtmx-ai/rtmx`) and offer affiliation with the hosting
public org.

## Acceptance Criteria

- [x] Recommendations panel/section fetches registry list
- [x] Entry for `github.com/rtmx-ai/rtmx` visible when seeded
- [x] CTA affiliates to `rtmx-ai` public org when not already a member
- [x] Playwright coverage

## Dependencies

- REQ-SITE-132
- rtmx-sync ONBOARD-012
