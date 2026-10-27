---
title: RTMX for Enterprise
description: Requirements traceability that lives in your codebase, not a separate SaaS
---

Requirements traceability that lives in your codebase, not a separate SaaS.

RTMX gives engineering organizations a lightweight, auditable requirements traceability system that integrates directly into existing development workflows. No separate tool to maintain, no data migration, no SaaS dependency.

## Enterprise Features

### Identity and Access

- **OAuth sign-in** — GitHub and Google on managed Sync today
- **SSO / SAML** — enterprise IdP (Okta, Azure AD, and similar) on the Enterprise Sync roadmap
- **SCIM 2.0 provisioning** — mint org-scoped Bearers from organization admin; register your IdP with the [SCIM IdP runbook](/docs/guides/scim-idp)
- **Role-based access control (RBAC)** — org- and room-scoped roles on Sync
- **Immutable audit logs** — every change tracked with full provenance; org
  admins review recent SCIM and `credential.issue` events on the
  [organization audit log](/docs/guides/audit-admin) panel (process-lifetime
  retention on Sync today)

:::note
SAML/OIDC SSO and advanced IAM ship with Enterprise Sync. Managed Sync already supports OAuth sign-in, org isolation, and SCIM Bearer minting. [Contact sales](/contact) for IdP setup and enterprise access.
:::

### Compliance

RTMX is designed to support compliance frameworks common in regulated industries:

- **NIST 800-53 Rev 5** — control mapping for security and privacy
- **CMMC 2.0** — support for Cybersecurity Maturity Model Certification
- **FedRAMP** — on the roadmap for RTMX Sync managed service
- **Audit-ready traceability** — requirements linked to tests, code, and decisions

### Deployment Options

| Model | Description |
|-------|-------------|
| **Cloud Managed** | Hosted RTMX Sync (`sync.rtmx.ai`) — trial and Team plans |
| **Self-Hosted** | Deploy on your infrastructure |
| **GovCloud** | AWS, Azure, or GCP government regions |
| **Air-Gapped** | Fully offline with no external dependencies |

### Data Residency

Your requirements database is a file in your repository. For organizations with strict data residency requirements, self-hosted and air-gapped deployments ensure data never leaves your infrastructure.

## Integration

RTMX connects to the tools your teams already use:

- **Project management** — sync via the [PM adapters hub](/docs/adapters/project-management) (GitHub, Jira, Asana, Monday, GitLab); diff RTMs in pull requests
- **MCP for AI Agents** — enable AI-assisted development with the [MCP server](/docs/adapters/mcp)
- **CI/CD** — integrate `rtmx status` and `rtmx diff` into your pipeline
- **Make** — first-class Makefile targets for build automation

### Bootstrap from Existing Data

Already tracking requirements in GitHub or Jira? Bootstrap your RTM from existing artifacts:

```bash
rtmx bootstrap          # Generate RTM from tests, GitHub, or Jira
```

## Why Enterprise Teams Choose RTMX

- **No SaaS lock-in** — Apache 2.0 open source, data stays in your repo
- **Developer adoption** — CLI-first tool developers actually want to use
- **Git-native audit trail** — every change versioned, branched, and reviewable
- **Low overhead** — no dedicated admin, no separate infrastructure for the core tool
- **Scalable** — works for a single repo or across an organization

## Next Steps

- [Installation](/installation) — deploy RTMX across your organization
- [CLI Reference](/guides/cli-reference) — full command documentation
- [Configuration](/guides/configuration) — customize for your workflows
- [Architecture](/reference/architecture) — understand the system design

:::tip[Enterprise Inquiries]
Contact [sales](/contact) for enterprise licensing, support plans, and deployment assistance.
:::
