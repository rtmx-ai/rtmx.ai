# REQ-SITE-111: Marketing leads with multiplayer, not CRDT

## Status: COMPLETE
## Priority: HIGH
## Phase: 6
## Dependencies: REQ-SITE-003, REQ-SITE-110
## External ID: rtmx-ai/REQ-MONO-019

## Requirement

Buyer-facing marketing on rtmx.ai (landing Hero, pricing, Sync CTAs)
SHALL describe RTMX Sync as **multiplayer** collaboration for developers
and their agents — not as a CRDT product.

The primary value proposition SHALL be: a secure multiplayer multi-agent
developer experience across many projects, without living in Jira/Asana
boards or burning tokens to keep an MCP connector synced to a SaaS
project-management / kanban service.

CRDT / y-websocket language MAY remain in technical docs, architecture
notes, and engineering blog deep-dives as implementation detail.

## Rationale

Buyers do not shop for CRDTs. They shop for teams of humans + agents
that can share one live requirements matrix. Leading with the data
structure hides the product.

## Acceptance Criteria

1. [x] Landing page Team Sync / collaboration chrome does not lead with
   “CRDT” in customer-visible copy.
2. [x] Pricing page Sync subtitle, Team features, and FAQ do not require
   knowing what a CRDT is; FAQ answers the multiplayer / anti-board
   story instead.
3. [x] Comparison table “Collaboration” cell describes multiplayer Sync
   (not “CRDT sync”).
4. [x] Copy may still mention secure / encrypted / git-native; adapters to
   Jira etc. are optional bridges, not the Team Sync pitch.

## Test Strategy

- `tests/e2e/multiplayer.spec.ts`

## Effort Estimate

0.25 weeks
