# RTMX Infrastructure

## Form Proxy Worker

Cloudflare Worker that handles form submissions with reCAPTCHA v3 verification and HubSpot forwarding.

### Install

```bash
cd infra/workers/form-proxy
npm install
```

### Set Secrets

```bash
cd infra/workers/form-proxy
npx wrangler secret put RECAPTCHA_SECRET_KEY
```

You will be prompted to enter the reCAPTCHA v3 secret key.

### Local Development

```bash
cd infra/workers/form-proxy
npm run dev
```

The worker runs at `http://localhost:8787` by default.

### Deploy

```bash
cd infra/workers/form-proxy
npm run deploy
```

### Custom Domain Setup

1. Ensure the `rtmx.ai` zone is active in Cloudflare (account `ff3eb41dd224ff324f1e2cd0b92e6b95`).
2. Add a CNAME record: `forms.rtmx.ai` pointing to `rtmx-forms.<your-subdomain>.workers.dev`.
3. Uncomment the `routes` line in `wrangler.toml`.
4. Redeploy with `npm run deploy`.

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/form-submit` | Submit form with reCAPTCHA verification |

### Form Submission Payload

```json
{
  "formId": "<HubSpot form GUID>",
  "email": "user@example.com",
  "recaptchaToken": "<reCAPTCHA v3 token>"
}
```

Allowed form IDs:
- `2e0b417f-2e5c-4cc8-8441-b1982aac6638` (waitlist)
- `c615fe10-5da1-4b75-aacd-cea7b476d3d3` (newsletter)
