---
title: "Show HN: RTMX -- What I Built to Stop AI Agents from Building the Wrong Thing"
description: "RTMX is a CLI that manages requirements traceability as CSV in git. It gives AI agents a verifiable, queryable model of what to build -- and proof that they built it."
---

This is the companion post to our [Show HN submission](https://github.com/rtmx-ai/rtmx). If you came from Hacker News, welcome. This is the longer version of the story.

## The Problem

AI agents write code fast. They also build the wrong thing.

Not wrong in a "the code has bugs" way -- wrong in a "this isn't what I asked for" way. The agent generates its own task list, spins up its own context, and executes against that context instead of yours. The codebase grows in directions you didn't authorize. You spend more time cleaning up than you saved.

I wrote about this problem in [Back to Basics](/blog/back-to-basics). The short version: the fix isn't better prompts. It's giving agents a verifiable requirements model that lives where the code lives.

RTMX is that model.

## What RTMX Does

RTMX is a CLI tool that manages a requirements traceability matrix (RTM) as a CSV file in your git repository. Every requirement has an ID, a specification, linked tests, and dependencies. Status is derived from test results -- not manually updated.

Here's what a typical session looks like.

### See where you are

```
$ rtmx status
```

The status command shows completion across all requirements and phases. Progress bars, phase breakdowns, completion percentages -- everything derived from your test results.

### Pick what to work on next

```
$ rtmx next --one

REQ-AUTH-003  TOTP-based MFA support
  Priority: HIGH | Phase: 2 | Effort: 2.0w
  Blocked by: nothing
  Blocks: REQ-AUTH-004
```

The `next` command analyzes your dependency graph, finds independent work webs (groups of requirements connected by dependencies), and picks the highest-priority unblocked requirement. This is the command that makes AI agent workflows practical -- the agent doesn't need a human to triage and assign work.

### Verify your tests

```
$ rtmx verify
```

The verify command runs your test suite and cross-references the results against your requirements. It auto-detects your test framework -- Go, Python/pytest, Rust/Cargo, Node.js, Java/Gradle, Java/Maven, Elixir, Swift, Dart, Ruby. Ten frameworks, zero configuration.

When tests pass, requirement status updates. When they fail, you know exactly which requirement is broken.

### Check your RTM health

```
$ rtmx health
```

Health validates your entire RTM: orphaned tests that don't link to requirements, requirements with no tests, circular dependencies, stale references, schema violations. Think of it as a linter for your requirements.

### Give AI agents direct access

```
$ rtmx mcp-server
```

The MCP server exposes ten tools over JSON-RPC that AI agents (Claude Code, Cursor, or any MCP-compatible client) can call directly: `status`, `backlog`, `next`, `verify`, `health`, `markers`, `deps` for querying, plus `claim`, `release`, and `release_assign` for multi-agent coordination with atomic locking.

## Why CSV in Git

This is the question everyone asks. The answer is simpler than you'd expect.

**Human-readable diffs.** When a requirement moves from "missing" to "complete," the PR diff shows exactly one line changed. Your team reviews requirement changes the same way they review code changes.

**Works everywhere.** CSV needs no runtime, no database, no API. It works offline, air-gapped, on any machine. It opens in any spreadsheet application if someone on your team prefers that view.

**AI agents can parse it.** No API client, no authentication, no SDK. The agent reads a file. This matters more than it sounds -- every layer of indirection between the agent and the requirements is a layer where context can be lost.

**Git gives you everything else for free.** `git blame` tells you when and why every requirement changed. `git log` gives you the full audit trail. Branching lets you prototype requirement changes without affecting main. You already have backup, access control, and collaboration -- because you already use git.

**It scales far enough.** CSV works comfortably for hundreds of requirements. RTMX manages its own development with 230 requirements, and performance is not a concern. If you have thousands of requirements, you probably need a database. But most projects don't have thousands of requirements -- they have dozens to hundreds, and CSV handles that range cleanly.

## The AI Workflow

This is where RTMX changes how you work with agents. The loop is:

1. **`rtmx next --one`** -- the agent picks the highest-priority unblocked requirement.
2. **Read the spec** -- the agent reads the requirement text and acceptance criteria.
3. **Write code and tests** -- the agent implements against the spec, with test annotations linking back to the requirement ID.
4. **`rtmx verify`** -- tests run, results cross-referenced, status updated automatically.
5. **`rtmx status`** -- the team sees progress.

No human had to triage, assign, or update a ticket. The agent worked against the requirements model, not its own generated context. The tests prove the work was done. The status reflects reality.

This loop runs in my `CLAUDE.md`. When I start a session, the agent knows to check `rtmx next` before doing anything else. When it finishes a requirement, it verifies before moving on. The requirements model is the single source of truth for what to build, and the test results are the single source of truth for what's done.

## The Part I'm Most Proud Of

RTMX manages its own requirements. The RTM for RTMX is tracked by RTMX -- 230 requirements across 25 phases, auto-verified in CI, with dependency graphs and critical path analysis running on every push.

This isn't a marketing gimmick. It's how I actually develop the tool. When I start a session, I run `rtmx next --one` against RTMX's own database to decide what to build. When I ship a feature, `rtmx verify` confirms the requirement is satisfied. The tool is its own best test case.

## Technical Details

- **Single static binary.** Zero runtime dependencies. Go with `CGO_ENABLED=0`.
- **Cross-platform.** Linux, macOS, Windows -- amd64 and arm64.
- **Two external dependencies.** Cobra (CLI framework) and a YAML parser. That's it.
- **GPG-signed releases** with SBOM for supply chain verification.
- **Apache 2.0** licensed. The CLI is fully featured with nothing gated.

## Install

```bash
brew install rtmx-ai/tap/rtmx    # macOS / Linux (Homebrew)
scoop install rtmx                # Windows (Scoop)
go install github.com/rtmx-ai/rtmx/cmd/rtmx@latest
```

Or download a binary from [GitHub releases](https://github.com/rtmx-ai/rtmx/releases).

## What's Next

I built RTMX because I needed it. I work on defense software where requirements traceability isn't optional. But the problem it solves -- agents building the wrong thing -- is universal. Any team doing TDD benefits from knowing which requirements have passing tests and which are blocked. AI workflows just make it more urgent.

I'd like feedback on:
- The CLI design and workflow
- Whether CSV-in-git makes sense for your team
- What integrations would be useful
- Use cases I haven't considered

Source: [github.com/rtmx-ai/rtmx](https://github.com/rtmx-ai/rtmx)
Docs: [rtmx.ai](https://rtmx.ai)

---

*Ryan McLean builds tools for agentic engineering. Previously, he led the scaling of the Team Awareness Kit ([TAK.gov](https://tak.gov)) across the U.S. federal government and allied nations.*
