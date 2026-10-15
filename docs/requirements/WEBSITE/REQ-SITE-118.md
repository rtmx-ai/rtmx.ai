# REQ-SITE-118: Official OIDC Provider Button Chrome

## Status: COMPLETE

## Metadata
- **Category**: WEBSITE
- **Subcategory**: AUTH
- **Priority**: P0
- **Phase**: 8
- **Status**: COMPLETE
- **Dependencies**: REQ-SITE-102
- **Blocks**: REQ-SITE-119
- **External ID**: rtmx-ai/REQ-MONO-029a

## Requirement

`/login` SHALL present GitHub and Google sign-in with official-style
marks and labels. OpenAI / ChatGPT SHALL NOT be offered as a Sync
identity provider.

## Acceptance Criteria

1. [x] GitHub control includes the GitHub mark (official SVG) and clear label.
2. [x] Google control follows Sign in with Google visual guidance (mark + label).
3. [x] No control for OpenAI, ChatGPT, or SIWC appears on `/login`.
4. [x] Playwright covers mark presence via stable selectors
      (`data-provider="github"|"google"` and mark elements).

## Out of Scope

- Microsoft control (REQ-SITE-120)
- Provider discovery gating (REQ-SITE-119)
- Changing OAuth start/callback protocol

## Test Strategy

- `tests/e2e/oauth.spec.ts` — branded chrome + no OpenAI

## Effort Estimate

0.5 weeks
