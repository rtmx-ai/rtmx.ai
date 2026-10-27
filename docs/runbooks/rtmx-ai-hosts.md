# RTMX.ai hostname allowlist and unknown-host recovery

**REQ-SITE-153 / REQ-MONO-043d**

## Allowlisted hosts

These labels are **product front doors**. Wildcard / unknown-host recovery must
**not** redirect them:

| Host | Purpose |
|------|---------|
| `rtmx.ai` | Apex marketing + account SPA |
| `www.rtmx.ai` | Canonical www (same site policy as apex) |
| `sync.rtmx.ai` | Managed Sync API / WebSocket |
| `forms.rtmx.ai` | Form proxy Worker (HubSpot + reCAPTCHA) |

Source of truth for the edge allowlist set:
`infra/workers/unknown-host/src/index.ts` → `ALLOWED_HOSTS`.

When adding a new product hostname:

1. Create a **specific** DNS record (A/AAAA/CNAME) for that label **before**
   relying on the zone wildcard.
2. Add the FQDN to `ALLOWED_HOSTS` and extend unit tests.
3. Redeploy `rtmx-unknown-host`.
4. Update this table.

## Unknown-host behavior

1. Worker `rtmx-unknown-host` is deployed with route `*.rtmx.ai/*` (see
   `infra/workers/unknown-host/wrangler.toml`).
2. DNS: zone wildcard **AAAA `*` → `100::` (proxied)** so unknown labels resolve
   at Cloudflare. Until the wildcard exists, probe hosts use Workers custom
   domains (`x.rtmx.ai`, `synck.rtmx.ai`).
3. Worker: any non-allowlisted `*.rtmx.ai` host returns **302** to
   `https://rtmx.ai/?from_host=<hostname>`. Allowlisted hosts matching the
   wildcard route are **passed through** to the zone origin (do not 404).
4. Apex: `FromHostBanner` shows recovery links when `from_host` is present.

Typos such as `synck.rtmx.ai` follow the unknown-host path — do **not** mint
TLS or Sync backends for typo labels.

## Deploy checklist

```bash
cd infra/workers/unknown-host
npm install
npm test
npx wrangler deploy
```

DNS (Cloudflare zone `rtmx.ai`):

- Keep specific records for `sync`, `forms`, `www`, apex in place.
- Add wildcard (required for arbitrary unknown labels):

  | Type | Name | Content | Proxy |
  |------|------|---------|-------|
  | AAAA | `*` | `100::` | Proxied (orange) |

  Dashboard: https://dash.cloudflare.com/ff3eb41dd224ff324f1e2cd0b92e6b95/rtmx.ai/dns/records

  Or API (Wrangler OAuth cannot edit DNS — use a Zone.DNS Edit token):

  ```bash
  # https://dash.cloudflare.com/profile/api-tokens → Create → "Edit zone DNS" → rtmx.ai
  export CLOUDFLARE_API_TOKEN=…
  cd infra/workers/unknown-host
  node scripts/ensure-wildcard-dns.mjs
  ```

## Probe (exit evidence)

```bash
# Expect 302 Location: https://rtmx.ai/?from_host=x.rtmx.ai
curl -sI "https://x.rtmx.ai/" | tr -d '\r' | grep -iE 'HTTP/|location:'

# Expect Sync still serves its own stack (not apex from_host redirect)
curl -sI -X GET "https://sync.rtmx.ai/health" | tr -d '\r' | head -5

# Expect www still reaches origin (301/200 to apex), not Worker "Not found"
curl -sI "https://www.rtmx.ai/" | tr -d '\r' | head -5
```

### Probe log (2026-10-26)

Worker deployed; route `*.rtmx.ai/*` live; wildcard `AAAA * → 100::` proxied
created (`218bb3399c4af96cffa0063b1a45e2d0`). `npm run probe`:

```
www.rtmx.ai        → 301 https://rtmx.ai/
sync.rtmx.ai/health → 200 (Google Frontend)
x.rtmx.ai          → 302 https://rtmx.ai/?from_host=x.rtmx.ai
synck.rtmx.ai      → 302 https://rtmx.ai/?from_host=synck.rtmx.ai
randomtypo123.rtmx.ai → 302 https://rtmx.ai/?from_host=randomtypo123.rtmx.ai
```
