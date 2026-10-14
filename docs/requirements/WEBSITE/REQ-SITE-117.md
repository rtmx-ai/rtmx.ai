# REQ-SITE-117: Sync explainer is front-and-center product thesis

## Status: COMPLETE
## Priority: P0
## Phase: 8
## Category: WEBSITE / MARKETING

## Description

rtmx.ai SHALL feature a dedicated `/sync` explainer as the primary Sync
product surface. Pricing SHALL remain plan selection only. Header nav SHALL
lead with Sync ahead of Pricing. The open source CLI SHALL be framed as how
you access Sync — not as the product itself.

## Acceptance Criteria

- [x] `/sync` splash page exists with after-Git thesis and CLI-as-client framing
- [x] Header nav is Sync · Docs · Pricing (Sync first); aegis/Roadmap/About in product footer
- [x] Docs sidebar Product group links to `/sync` and `/pricing`
- [x] Hero primary CTA and Sync feature card link to `/sync` (not `/pricing`)
- [x] Pricing page links to `/sync` for the product story
- [x] Playwright covers nav order, page copy, hero/pricing links, footer demotion

## Test Cases

- `tests/e2e/sync.spec.ts` — Sync explainer (SITE-117)

## Dependencies

- REQ-SITE-111 (multiplayer Sync marketing)
- REQ-SITE-110 (Team Checkout funnel)

## Notes

Sync is the thesis. Pricing is the SKU card. The CLI is the access client.
