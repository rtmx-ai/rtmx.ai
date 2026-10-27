---
title: Security & Compliance
description: Air-gap guarantees, ITAR posture, signed supply chain, sandboxed execution, audit, and model provenance.
---

Security is aegis's reason to exist. The controls below are enforced by construction and proven in CI —
not asserted in prose.

## Air-gap guarantees

**EGRESS = 0 is a build-failing gate, not a warning.** CI runs a representative command under a
network-denied namespace with packet capture; any non-loopback packet fails the build. OpenCode's own
egress vectors (telemetry, auto-update, the models.dev catalog fetch, provider/plugin installs, LSP
server downloads) are pinned shut via the hardened launch environment.

## Supply chain & signing

- **Signed releases** — every artifact is signed; verify with [minisign](https://jedisct1.github.io/minisign/)
  against the aegis public key before installing.
- **SBOM** — a Software Bill of Materials ships with each release.
- **Offline scanners** — a CI security gate runs gitleaks (secrets), govulncheck (Go vulns), syft (SBOM),
  and gosec (SAST) — all offline; findings fail the build.

## Sandboxed execution

Agent-generated code runs in a locked **bubblewrap** sandbox — no network (kernel namespace, so egress is
impossible by construction), read-only system, one writable workdir — so a run cannot escape or mutate the
host.

## Audit & model provenance

- The audit log is append-only and stays in-enclave: every claim + verify records who/what/when.
- Model provenance is governed by an explicit, auditable country-of-origin policy; a disallowed origin
  fails the build.

:::note[Canonical docs]
[release signing](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/release-signing.md) · [model compliance](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/model-compliance.md) ·
[hardening spec](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/requirements/opencode-aegis-hardening.md) ·
[E2E test suite](https://github.com/rtmx-ai/aegis-cli/blob/main/docs/requirements/e2e-test-suite.md) · [airgap-hygiene skill](https://github.com/rtmx-ai/aegis-cli/blob/main/skills/airgap-hygiene/SKILL.md).
:::
