# REQ-SITE-136: Publish Security and Enterprise pages

## Status: COMPLETE
## Priority: P1
## Phase: 17
## External ID: rtmx-sync/REQ-WEB-009

## Description

When managed Sync is live, rtmx.ai SHALL publish `/security` and `/enterprise`
(replacing draft `_security.astro` / `_enterprise.astro`). Links live in the
product footer (SITE-117), not the product-led header. Copy SHALL match
SITE-121 / MONO-030a: no default E2E, no self-serve FedRAMP/IL ATO claims.

## Acceptance Criteria

- [x] `/security` and `/enterprise` return 200
- [x] Product footer links to both pages
- [x] Content reflects shipped Sync capabilities + labeled roadmap
- [x] Enterprise CTA routes to `/contact?intent=enterprise`
- [x] Playwright covers routes, footer links, and claim hygiene

## Dependencies

- REQ-SITE-117, REQ-SITE-121
- REQ-WEB-009 (sync RTM tracker)
