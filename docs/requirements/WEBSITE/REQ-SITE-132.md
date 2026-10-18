# REQ-SITE-132: Multi-org and GitHub affiliation UX

## Status: COMPLETE
## Priority: HIGH
## Phase: 15
## External ID: rtmx-ai/REQ-MONO-033e

## Description

Account (and Individual free path) SHALL show GitHub organization candidates
when GitHub is linked, allow affiliating with multiple public Sync orgs, and
list all current memberships for switching.

## Acceptance Criteria

- [x] GitHub candidates rendered when API returns orgs
- [x] User can affiliate with ≥2 public orgs without Team Checkout
- [x] Membership list shows all orgs; active org selectable
- [x] Private free-path refusal from SITE-131 preserved
- [x] Playwright coverage in `tests/e2e/account.spec.ts` or new `orgs.spec.ts`

## Dependencies

- REQ-SITE-131
- rtmx-sync ONBOARD-009/010/011
