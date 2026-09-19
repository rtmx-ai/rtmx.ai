# REQ-SITE-113: Sales-assisted CTAs use a contact form

## Metadata
- **Category**: WEBSITE
- **Subcategory**: MARKETING
- **Priority**: HIGH
- **Phase**: 7
- **Status**: MISSING
- **Dependencies**: REQ-SITE-021, REQ-SITE-106, REQ-SITE-110
- **Blocks**: (none)

## Requirement

rtmx.ai SHALL route **sales-assisted** commercial interest (Enterprise,
On-Prem, and equivalent “contact sales” CTAs) to an on-site **contact
form**, not to `mailto:sales@rtmx.ai`.

The form SHALL collect enough context for sales follow-up (email plus
intent and optional name, company, and message), verify submissions with
the existing reCAPTCHA + `forms.rtmx.ai` proxy, and forward to HubSpot.

## Rationale

Mailto CTAs dump buyers into a mail client, lose structured intent, and
contrast poorly in the theme. A form keeps the journey on rtmx.ai, matches
the waitlist/newsletter pattern (REQ-SITE-013/021), and gives sales a
consistent HubSpot pipeline. Team self-serve Checkout remains unchanged
(REQ-SITE-110 / REQ-SITE-112).

## Acceptance Criteria

1. [x] `/contact` exists with fields: email (required), name, company,
      intent (`enterprise` | `on-prem` | `general`), message; validation,
      loading, and success/error states (parity with SITE-021).
2. [x] Query `?intent=` preselects the intent control when present.
3. [x] Pricing **On-Prem** and **Enterprise** commercial CTAs link to
      `/contact` (with intent), not Checkout and not `mailto:sales@…`.
4. [x] Checkout, license, and billing/manage “sales-assisted” /
      “contact sales” links go to `/contact`, not mailto.
5. [x] Docs and About commercial “contact sales” / `sales@rtmx.ai`
      acquisition links go to `/contact` (engineering `dev@` / help
      mailto may remain).
6. [x] `forms.rtmx.ai` accepts a dedicated sales HubSpot form id and
      forwards email plus optional name, company, intent, and message.
7. [x] Playwright: sales CTAs resolve to `/contact`; form validates;
      submit success path is mockable (no live HubSpot required in CI).

## Out of Scope

- Changing Team Checkout or self-managed `/license` buy paths
- Replacing newsletter / Enterprise interest waitlist email capture
  (may later consolidate onto `/contact`)
- Building an authenticated account dashboard (REQ-SITE-101+)
- Live HubSpot form GUID provisioning (ops: create form, set
  `HUBSPOT_FORM_GUID_SALES`, set `PUBLIC_RTMX_SALES_FORM_ID`)

## Files to create / modify

- `docs/requirements/WEBSITE/REQ-SITE-113.md` (this file)
- `docs/rtm_database.csv`
- `src/pages/contact.astro` (new)
- `src/pages/pricing.astro`, `checkout.astro`, `license.astro`,
  `billing/manage.astro`, `about.astro`
- `src/content/docs/guides/for-enterprise.md`, `for-defense.md`
- `infra/workers/form-proxy/src/index.ts` (+ tests, wrangler notes)
- `tests/e2e/contact.spec.ts` (new); update `checkout.spec.ts`,
  `licensing.spec.ts`

## Test Strategy

- Worker unit tests for multi-field sales submit allowlist
- Playwright on `/contact` and CTA hrefs from pricing/checkout

## Effort Estimate

1.0 week (page + CTA sweep + form-proxy + E2E; HubSpot GUID is ops)
