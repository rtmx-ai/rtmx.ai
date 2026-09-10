---
title: Using aegis
description: The TUI, the rtmx intent loop, headless drains, decomposition, long-running tasks, and codebase indexing.
---

Once installed, aegis is driven interactively in the TUI or headlessly via `aegis run`. In both modes the
unit of work is an **rtmx requirement**, and done means **the linked test passes**.

## The rtmx intent loop

aegis pulls the next available requirement, claims it, drives the agent to a change, and verifies:

```
next → claim → drive → verify → (green ? close : retry) → escalate/park
```

- `aegis run --once` — one requirement. `aegis run --max 40 --break-after 3` — drain the backlog,
  bounded by a run budget and a circuit breaker.
- `aegis propose LOOP` — human-gated decomposition: emits atomic child requirements in a `proposed`
  state; a human approves before any run.

## Long-running tasks

aegis is tuned so a small local model can sustain long work without wandering:

- **Verify-driven inner loop** — failed test output is fed back verbatim into the next attempt.
- **Sub-task ledger + working memory** — an on-disk TODO ledger and a queryable fact/snippet store,
  re-injected each turn and surviving compaction/resume.
- **Per-edit checkpoints** — a shadow-git snapshot per edit, so a bad change rolls back without losing
  the run.
- **Stuck detection + park** — repetition/monologue/ping-pong are detected and parked, not looped.
- **Per-task budgets + fallback** — inner token/wall-clock caps, and a higher-variance retry before parking.

## Codebase indexing

Retrieval is grep-first and model-free — never an embeddings engine. A ranked, token-budgeted **repo map**
(personalized PageRank over a def/ref graph) puts the right few symbols in the small window, across the
first-class languages (Go, Python, Rust, JS/TS, C#, C/C++, Ruby). A **degradation ladder** picks the best
available tier per language (precise → structural → grep) and never fails.

## CLI reference

`aegis` (TUI) · `aegis run [--once|--max N|--break-after M]` · `aegis propose <CATEGORY>` ·
`aegis verify-env` · `aegis llama-server` · `aegis map`. Flags and config in the canonical docs.

:::note[Canonical docs]
[operator-guide](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/operator-guide.md) · [runbook](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/runbook.md) ·
[rtmx-loop skill](https://github.com/rtmx-ai/aegis-cli/blob/main/skills/rtmx-loop/SKILL.md) · [polyglot-retrieval](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/requirements/polyglot-retrieval.md).
:::
