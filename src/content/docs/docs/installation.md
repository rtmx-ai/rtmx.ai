---
title: Installation
description: Install RTMX and set up your project
---

## Install RTMX

Current release: **[v2.0.0+](https://github.com/rtmx-ai/rtmx/releases/latest)**
([changelog](https://github.com/rtmx-ai/rtmx/blob/main/CHANGELOG.md)).

Every package includes the CLI **and** the verification broker binary.

### macOS / Linux (Homebrew)

```bash
brew install rtmx-ai/tap/rtmx
sudo rtmx broker install --prefix="$(brew --prefix rtmx)"
```

### Windows (Scoop)

```bash
scoop bucket add rtmx https://github.com/rtmx-ai/scoop-bucket
scoop install rtmx
```

Then enable the broker with an elevated shell (`rtmx broker install`).

### Install script (Linux / macOS)

```bash
curl -fsSL https://rtmx.ai/install.sh | sh
sudo rtmx broker install
```

### Direct Binary

Download the latest archive for your platform from
[GitHub Releases](https://github.com/rtmx-ai/rtmx/releases) (contains `rtmx` and
`verify`). Then:

```bash
sudo rtmx broker install
```

### Verify Installation

```bash
rtmx version
rtmx broker status
```

`rtmx verify` connects to the already-running broker and never prompts for
administrator credentials.

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
