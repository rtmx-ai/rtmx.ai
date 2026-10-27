---
title: SCIM IdP registration
description: Register Okta, Entra ID, or another SCIM 2.0 IdP against RTMX Sync
---

Enterprise directories can provision Sync org membership from an identity
provider using SCIM 2.0. Org owners and admins mint a Bearer on the
[organization admin](/orgs/admin) page; the IdP stores that token and calls
Sync’s SCIM endpoints.

## Prerequisites

- Managed or self-hosted Sync with an organization you administer
- IdP that supports SCIM 2.0 (Okta, Microsoft Entra ID, and similar)
- Ability to store a long-lived Bearer secret in the IdP app

## Mint a SCIM token

1. Sign in at [rtmx.ai](https://rtmx.ai) and open **Account → Organizations**.
2. Open **Admin** for the target Sync org (`/orgs/admin?slug=<org>`).
3. Under **SCIM tokens**, enter a label (for example `Okta`) and click
   **Mint SCIM token**.
4. Copy the plaintext Bearer immediately — Sync shows it once.
5. Optionally revoke unused tokens from the same panel.

Tokens are org-scoped (`scope=scim`). Ordinary members cannot mint or list them.

## Configure the IdP application

Create a SCIM 2.0 application in your IdP and set:

| Setting | Value |
|---------|--------|
| Base / Tenant URL | `https://sync.rtmx.ai/scim/v2` (or your Sync host + `/scim/v2`) |
| Authentication | HTTP Header Bearer |
| Token | The minted `rtmx_sc_…` value |

Self-hosted Sync: replace the host with your deployment’s public HTTPS base.

### Smoke test

With the Bearer, `GET /scim/v2/ServiceProviderConfig` should return HTTP 200
and include `rtmxOrgId` for the org that minted the token. After revoke, the
same request returns 401.

## Provisioning notes

- **Users** map to Sync accounts (email / `userName`); deactivation clears
  active membership for the bound org.
- **Groups** map to Sync organizations for v1; prefer managing a single
  application per Sync org.
- Prefer a dedicated IdP service account and rotate tokens from the admin
  panel when operators change.

## Related

- [RTMX for Enterprise](/docs/guides/for-enterprise) — identity roadmap
- Organization admin — mint/revoke UI for SCIM Bearers
- [Organization audit log](/docs/guides/audit-admin) — review `scim` events
  after provisioning
