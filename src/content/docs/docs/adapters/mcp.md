---
title: MCP Server
description: Add the open-source rtmx CLI to Claude, Cursor, Codex, and other agents via Model Context Protocol
---

The open-source **rtmx** CLI exposes a local MCP server (`rtmx mcp-server --stdio`)
so agents can query status, claim work, and verify requirements. This is the
client side of RTMX — not **RTMX Sync** (the multiplayer room).

Prerequisite: install the CLI (`brew install rtmx-ai/tap/rtmx`, scoop, or
`go install`).

## Add RTMX to your agent (preferred)

Marketplace / one-click install first. Raw JSON is a fallback below.

### Claude Code

```bash
claude plugin marketplace add rtmx-ai/rtmx
claude plugin install rtmx@rtmx
```

Or: `/plugin marketplace add rtmx-ai/rtmx` then `/plugin install rtmx@rtmx`.

### Cursor

One-click MCP install (opens Cursor):

[Add RTMX MCP in Cursor](https://cursor.com/link/mcp?name=rtmx&config=eyJjb21tYW5kIjoicnRteCIsImFyZ3MiOlsibWNwLXNlcnZlciIsIi0tc3RkaW8iXX0%3D) ·
[cursor.directory/plugins/rtmx](https://cursor.directory/plugins/rtmx)

Local plugin dogfood: symlink `plugins/cursor-rtmx` into `~/.cursor/plugins/local/rtmx`
(see the [rtmx Cursor plugin README](https://github.com/rtmx-ai/rtmx/tree/main/plugins/cursor-rtmx)).
Marketplace listing may lag; the deeplink works now.

### Codex

```bash
codex mcp add rtmx -- rtmx mcp-server --stdio
```

Or emit a TOML snippet: `rtmx plugin emit --agents codex`

### Any agent (`rtmx plugin emit`)

```bash
rtmx plugin emit --list
rtmx plugin emit --agents claude,cursor,codex
```

## Fallback: paste MCP config

Only if marketplace / deeplink / emit are unavailable:

```json
{
  "mcpServers": {
    "rtmx": {
      "command": "rtmx",
      "args": ["mcp-server", "--stdio"]
    }
  }
}
```

Claude Code alternative: `claude mcp add rtmx -- rtmx mcp-server --stdio`

## What agents get

Tools from `tools/list` include `status`, `backlog`, `next`, `claim`, `verify`,
`loop_tick`, and related scientific workflow tools. Full contract:
[MCP public contract](https://github.com/rtmx-ai/rtmx/blob/main/docs/MCP_PUBLIC_CONTRACT.md).

Mutations require an `agent_id`. Prefer MCP tools over shelling arbitrary CLI.

## Security

- Stdio MCP runs locally with your project permissions (no public network by default).
- RTM updates land in your local CSV / git; review before commit.
- Hosted Sync rooms are separate — see [RTMX Sync](/sync).
