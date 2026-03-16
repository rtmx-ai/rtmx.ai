---
title: "I Spent a Year Cleaning Up After AI Agents. Then I Went Back to Basics."
---

I started working with GitHub Copilot a year ago, migrated to agentic AI tools last summer, and started building real products with AI last fall. That's when the problems started.

The agents build fast, but they build the wrong thing. They diverge from the plan. They generate their own task lists, their own Markdown files, their own context — and then execute against that context instead of mine. The knowledge architecture that's supposed to govern what the AI implements bloats, drifts, and eventually becomes impossible to govern.

I'd spend hours or days framing requirements, writing feature specs, and refining the intent of what I wanted to build. Then the agent would lay down code that was adjacent to what I asked for but not quite right. Testability was hit or miss. The codebase would grow in directions I didn't authorize. I'd spend more time cleaning up after the agent than I saved by using it.

That's when I realized the need to bring quality left and integrate it through the entire agentic engineering lifecycle. I suspect this is a familiar experience for anyone who's moved past the "wow, it wrote a function" phase and into trying to build something sustainable with agentic AI.

## Back to Basics

So I went back to the fundamentals. Not the AI fundamentals — the software engineering fundamentals. The practices that humans developed over the past 40 years to keep complex projects coherent: test-driven development, behavior-driven development, pre-commit checks, dependency analysis, in-code annotations, requirements traceability. The stuff that keeps a knowledge architecture organized and a roadmap on track.

The insight was simple and, in retrospect, obvious: these practices aren't obsolete in the agentic era. They're more important. An AI agent moves faster than a human developer, which means the consequences of drift compound faster. When an agent builds the wrong thing at human speed, you lose an afternoon. When it builds the wrong thing at agent speed, you lose a week — and inherit a codebase that's harder to fix than it would have been to write correctly in the first place.

The answer to AI building the wrong thing isn't better AI. It's better engineering discipline applied to AI. That's what I built RTMX to do.

## What RTMX Is

RTMX is an open-source requirements traceability tool built for agentic workflows. It's the contract between human intent and AI agent execution — the same way epics and stories serve as contracts between a business and its developers.

The mechanics are deliberately simple. Your requirements live in a CSV file in git, right next to your code. Each requirement has an ID, a specification, a status, and dependencies. Tests link to requirements through in-code annotations — `@pytest.mark.req("REQ-AUTH-001")` in Python, `@Req("REQ-AUTH-001")` in Java, `// @req REQ-AUTH-001` in Go — across all major languages. Status is derived from test results, not opinions. An MCP server lets AI agents query your requirements in real time, so they always know what to build and why.

In practice, it works like this: I put RTMX in my `CLAUDE.md`. When I start a session, I ask the agent, "What's next in the backlog?" The agent reads the requirements traceability matrix, sees what's unfinished and unblocked, and works against that intent — not its own. When it writes code, it writes tests that link back to specific requirements. When those tests pass, the requirement status updates automatically. When they don't, I know exactly what's broken and why.

Every day, I work with agentic AI that is predisposed to build its own plan, generate its own task list, and spin up its own context. RTMX grounds the agent in *my* intent. It keeps the contract visible and enforceable.

## Quality at the Speed of Relevance

There's a phrase in special operations: slow is smooth and smooth is fast. RTMX keeps the flow smooth so that fast is meaningful and produces sustainable value.

Vibe coding works for prototypes. It works for throwaway scripts and weekend experiments. But it breaks down the moment you need to sustain and maintain what you've built. And right now, a lot of what's being shipped with agentic AI is built on the assumption that speed is the only metric that matters. It's not. Sustainability, security, and correctness matter too — and in regulated industries, they're not optional.

Our role as engineers is shifting from coder to architect. We spend more time framing intent, defining constraints, and reviewing outcomes than we do writing implementation. That's a good shift. But the quality standards that governed the old role have to carry forward into the new one. We owe it to our users. In some cases, we owe it to the public.

I spend hours — sometimes days — building and refining my requirements and feature specifications with my AI agent before I ever start test-driven development on a feature. That time isn't wasted. It's the investment that makes everything downstream faster, more coherent, and more sustainable. RTMX is the tool that holds that investment in place as the agents execute.

## Flat and Wide

Look at how engineering teams actually coordinate today. You chat in Slack about what you're going to build. You write a ticket in Jira describing what you chatted about. You write code in a repo that's supposed to implement the ticket. You message in Slack again when it's done. The work and the conversation about the work live in completely different systems, and most of the coordination overhead is just keeping those layers in sync with each other.

That model was already strained. Now every engineer has an entire product team inside their laptop. The industry's capacity is massively scaling, and the coordination layer — built for a time when a team sat in the same organization on the same network, writing code by hand — hasn't caught up.

The future of engineering collaboration is flat and wide. Not hierarchical teams coordinating through chat channels and ticket queues, but distributed engineers and their agents collaborating through the shared artifact itself. The requirements, the tests, the status, and the collaboration all live in the same structure, right next to the code, accessible from the terminal. You don't chat about what to build — you look at the shared context and build. Your agents don't need a Slack message telling them what's next — they read the backlog.

RTMX makes this architecturally possible because it keeps the entire requirements context in the same structure where the code lives. It's CSV in git. It's already distributed. It's already version-controlled. It's already local-first. That means we can extend it without bolting on a centralized dependency.

RTMX is building CRDT-based sync for real-time, conflict-free collaboration across trust boundaries. Conflict-free replicated data types let multiple users and agents edit the same requirements concurrently — offline, online, across networks — with automatic merge semantics. No central server required for local operation. Add a zero-trust overlay for fault-tolerant collaboration across corporate and sovereign boundaries, and the terminal becomes the team room. Not a centralized platform you depend on, but a protocol that makes your local context authoritative and your collaboration secure.

## Try It

RTMX is open source under the MIT license. Install it and start building against clear requirements today.

```
brew install rtmx-ai/tap/rtmx    # macOS / Linux
apt install rtmx                  # Debian / Ubuntu
```

Or download a binary directly from the [GitHub releases](https://github.com/rtmx-ai/rtmx-go/releases).

Docs and quickstart: [rtmx.ai](https://rtmx.ai)
Source: [github.com/rtmx-ai](https://github.com/rtmx-ai)

I'd genuinely like feedback. If you're working with agentic AI and struggling with the same problems — agents diverging, knowledge architecture drifting, quality eroding — I want to hear how you're solving it. And if RTMX can help, I want to know what's missing.

---

*Ryan McLean is an engineer who builds things with agentic AI. Previously, he led the scaling of the Team Awareness Kit ([TAK.gov](https://tak.gov)) across the U.S. federal government and allied nations.*
