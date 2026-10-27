# REQ-SITE-143: Unified Organizations Join-first account IA

## Status: COMPLETE
## Priority: P0
## Phase: 19
## External ID: rtmx-ai/REQ-MONO-036b

## Description

`/account` SHALL expose a single **Organizations** tab that merges current
memberships, adoption recommendations (Join), and Prove with GitHub.
Standalone **Already on Sync** and **GitHub** tabs SHALL be removed. Join from
adoption MUST work without a linked GitHub identity.

## Acceptance Criteria

- [x] Tab strip: Organizations, Connections, Billing link (Profile as today)
- [x] No `data-tab="adoption"` / `data-tab="github"` top-level tabs
- [x] Sections: Your orgs → Join (adoption) → Prove with GitHub
- [x] Join CTA does not redirect to GitHub link as a hard gate
- [x] Playwright covers IA + Join-without-GitHub

## Dependencies

- REQ-SITE-142
- REQ-SITE-132
- REQ-SITE-133
- rtmx-ai/REQ-MONO-036b
- rtmx-ai/REQ-MONO-036c
