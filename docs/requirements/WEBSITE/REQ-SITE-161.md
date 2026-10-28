# REQ-SITE-161: Reconcile dogfood and roadmap counts

## Status: NOT_STARTED
## Priority: P0
## Phase: 27
## External ID: rtmx-ai/REQ-MONO-058c

## Description

Homepage dogfood stats and /roadmap progress SHALL share one source of truth (or stop claiming a fixed count).

## Files

rtmx.ai/src/components/Hero.astro; rtmx.ai/src/pages/roadmap.astro

## Acceptance Criteria

1. [ ] Documented source of truth (live sync, generated fixture, or soft language).
2. [ ] Home and roadmap no longer contradict (328/31 vs 230/25 or equivalent).
3. [ ] If static, both surfaces updated together; if live, home uses the same feed.
