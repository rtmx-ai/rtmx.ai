---
title: "RTMX vs Other Tools"
description: "How RTMX compares to Jira, Linear, GitHub Projects, and other requirements management tools"
---

## RTMX vs Jira

**What Jira does well:** Project management, sprint planning, team workflows, massive ecosystem of plugins.

**Where RTMX differs:**
- RTMX stores requirements in CSV in git — Jira stores in a centralized SaaS database
- RTMX derives status from test results — Jira relies on manual status updates
- RTMX is local-first and works offline — Jira requires internet
- RTMX tracks requirement-to-test traceability — Jira tracks tasks and stories

**When to use both:** Use Jira for sprint planning and team coordination. Use RTMX for requirements traceability and test linkage. RTMX can sync to Jira via the Jira adapter.

## RTMX vs Linear

**What Linear does well:** Fast, clean UI, keyboard-driven, excellent for issue tracking.

**Where RTMX differs:**
- RTMX is a requirements traceability matrix, not an issue tracker
- RTMX links requirements to tests across Python, Go, Java, TypeScript
- RTMX supports dependency graphs with cycle detection and critical path analysis
- Linear is SaaS-only — RTMX works offline, air-gapped, and self-hosted

**When to use both:** Use Linear for day-to-day issue tracking. Use RTMX when you need formal requirements traceability for compliance or AI agent governance.

## RTMX vs GitHub Projects

**What GitHub Projects does well:** Native integration with GitHub Issues and PRs, free, familiar.

**Where RTMX differs:**
- RTMX provides formal requirements traceability (IDs, specs, test linkage)
- RTMX tracks status from test results, not board column position
- RTMX supports dependency analysis, critical path, and health checks
- GitHub Projects is a Kanban/table view — RTMX is a verification-driven RTM

**When to use both:** Use GitHub Projects for PR/issue workflow. Use RTMX as the traceability layer that connects requirements to code to proof.

## RTMX vs Cucumber/BDD Frameworks

**What Cucumber does well:** Executable specifications in Gherkin, great for BDD workflows.

**Where RTMX differs:**
- Cucumber executes feature files — RTMX manages the requirements register
- RTMX tracks which requirements have linked tests across any test framework
- RTMX provides dependency graphs, backlog prioritization, and health checks
- RTMX works with pytest, Go testing, JUnit, Vitest — not just Cucumber

**When to use both:** Use Cucumber for BDD scenario execution. Use RTMX to track which requirements those scenarios verify and what's still missing.

## Summary

| Concern | Best Tool |
|---------|-----------|
| Sprint planning & team workflow | Jira, Linear |
| Issue tracking & PR workflow | GitHub Projects |
| BDD scenario execution | Cucumber, pytest-bdd |
| Requirements traceability & verification | **RTMX** |
| AI agent governance | **RTMX** (via MCP) |

RTMX works *alongside* these tools. It's the traceability layer, not a replacement for project management.
