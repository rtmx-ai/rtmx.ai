---
title: Installation
description: Install RTMX and set up your project
---

## Install RTMX

### macOS / Linux (Homebrew)

```bash
brew install rtmx-ai/tap/rtmx
```

### Debian / Ubuntu

```bash
apt install rtmx
```

### Direct Binary

Download the latest binary for your platform from [GitHub Releases](https://github.com/rtmx-ai/rtmx-go/releases).

### Verify Installation

```bash
rtmx --version
```

## Development Installation

For contributing to RTMX:

```bash
git clone https://github.com/rtmx-ai/rtmx-go.git
cd rtmx-go
make build     # Build from source
make test      # Run tests
```

## Python Distribution

RTMX is also available as a Python package with additional integrations:

```bash
pip install rtmx
```

### Optional Python Dependencies

```bash
# GitHub integration
pip install rtmx[github]

# Jira integration
pip install rtmx[jira]

# Web UI dashboard (rtmx serve)
pip install rtmx[web]

# Terminal UI (rtmx tui)
pip install rtmx[tui]

# Rich formatting for status output
pip install rtmx[rich]

# MCP server for AI agent integration
pip install rtmx[mcp]

# All optional dependencies
pip install rtmx[all]
```
