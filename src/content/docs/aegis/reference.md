---
title: Reference
description: Architecture, the control loop, the metrics dashboard, serving internals, and the model corpus.
---

## Architecture

aegis is a static conductor over heavy worker processes: one statically-linked Go binary orchestrating
the inference server, the OpenCode harness, and rtmx — talking over local IPC only. Serving is swappable
behind an OpenAI-compatible endpoint; the harness is swappable behind an adapter. Both are configuration,
not load-bearing assumptions in the loop.

## The control loop

```
next → drive → verify → (retry ≤ N) → escalate/park
```

Resumable (claims survive interruption), with drain, park-on-escalation, circuit breaker, and a run
budget. Verify does not run concurrently with generation — phase separation beats core-partitioning on a
bandwidth-bound host.

## Metrics

The north star is **ACR — Autonomous Completion Rate** (closed-by-verify ÷ attempted, no human step).
The dashboard trends TCVR (tool-call validity), FPVR (first-pass verify), MTC (turns-to-close), WCR
(wall-clock/req), TCR (tokens/req), and ESC (escalation rate). Hard gates: EGRESS = 0, TRACE = 100%, and
no ACR regression.

## Model corpus & bake-off

The default local model (gemma-4-26B-A4B, a ~4B-active MoE) was chosen by bake-off, not assumption —
capability winner within the enclave's constraints. Serving is llama.cpp `llama-server` in production
(from source, no telemetry), Ollama for the spike.

:::note[Canonical docs]
[CLAUDE.md](https://github.com/rtmx-ai/aegis-cli/blob/main/CLAUDE.md) · [model corpus](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/models.md) · [bake-off](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/serve-016-bakeoff.md) ·
[metrics-eval skill](https://github.com/rtmx-ai/aegis-cli/blob/main/skills/metrics-eval/SKILL.md).
:::
