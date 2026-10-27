# REQ-SITE-153: Unknown *.rtmx.ai host recovery

## Status: COMPLETE
## Priority: P0
## Phase: 21
## External ID: rtmx-ai/REQ-MONO-043c

## Description

Visiting a non-existent subdomain such as `https://x.rtmx.ai` SHALL NOT leave
the user on a browser-only “Server Not Found” page. Implement wildcard DNS +
edge rule: redirect to apex (preferred) or branded unknown-host HTML. Allowlist
real product hosts so Sync/www/forms keep working.

## Acceptance Criteria

- [x] `x.rtmx.ai` (probe label) resolves at edge and recovers to branded UX
- [x] `sync.rtmx.ai` / `www.rtmx.ai` / `forms.rtmx.ai` unaffected
- [x] Allowlist documented in ops/site runbook
- [x] Manual or automated probe recorded in slice exit evidence
- [x] Zone wildcard DNS `AAAA * → 100::` (proxied) for arbitrary unknown labels

## Note

An Astro 404 alone cannot fix NXDOMAIN. This requirement is DNS/CDN + optional
Worker, coordinated with site copy for the landing experience.

## Dependencies

- REQ-SITE-152 (recovery page reuse when redirecting to apex with banner)
- rtmx-ai/REQ-MONO-043c
- rtmx-ai/REQ-MONO-043d
