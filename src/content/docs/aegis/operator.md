---
title: Operator & Air-Gap
description: Deploy aegis into a closed enclave — staging, hardware, serving calibration, provisioning, and day-2 operations.
---

aegis is built to run in a locked enclave with no egress. This section covers standing it up and running
it day to day.

## Deploy into the enclave

aegis ships as a single static binary plus a bundled harness (OpenCode + ripgrep + llama-server). The
model GGUF is staged separately. Everything is side-loaded — nothing is fetched at runtime.

- **Air-gap setup** — offline install, staging the model + ripgrep, egress default-deny.
- **Provisioning** — an in-TUI flow downloads → verifies (sha256) → serves the model, in a network-staged
  environment before the enclave is sealed.

## Hardware

aegis targets memory-bandwidth-bound hosts. Built and validated first on **linux-cpu** (Ryzen 5950X /
64 GB), ready for **darwin-metal** (MBP M-series / 128 GB unified). The binding constraint is memory
bandwidth, so the loop separates generate and verify in time rather than overlapping them.

## Serving & calibration

The inference worker is calibrated to the host — `scripts/bench.sh` sweeps thread/batch (CPU) or batch +
all-layers-on-Metal, and writes `calibration.json`. `internal/serving` loads it at launch and emits the
right flags per target; an uncalibrated launch is a hard error. On linux-cpu it pins inference to physical
cores (`taskset`) and de-prioritises co-located workers (`nice`).

## Day-2 operations

- `aegis run --max N --break-after M` — bounded unattended drain: park-on-escalation, circuit breaker,
  run budget. Escalations **park** (blocked + logged), they do not block waiting for a human.
- `aegis verify-env` — confirm the environment is closed + traceable before a run.
- The audit log is append-only and stays in-enclave.

:::note[Canonical docs]
[air-gap setup](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/airgap-setup.md) · [enclave deployment](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/enclave-deployment.md) ·
[hardware spec](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/hardware-purchase-spec.md) · [readiness](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/readiness.md) ·
[serving-calibration skill](https://github.com/rtmx-ai/aegis-cli/blob/main/skills/serving-calibration/SKILL.md).
:::
