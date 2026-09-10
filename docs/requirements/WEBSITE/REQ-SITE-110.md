# REQ-SITE-110: Private-beta pricing drives Team Sync Checkout

## Metadata
- **Category**: WEBSITE
- **Subcategory**: BILLING
- **Priority**: P0
- **Phase**: 6
- **Status**: MISSING
- **Dependencies**: REQ-SITE-106, REQ-SITE-107, REQ-SITE-109
- **Blocks**: (none)
- **External ID**: rtmx-ai/REQ-MONO-019

## Requirement

For private-beta launch of **managed_sync** (PaaS Team Sync), the
rtmx.ai pricing page SHALL make **hosted Team Sync subscription** the
primary commercial path. Stripe Product Catalog for this phase is
**Team only** (`RTMX_STRIPE_PRICE_MANAGED_SYNC_TEAM`). Enterprise and
On-Prem remain interest / sales-assisted — not Checkout.

The page SHALL NOT present “Sync has not launched / join the waitlist”
as the primary message when Team Checkout is live.

## Rationale

REQ-SITE-105/106 already switched the Team card CTA off waitlist-only
(`Start hosted Team` → `/checkout`). Production still leads with a
waitlist section, “Coming soon” framing, and FAQ copy that tells buyers
Sync is not available. That undoes the private-beta funnel: pay for
Team Sync on rtmx.ai → Stripe → entitle org → use OSS CLI against
`sync.rtmx.ai`.

Enterprise at $29/user/month stays on the page as aspiration / waitlist;
it must not get a Stripe Price or Checkout Session in this phase.

## Acceptance Criteria

1. Team primary CTA is hosted Checkout (`/checkout` or equivalent) for
   `managed_sync`; secondary CTA may remain self-managed `/license`.
2. Enterprise CTA does **not** create a Checkout Session (waitlist or
   contact sales only).
3. On-Prem remains contact sales.
4. Page chrome (badge, hero note, FAQ) states Team Sync is available to
   subscribe; waitlist is not framed as the only way to get Sync.
5. If a waitlist form remains, it is clearly for Enterprise interest /
   newsletter — not the Team buy path (copy distinguishes the two).
6. No production UI implies an Enterprise self-serve Stripe Price exists
   for this launch.

## Test Strategy

- Extend `tests/e2e/checkout.spec.ts` / `licensing.spec.ts`: Team CTA →
  checkout; Enterprise CTA not → checkout; waitlist section (if present)
  does not claim Sync is unlaunched for Team.
- Manual: live `https://rtmx.ai/pricing` after Pages deploy.

## Out of scope

- Enterprise Stripe Price / Checkout
- Hosted SaaS org dashboard auth (REQ-SITE-101+)
- Live-mode Stripe cutover (REQ-MONO-018d / REQ-BILLING-016)

## Effort Estimate

0.5 weeks
