# Show HN: RTMX – Git-native requirements traceability for AI-assisted development

**Title**: Show HN: RTMX – Track what you built, what's tested, and what's next, from the terminal

**URL**: https://github.com/rtmx-ai/rtmx-go

---

## Post Text

I spent a year cleaning up after AI agents. They write code fast, but they build the wrong thing. The fix wasn't better prompts — it was giving agents a queryable, verifiable requirements model that lives in git.

RTMX is a CLI tool that manages a requirements traceability matrix (RTM) as a CSV file in your repo. Every requirement has an ID, a spec, and linked tests. Status isn't manually updated — it's derived from test results. If the tests pass, the requirement is complete. If they don't, you know exactly what's broken.

**What it does:**

- `rtmx status` — see completion across all requirements and phases
- `rtmx backlog` — prioritized work items with dependency-aware critical path
- `rtmx verify` — cross-language test verification (Python pytest, Go testing)
- `rtmx health` — validate your RTM for orphaned tests, missing specs, circular dependencies
- MCP server — AI agents (Claude, Cursor) can query your requirements in real-time

**Why CSV in git?**

- Human-readable diffs in PRs
- Works offline, air-gapped, on any machine
- AI agents can parse it without an API
- No SaaS, no database, no vendor lock-in
- `git blame` tells you when and why every requirement changed

**Technical details:**

- Single static binary, zero runtime dependencies (Go, CGO_ENABLED=0)
- Linux, macOS, Windows — amd64 and arm64
- 2 external dependencies total (Cobra + YAML parser)
- GPG-signed releases with SBOM
- Apache 2.0

**The part I'm most proud of:** RTMX manages its own requirements. The RTM for RTMX is tracked by RTMX — 68+ requirements, auto-verified in CI, with dependency graphs and critical path analysis running on every push.

I built this because I needed it. I work on defense software and radar systems where requirements traceability isn't optional. But even for teams that don't need compliance, knowing which requirements have passing tests and which are blocked is transformative when you have AI agents writing code all day.

Install: `brew install rtmx-ai/tap/rtmx` or grab a binary from releases.

Docs: https://rtmx.ai

I'd love feedback on:
- The CLI design and workflow
- Whether the CSV-in-git approach makes sense for your team
- What integrations would make this useful for you
- Use cases I haven't considered

---

## Timing

Post on a Tuesday or Wednesday, 8-10am ET (peak HN traffic).

## Response Strategy

- Monitor for the first 6 hours minimum
- Respond to every substantive comment
- Be honest about limitations (Sync not ready, early stage)
- Capture feedback as GitHub issues tagged `community-feedback`
- Common questions to prepare for:
  - "Why not Jira?" → Different category. RTMX is traceability, not project management. They work together.
  - "How does this scale?" → CSV works fine for hundreds of requirements. Thousands would need indexing.
  - "What about non-Python/Go?" → Test markers planned for Java, TypeScript, Rust. Results JSON format is language-agnostic.
  - "Why Go?" → Single static binary, fast startup, cross-platform. Python CLI still available for pytest plugin.
  - "Is this just for AI teams?" → No. Any team doing TDD benefits. AI workflows just make it more urgent.

## Cross-posting (after HN settles)

- Reddit: r/programming, r/golang, r/commandline
- Dev.to: Longer-form article version
- LinkedIn: Professional angle for enterprise/defense audience
