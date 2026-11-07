---
title: "rtmx 2.0.0 — COMPLETE requires a verifying attestation"
description: "The verification moat ships: agents cannot set COMPLETE without a signed verifier attestation pinned to a commit."
date: 2026-11-07
sidebar:
  order: 1
---

**rtmx 2.0.0** is out:
[GitHub release](https://github.com/rtmx-ai/rtmx/releases/tag/v2.0.0) ·
[CHANGELOG](https://github.com/rtmx-ai/rtmx/blob/main/CHANGELOG.md).

## What changed

Task coordination will be copied. The moat is **deterministic verification
pinned to a commit** — exportable offline, replicated in the Sync room as
evidence, not as a Git host.

From 2.0.0:

- `COMPLETE` requires a verifying attestation signature (requirement, commit
  SHA, command, output hash).
- `rtmx verify --results` alone cannot set COMPLETE.
- `rtmx status` counts COMPLETE only when the signature verifies.
- Local broker, CI, and air-gapped paths share the same rule.

Install:

```bash
brew install rtmx-ai/tap/rtmx
# or: curl -fsSL https://rtmx.ai/install.sh | sh
rtmx version
```

Lifecycle details: [Requirements lifecycle](/docs/reference/lifecycle).
Patterns: [Closed-loop verification](/docs/guides/patterns).
