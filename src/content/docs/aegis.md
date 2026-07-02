---
title: aegis — air-gap-native agentic coding
description: aegis-cli brings a top-tier agentic coding experience to closed, air-gapped environments — a hardened OpenCode TUI driven by a local model, with rtmx as the intent layer.
---

**aegis** is an air-gap-native, top-tier agentic coding experience for closed environments. Running
`aegis` launches a hardened **OpenCode TUI** driven by a **local model** (llama.cpp / Ollama, loopback
only), with **rtmx as the intent layer**. It makes zero network calls beyond loopback to the local model
endpoint — *by construction, not by configuration*.

aegis is developed in the open at
[github.com/rtmx-ai/aegis-cli](https://github.com/rtmx-ai/aegis-cli) (Apache-2.0) and is vendored into
this site as a git submodule.

## Why aegis

- **Closed by construction.** No component aegis ships or launches makes a network call beyond loopback
  to the local model. Egress is a build-failing condition, not a warning.
- **Bundle, don't rebuild.** aegis bundles and launches OpenCode (MIT); it does not fork it. It owns the
  air-gap hardening, the rtmx intent loop, audit, metrics, host calibration, and packaging around the
  harness.
- **rtmx is the intent layer.** Work is scoped by human-authored, test-linked rtmx requirements — so a
  small local model succeeds and every change is independently verifiable.

## Install

### macOS (Apple Silicon) / Linux — Homebrew

```bash
brew install rtmx-ai/tap/aegis
```

### Debian / Ubuntu

Download `aegis_<version>_<arch>.deb` from the
[signed GitHub releases](https://github.com/rtmx-ai/aegis-cli/releases), then:

```bash
sudo apt install ./aegis_<version>_amd64.deb
```

The large model GGUF is side-loaded separately — it is too big to package, and an air gap wants it staged
deliberately.

## Verify the download (signed releases)

Every release is signed and ships a Software Bill of Materials (SBOM). Verify the artifact with
[minisign](https://jedisct1.github.io/minisign/) against the aegis public key **before** installing:

```bash
# the signature (.minisig) and the public key ship with each release
minisign -Vm aegis_<version>_amd64.deb -P "$(cat aegis-minisign.pub)"
```

The public key and signing details live at
[github.com/rtmx-ai/aegis-signing](https://github.com/rtmx-ai/aegis-signing).

## Documentation

Full operator, architecture, and air-gap setup docs live in the
[aegis-cli repository](https://github.com/rtmx-ai/aegis-cli) — see its `README.md` and `docs/`. Because
aegis-cli is vendored here as a submodule, those docs travel with this site.
