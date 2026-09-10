---
title: Evaluate
description: Why aegis — the business case, how it compares, benchmarks, design decisions, and the roadmap.
---

## Why aegis

Cloud coding agents are off the table where the work is controlled (ITAR/CUI) and the network is closed.
aegis delivers a top-tier agentic loop **inside** that boundary: local model, no egress by construction,
and human-authored, test-linked intent so a small model stays productive and every change is verifiable.

## How it compares

- **vs cloud coding agents** — aegis runs air-gapped with zero egress; no data leaves the enclave.
- **vs vanilla OpenCode** — aegis bundles + hardens OpenCode and adds the intent loop, audit, metrics,
  egress guard, calibration, and packaging a closed distribution needs.
- **vs "just run a local model"** — aegis makes closure verify-driven (tests decide done), not
  vibes-driven, which is what lets a small model succeed on real work.

## Benchmarks

aegis measures itself every CI run: the golden set drives the real loop in a network-captured sandbox and
computes the dashboard (ACR + TCVR/FPVR/MTC/WCR/TCR/ESC). The intent-bench methodology quantifies the lift
the rtmx intent layer provides.

## Design decisions & roadmap

Architecture decisions are recorded as ADRs (e.g., LSP-vs-SCIP for precise navigation, and why aegis
needs no FFI). On the roadmap as metrics-justified upgrades: tree-sitter accuracy for the repo map, SCIP
precise navigation, and a two-quant lead/worker split.

:::note[Canonical docs]
[business case](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/business-case.md) · [intent-bench](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/intent-bench.md) ·
[design decisions](https://github.com/rtmx-ai/aegis-cli/tree/main/docs/decisions).
:::
