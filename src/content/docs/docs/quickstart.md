---
title: Quickstart
description: Install the RTMX client and join a Sync room in minutes
---

Install the open-source client to enter Sync rooms. Local setup below gets you
a workspace RTM; sign in with `rtmx login` when you are ready for hosted Sync.
If your managed session expires and you use Google or Microsoft, try
`rtmx login --silent --provider google` before a full interactive login.

## 1. Set up RTMX in your project

```bash
rtmx init
# or: rtmx setup   # fuller scaffolding (Makefile, agent configs)
```

`rtmx init` creates `.rtmx/` (database, config, requirements). On a TTY it can
offer `rtmx link` next; use `--yes` to skip prompts.

For existing projects with `rtmx setup`, use `--branch` to review changes before merging:

```bash
rtmx setup --branch    # Creates a git branch for review
rtmx setup --pr        # Creates branch + opens PR
```

## 2. Link an issue store (tracker migrants)

If you already track work in GitHub, Jira, Asana, Monday, or GitLab:

```bash
rtmx link              # Interactive picker (TTY); infers GitHub/GitLab from git remotes
rtmx bootstrap --from-github   # CI / non-TTY
```

See [RTMX for Developers](/docs/guides/for-developers) for the three-step path.

## 3. Check your status

```bash
rtmx status -v    # Verbose output with category breakdown
rtmx status -vv   # Very verbose with requirement details
rtmx status -vvv  # Maximum detail
```

## 4. See what to work on next

```bash
rtmx backlog
```

The backlog shows requirements sorted by priority and phase, with dependency information.

## 5. Run health checks

```bash
rtmx health
```

Health checks verify:
- RTM database can be loaded
- All requirement IDs are valid
- Dependencies reference existing requirements
- Test files and functions exist

## 6. Link tests to requirements

```python
import pytest

@pytest.mark.req("REQ-AUTH-001")
@pytest.mark.scope_unit
def test_oauth_login():
    """Validates REQ-AUTH-001: OAuth 2.0 authentication."""
    assert authenticate_user(token) == expected_user
```

Then scan your tests:

```bash
rtmx from-tests
```

## Using the Makefile

After `rtmx setup`, you get these Makefile targets:

```bash
make rtm       # Quick status check
make backlog   # See what's next
make health    # Run health checks
```

## Next Steps

- [CLI Reference](/guides/cli-reference) — All available commands
- [Test Markers](/guides/markers) — language matrix (Go, Python, Rust, JS, …)
- [Schema](/guides/schema) — RTM database schema
- [MCP Server](/docs/adapters/mcp) — AI agent integration
