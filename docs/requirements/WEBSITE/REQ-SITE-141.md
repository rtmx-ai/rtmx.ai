# REQ-SITE-141: Homepage Sync-primary hierarchy

## Status: COMPLETE
## Priority: P0
## Phase: 18
## Category: WEBSITE / MARKETING

## Description

rtmx.ai homepage SHALL present **RTMX Sync** as the product and the open-source
`rtmx` CLI as the access client. This completes the SITE-117 product thesis for
the homepage button hierarchy and first-viewport copy (nav and `/sync` already
comply with SITE-117).

SITE-117 acceptance criterion “Hero primary CTA … link to `/sync`” is
**superseded** for homepage primary/secondary buttons only. `/sync` remains the
dedicated thesis page; header Sync · Docs · Blog · Pricing is unchanged.

## Acceptance Criteria

1. Homepage primary CTA is Sync trial → `/checkout` (label includes 14-day free trial);
   secondary CTA is install client → `/installation`.
2. Homepage UCP / lede names Sync as the product; CLI framed as open-source client
   in at most one short clause.
3. Funnel note order is trial Sync → install client → sign in (not client-first).
4. Sync feature card leads with Sync value; install language is secondary.
5. Site `title` / `description` in `astro.config.mjs` are Sync-primary.
6. Playwright covers the new hierarchy; first viewport reads as Sync product
   without relying on nav alone.
7. Homepage elevates Sync How-it-works (`SyncCollabDemo`); SITE-018 video is
   labeled as client demo, not the product proof.

## Test Cases

- `tests/e2e/sync.spec.ts` — homepage Sync-primary hierarchy (SITE-141)
- `tests/e2e/legal.spec.ts` — primary CTA contrast (trial button)

## Dependencies

- REQ-SITE-117 (Sync explainer / nav)
- REQ-SITE-110 (Team Checkout funnel)

## Notes

Plan working title used SITE-139; that ID was already assigned to MONO-035f.
This requirement is REQ-SITE-141.
