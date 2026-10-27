---
title: Organization audit log
description: View recent Sync audit events (SCIM, credential.issue) as an org admin
---

Org owners and admins can review recent Sync audit events without database
access. The [organization admin](/orgs/admin) **Audit log** panel lists
newest-first rows from `GET /orgs/{id}/audit`.

## What you see

Typical events include:

| `event_type` | `action` | Meaning |
|--------------|----------|---------|
| `scim` | `users.create` / similar | IdP provisioning via SCIM |
| `connections` | `credential.issue` | Vault credential issued (often after shared-org fetch) |

Each row shows timestamp, type, action, acting user, and resource id.
Responses never include raw tokens or cryptographic signatures.

## Open the panel

1. Sign in at [rtmx.ai](https://rtmx.ai) and open **Account → Organizations**.
2. Open **Admin** for the org (`/orgs/admin?slug=<org>`).
3. Scroll to **Audit log**. Optionally filter by **Type** (`scim`,
   `connections`) and **Action** (`credential.issue`, `users.create`).
4. Use **Refresh** to reload; **Load older** when Sync returns a pagination
   cursor.

Ordinary members cannot call the audit API (HTTP 403) and do not see the panel.

## Retention

When Sync has a database (`DATABASE_URL`), audit rows dual-write to SQL with
a configurable TTL (default **30 days**, env `RTMX_AUDIT_TTL_DAYS`). The API
response then includes `"retention": "sql"`. History survives Sync restarts;
expired rows are purged on boot.

Without a database (ephemeral / local smoke), retention remains
`"process"` (in-memory only).

## API sketch

```http
GET /orgs/{org_id}/audit?limit=50&cursor=&event_type=&action=
Authorization: Bearer <session or admin key>
```

- `limit` — default 50, max 200
- `cursor` — exclusive upper sequence from a previous `next_cursor`
- `event_type` / `action` — optional exact AND filters (REQ-MONO-056)
- Response shape: contract `audit-admin-v1.json` (`org_id`, `retention`,
  `events`, `next_cursor`)

## Related

- [SCIM IdP registration](/docs/guides/scim-idp) — events appear after IdP
  provisioning
- [RTMX for Enterprise](/docs/guides/for-enterprise) — identity roadmap
