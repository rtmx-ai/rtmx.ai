# REQ-SITE-110: Private-beta pricing drives Team Sync Checkout

## Status: COMPLETE
## Priority: P0
## Phase: 6
## Dependencies: REQ-SITE-106, REQ-SITE-107, REQ-SITE-109
## External ID: rtmx-ai/REQ-MONO-019

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
(`Start hosted Team` → `/checkout`). Waitlist-first chrome undid the
private-beta funnel. Closed together with REQ-SITE-111 (multiplayer
messaging).

## Acceptance Criteria

1. [x] Team primary CTA is hosted Checkout (`/checkout`) for
   `managed_sync`; secondary CTA remains self-managed `/license`.
2. [x] Enterprise CTA does **not** create a Checkout Session (waitlist).
3. [x] On-Prem remains contact sales (mailto until REQ-SITE-113;
      then `/contact` form — not Checkout).
4. [x] Page chrome states Team Sync is available; waitlist is not the
   Team buy path.
5. [x] Waitlist form is Enterprise interest / newsletter copy.
6. [x] No production UI implies an Enterprise self-serve Stripe Price.

## Test Strategy

- `tests/e2e/checkout.spec.ts` — Team Checkout vs Enterprise/On-Prem
- `tests/e2e/multiplayer.spec.ts` — waitlist reframed; Team available

## Out of scope

- Enterprise Stripe Price / Checkout
- Full SaaS rooms dashboard (REQ-SITE-103/104)
- Self-serve OAuth → key → Checkout without ops paste (REQ-MONO-020 /
  REQ-SITE-112); private beta still uses RUNBOOK §5 interim keys
- Live-mode Stripe cutover (REQ-MONO-018d / REQ-BILLING-016)

## Effort Estimate

0.5 weeks
