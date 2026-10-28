---
title: RTMX for Developers
description: Track what you've built, what's tested, and what's next — from the terminal, with optional Sync multiplayer
---

Track what you've built, what's tested, and what's next — from the terminal.

The open-source **rtmx** CLI keeps requirements in git beside your code. Work fully
local when you want; add hosted **RTMX Sync** when humans and agents need a live
multiplayer room. Local RTM never requires a SaaS login.

## Get Started in 3 Steps

```bash
# 1. Install
brew install rtmx-ai/tap/rtmx

# 2. Initialize in your project
rtmx init

# 3. Link an issue store (GitHub, Jira, Asana, Monday, GitLab, or Tests)
rtmx link
# Same picker: rtmx bootstrap   # TTY, no --from-* flags
```

Migrating from a tracker? `rtmx link` (or flagless `rtmx bootstrap` on a TTY) imports issues into your RTM. Prefer flags in CI: `rtmx bootstrap --from-github`. Verify anytime with `rtmx status`.

:::tip
See the full [Installation guide](/docs/installation) for Debian/Ubuntu and direct binary options.
:::

## Key Features

### CLI-First Workflow

Everything runs from your terminal. Check status, view the backlog, analyze dependencies — no GUI required for local RTM.

```bash
rtmx status -vv        # Detailed progress
rtmx backlog            # What's next
rtmx deps               # Dependency graph
```

See the full [CLI Reference](/docs/guides/cli-reference) for all available commands.

### Git-Native

Your requirements database is a file in your repo. Branch it, merge it, diff it, review it in PRs — the same workflow you already use for code.

```bash
rtmx diff               # Compare RTM versions across branches
```

### Test Markers

Link tests directly to requirements with markers in your test files. RTMX scans your test suite and updates traceability automatically.

```bash
rtmx from-tests         # Scan tests for requirement markers
```

See [Test Markers](/docs/guides/markers) for supported languages and marker syntax.

### MCP for AI Agents

The **rtmx** CLI includes a [Model Context Protocol server](/docs/adapters/mcp) so agents can query status, claim work, and verify requirements. Prefer marketplace / one-click install:

```bash
claude plugin marketplace add rtmx-ai/rtmx && claude plugin install rtmx@rtmx
codex mcp add rtmx -- rtmx mcp-server --stdio
```

Cursor: use the [MCP deeplink on the adapters page](/docs/adapters/mcp). Fallback: `rtmx plugin emit --agents cursor`.

### Adapters and Sync rooms

Connect [project-management adapters](/docs/adapters/project-management) (GitHub, Jira, Asana, Monday, GitLab), or join a managed Sync room for live collaboration.

```bash
rtmx link               # Guided picker → bootstrap from an issue store
rtmx bootstrap --from-github   # Non-interactive / CI
rtmx sync               # Join a Sync room (after rtmx login)
```

## Why Developers Choose RTMX

- **Local by default** — CSV in git; core CLI works offline without a hosted account
- **Optional Sync** — multiplayer rooms when the team (and agents) need a shared live backlog
- **Open source client** — Apache 2.0 CLI, no vendor lock-in for local RTM
- **Zero configuration** — `rtmx init` and you're running
- **Composable** — integrates with Make, CI/CD, and AI agents

## Next Steps

- [Installation](/docs/installation) — full install instructions for all platforms
- [Quickstart](/docs/quickstart) — end-to-end walkthrough
- [Configuration](/docs/guides/configuration) — customize RTMX for your project
- [Schema](/docs/guides/schema) — understand the requirements data model
- [RTMX Sync](/sync) — hosted multiplayer rooms and trial
