# REQ-SITE-132: Multi-org and GitHub affiliation UX

## Status: MISSING
## Priority: HIGH
## Phase: 15
## External ID: rtmx-ai/REQ-MONO-033e

## Description

Account (and Individual free path) SHALL show GitHub organization candidates
when GitHub is linked, allow affiliating with multiple public Sync orgs, and
list all current memberships for switching.

## Acceptance Criteria

- [ ] GitHub candidates rendered when API returns orgs
- [ ] User can affiliate with ≥2 public orgs without Team Checkout
- [ ] Membership list shows all orgs; active org selectable
- [ ] Private free-path refusal from SITE-131 preserved
- [ ] Playwright coverage in `tests/e2e/account.spec.ts` or new `orgs.spec.ts`

## Dependencies

- REQ-SITE-131
- rtmx-sync ONBOARD-009/010/011
