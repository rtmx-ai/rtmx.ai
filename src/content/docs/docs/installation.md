---
title: Installation
description: Install RTMX and set up your project
---

## Install RTMX

Current release: **[v2.0.1+](https://github.com/rtmx-ai/rtmx/releases/latest)**
([changelog](https://github.com/rtmx-ai/rtmx/blob/main/CHANGELOG.md)).

Every package includes the CLI **and** the verification broker binary.
Package install/upgrade hooks enable the broker when possible. If it is still
missing, the first `rtmx verify` elevates once. Steady-state verify does not
prompt for administrator credentials.

### macOS / Linux (Homebrew)

```bash
brew install rtmx-ai/tap/rtmx
rtmx broker status
```

Homebrew `post_install` runs `rtmx broker install --prefix=…` (Admin may be
requested once). Manual/fleet: `rtmx broker install --prefix="$(brew --prefix rtmx)"`.

### Windows (Scoop)

```bash
scoop bucket add rtmx https://github.com/rtmx-ai/scoop-bucket
scoop install rtmx
```

Enable the broker from an elevated shell if hooks did not (`rtmx broker install`),
or let the first `rtmx verify` request elevation once.

### Install script (Linux / macOS)

```bash
curl -fsSL https://rtmx.ai/install.sh | sh
rtmx broker install   # elevates if needed; or wait for first verify
```

### Direct Binary

Download the latest archive for your platform from
[GitHub Releases](https://github.com/rtmx-ai/rtmx/releases) (contains `rtmx` and
`verify`). Then:

```bash
rtmx broker install   # elevates if needed
```

### Verify Installation

```bash
rtmx version
rtmx broker status
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
