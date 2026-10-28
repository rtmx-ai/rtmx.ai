# REQ-SITE-167: Align checkout kicker with trial funnel

## Status: NOT_STARTED
## Priority: HIGH
## Phase: 27
## External ID: rtmx-ai/REQ-MONO-058i

## Description

Checkout kicker SHALL not say Purchase-only when the primary site CTA is a 14-day trial.

## Files

rtmx.ai/src/pages/checkout.astro

## Acceptance Criteria

1. [ ] Kicker uses Get Sync / Start trial (or equivalent), not Purchase alone.
2. [ ] Stripe/buy CTAs remain clear for paid paths.
