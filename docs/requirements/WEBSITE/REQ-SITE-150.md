# REQ-SITE-150: Documentation URL namespace /docs

## Status: COMPLETE
## Priority: P0
## Phase: 21
## External ID: rtmx-ai/REQ-MONO-042a

## Description

All Starlight documentation pages SHALL be served under **`/docs/*`**. Account
and product routes remain top-level. Header/footer Docs entries and internal
docs links SHALL use `/docs` paths.

## Acceptance Criteria

- [x] `/docs` (or `/docs/`) returns documentation index
- [x] `/docs/adapters` (and other former root docs) return 200 under prefix
- [x] `/account`, `/checkout`, `/billing/manage` remain top-level and unchanged
- [x] Nav Docs → `/docs`
- [x] Playwright covers `/docs` vs `/account` distinction

## Dependencies

- rtmx-ai/REQ-MONO-042a
- rtmx-ai/REQ-MONO-042c
