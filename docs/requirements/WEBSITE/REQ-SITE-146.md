# REQ-SITE-146: Muted Team upgrade and self-host CTAs on billing manage

## Status: COMPLETE
## Priority: P0
## Phase: 19
## External ID: rtmx-ai/REQ-MONO-037c

## Description

On `/billing/manage`, show muted but visible CTAs to **Upgrade to Team**
(`/checkout?tab=team` or org-aware Team checkout) when not already Team-paid
for the selected org, and **Deploy locally** / self-hosted
(`/checkout?tab=self-hosted`). Current plan summary remains the visual primary.

## Acceptance Criteria

- [x] Upgrade CTA visible for free / public_org / non-Team viewers
- [x] Upgrade CTA hidden or disabled when selected org is Team-active
- [x] Self-host CTA always visible, muted
- [x] Neither CTA uses primary-button styling above the plan card
- [x] Playwright asserts presence/absence rules

## Dependencies

- REQ-SITE-145
- REQ-SITE-123
- rtmx-ai/REQ-MONO-037c
