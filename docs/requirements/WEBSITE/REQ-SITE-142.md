# REQ-SITE-142: Membership provenance copy on Organizations

## Status: COMPLETE
## Priority: P0
## Phase: 19
## External ID: rtmx-ai/REQ-MONO-036a

## Description

The Organizations surface on `/account` SHALL explain that joining a **public
Sync organization** requires only a signed-in RTMX account (no forge
membership), and that **Prove with GitHub** verifies GitHub organization
membership via linked OAuth (`read:org`).

## Acceptance Criteria

- [x] Help text or section intro states Sync org ≠ necessarily a GitHub org
- [x] Join path labeled without requiring GitHub
- [x] Prove with GitHub labeled as membership verification
- [x] E2E or content test asserts both provenance phrases

## Dependencies

- REQ-SITE-132
- REQ-SITE-133
- rtmx-ai/REQ-MONO-036a
