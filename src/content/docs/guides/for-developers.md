---
title: RTMX for Developers
description: Track what you've built, what's tested, and what's next — from the terminal
---

Track what you've built, what's tested, and what's next — from the terminal.

RTMX is a CLI-first requirements traceability tool that lives in your repository alongside your code. No browser tabs, no SaaS logins, no context switching.

## Get Started in 3 Steps

```bash
# 1. Install
brew install rtmx-ai/tap/rtmx

# 2. Initialize in your project
rtmx init

# 3. See where you stand
rtmx status
```

That's it. Your requirements database is now a file in your repo, versioned with git.

:::tip
See the full [Installation guide](/installation) for Debian/Ubuntu and direct binary options.
:::

## Key Features

### CLI-First Workflow

Everything runs from your terminal. Check status, view the backlog, analyze dependencies — no GUI required.

```bash
rtmx status -vv        # Detailed progress
rtmx backlog            # What's next
rtmx deps               # Dependency graph
```

See the full [CLI Reference](/guides/cli-reference) for all available commands.

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

See [Test Markers](/guides/markers) for supported languages and marker syntax.

### MCP for AI Agents

RTMX includes a [Model Context Protocol server](/adapters/mcp) so AI agents can query your project status, view blockers, and update requirements directly.

```bash
rtmx mcp-server         # Start MCP server for AI agent integration
```

### Adapters

Sync requirements with [GitHub Issues](/adapters/github) or [Jira](/adapters/jira). Bootstrap your RTM from existing project artifacts.

```bash
rtmx bootstrap          # Generate RTM from tests, GitHub, or Jira
rtmx sync               # Sync with external trackers
```

## Why Developers Choose RTMX

- **No SaaS dependency** — your data stays in your repo, under your control
- **Works offline** — no network required for any core operation
- **Open source** — Apache 2.0 license, no vendor lock-in
- **Zero configuration** — `rtmx init` and you're running
- **Composable** — integrates with Make, CI/CD, and AI agents

## Next Steps

- [Installation](/installation) — full install instructions for all platforms
- [Quickstart](/quickstart) — end-to-end walkthrough
- [Configuration](/guides/configuration) — customize RTMX for your project
- [Schema](/guides/schema) — understand the requirements data model
