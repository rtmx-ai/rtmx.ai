# REQ-SITE-120: Microsoft Entra Sign-In Control

## Status: MISSING

## Metadata
- **Category**: WEBSITE
- **Subcategory**: AUTH
- **Priority**: P1
- **Phase**: 8
- **Status**: MISSING
- **Dependencies**: REQ-SITE-119
- **Blocks**: (none)
- **External ID**: rtmx-ai/REQ-MONO-029d

## Requirement

When `microsoft` appears in `/auth/providers`, `/login` SHALL show an
official-style Microsoft sign-in control that starts
`/auth/login/microsoft` the same way as GitHub/Google.

## Acceptance Criteria

1. [ ] Microsoft control uses official-style mark + "Continue with Microsoft" (or brand-approved label).
2. [ ] Control is absent when `microsoft` is not in the providers list.
3. [ ] Click starts OAuth via existing startOAuth(`microsoft`) path.
4. [ ] Playwright covers presence when providers mock includes `microsoft`.

## Out of Scope

- Server Entra exchange (REQ-ONBOARD-007)
- SAML / Enterprise SSO UI

## Test Strategy

- `tests/e2e/oauth.spec.ts`

## Effort Estimate

0.5 weeks
