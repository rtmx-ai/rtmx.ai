# REQ-SITE-121: Align Pricing Marketing With Terms

## Status: COMPLETE

## Metadata
- **Category**: WEBSITE
- **Subcategory**: MARKETING
- **Priority**: P0
- **Phase**: 12
- **Status**: COMPLETE
- **Dependencies**: REQ-SITE-110
- **Blocks**:
- **External ID**: rtmx-ai/REQ-MONO-030a

## Requirement

Published `/pricing` (and any published security/enterprise marketing)
SHALL NOT claim Team-default end-to-end encryption, that the managed Sync
server only sees ciphertext by default, or a self-serve 99.9% SLA
guarantee. Copy MUST align with Terms §§7–8 (AS IS / beta) and the
legal-claims-provenance CONTROL_MATRIX rows M-1..M-4.

## Acceptance Criteria

1. [x] Team features array does not include bare `End-to-end encryption`.
2. [x] FAQ (or body) does not state `The server only sees ciphertext` for default managed Sync.
3. [x] `99.9% SLA guarantee` is not presented as a Team self-serve entitlement; Enterprise uses MSA language and `/contact`.
4. [x] Optional E2E, if mentioned, is explicitly optional / customer-controlled — not the managed default.
5. [x] Playwright `tests/e2e/legal_claims.spec.ts` fails the build if forbidden strings return on published routes.
6. [x] Underscore-prefixed draft pages (`_security.astro`, `_enterprise.astro`) scrubbed and remain unpublished.

## Files to modify

- `src/pages/pricing.astro`
- `tests/e2e/legal_claims.spec.ts` (new)
- Optionally `_security.astro`, `_enterprise.astro` if published later

## Out of Scope

- Changing Privacy/ToS legal substance (counsel)
- Implementing E2E-by-default in Sync

## Test Strategy

- Playwright against `/pricing` source text / rendered copy
- Monorepo matrix M-1..M-4 status update when green

## Effort Estimate

0.5 weeks
