---
title: Installation
description: Install RTMX and set up your project
---

## Install RTMX

Current release: **[v2.0.0](https://github.com/rtmx-ai/rtmx/releases/tag/v2.0.0)**
([changelog](https://github.com/rtmx-ai/rtmx/blob/main/CHANGELOG.md)).

### macOS / Linux (Homebrew)

```bash
brew install rtmx-ai/tap/rtmx
```

### Windows (Scoop)

```bash
scoop bucket add rtmx https://github.com/rtmx-ai/scoop-bucket
scoop install rtmx
```

### Install script (Linux / macOS)

```bash
curl -fsSL https://rtmx.ai/install.sh | sh
```

### Direct Binary

Download the latest binary for your platform from
[GitHub Releases](https://github.com/rtmx-ai/rtmx/releases).

### Verify Installation

```bash
rtmx version
```

## Development Installation

For contributing to RTMX:

```bash
git clone https://github.com/rtmx-ai/rtmx.git
cd rtmx
make build     # Build from source
make test      # Run tests
```

## Python package (retired)

The PyPI `rtmx` package reached end-of-life on 2026-09-25. Uninstall it and use
the Go binary above:

```bash
pip uninstall rtmx
brew install rtmx-ai/tap/rtmx   # or Scoop / install.sh / GitHub release
```
