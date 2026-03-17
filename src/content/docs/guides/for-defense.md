---
title: RTMX for Defense & Government
description: Requirements traceability purpose-built for regulated, classified, and air-gapped environments
---

Requirements traceability purpose-built for regulated, classified, and air-gapped environments.

RTMX provides auditable, git-native requirements traceability with zero external dependencies — designed for environments where data sovereignty, offline operation, and compliance are non-negotiable.

## Key Capabilities

### Air-Gap Ready

RTMX operates entirely offline. The core tool is a single binary with no network dependencies, no telemetry, and no phone-home behavior. Air-gapped deployment is supported via [Zarf](https://zarf.dev/) for containerized environments.

### ITAR/EAR Compatible

All data stays in your repository on your infrastructure. RTMX does not transmit, store, or process data externally. Self-hosted and air-gapped deployments ensure compliance with export control regulations.

### FIPS 140-3 Cryptography

RTMX Sync will support FIPS 140-3 validated cryptographic modules for environments requiring certified encryption.

### Zero External Dependencies

The RTMX CLI is a statically compiled binary. No runtime dependencies, no package managers, no network access required. Deploy it on any Linux, macOS, or Windows system.

## Compliance Alignment

| Framework | Status |
|-----------|--------|
| **CMMC 2.0 Level 2** | Aligned — supports practice areas for asset management, audit, and configuration management |
| **NIST 800-53 Rev 5** | Mapped — control families for AU, CM, SA, and SI |
| **DoD IL4/IL5** | On roadmap for RTMX Sync |
| **FedRAMP** | On roadmap for RTMX Sync managed service |

:::note
Full compliance documentation and authorization packages will be available with the launch of RTMX Sync. Contact us for current compliance posture details.
:::

## Deployment Options

### Self-Hosted

Deploy RTMX on your own infrastructure with full control over the environment, data, and access.

### GovCloud

RTMX Sync will support deployment to government cloud regions:

- AWS GovCloud (US)
- Azure Government
- Google Cloud for Government

### Air-Gapped

For classified and disconnected environments:

- Single binary deployment — no package manager or network required
- Offline license validation — no call-home
- Zarf-based deployment for Kubernetes environments
- Full functionality without any external connectivity

## Security

### Encryption

- **Data at rest** — AES-256-GCM encryption for RTMX Sync
- **Data in transit** — TLS 1.3 minimum for all network communication
- **Post-quantum cryptography** — on the roadmap for future-proofed encryption

### Access Control

- Role-based access control (RBAC) with least-privilege defaults
- Immutable audit logs for all operations
- SSO/SAML integration (coming with RTMX Sync)

### Supply Chain

- Signed releases with verifiable checksums
- SBOM (Software Bill of Materials) available for all releases
- Minimal dependency footprint — statically compiled Go binary

## Integration

RTMX integrates with existing defense and government development workflows:

- **CI/CD pipelines** — `rtmx status` and `rtmx diff` in your build pipeline
- **GitHub / Jira** — sync with [GitHub Issues](/adapters/github) or [Jira](/adapters/jira)
- **AI Agents** — [MCP server](/adapters/mcp) for AI-assisted requirements management
- **Make** — first-class Makefile integration for reproducible builds

## Why Defense Teams Choose RTMX

- **Air-gap native** — full functionality with zero network access
- **Git-native audit trail** — immutable, versioned, and reviewable
- **No SaaS dependency** — Apache 2.0 open source, no vendor lock-in
- **Developer-friendly** — CLI-first tool that fits existing workflows
- **Compliance-ready** — built with NIST, CMMC, and DoD frameworks in mind

## Next Steps

- [Installation](/installation) — deploy RTMX in your environment
- [CLI Reference](/guides/cli-reference) — full command documentation
- [Architecture](/reference/architecture) — understand the system design
- [Patterns](/guides/patterns) — requirements management patterns for complex programs

:::tip[Defense & Government Inquiries]
Contact [sales@rtmx.ai](mailto:sales@rtmx.ai?subject=Defense%20Inquiry) for classified environment support, compliance documentation, and deployment assistance.
:::
