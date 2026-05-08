# REQ-SITE-028: Show HN launch media assets produced as code

## Status: MISSING
## Priority: HIGH
## Phase: 2

## Description
Show HN launch media assets shall be produced as code using Mermaid diagrams
and vhs terminal recordings. All visual assets are described-as-code and
versioned alongside the source.

### Mermaid diagrams (docs/diagrams/*.mmd)
1. dev-loop.mmd -- how RTMX fits in the development loop (flowchart)
2. csv-diff.mmd -- CSV diff in a PR view (block diagram)
3. mcp-architecture.mmd -- AI agents connecting via MCP (flowchart)
4. requirement-lifecycle.mmd -- requirement state machine (stateDiagram)

### vhs terminal recordings (docs/tapes/*.tape)
1. workflow.tape -- 30-second workflow GIF (status, next, verify, status)
2. agent-loop.tape -- AI agent using rtmx next to pick and complete a requirement

### Terminal screenshots (regenerated from real 219-requirement database)
1. rtmx-status.png -- status dashboard
2. rtmx-backlog.png -- backlog with critical path
3. rtmx-health.png -- health check output

## Acceptance Criteria
- [ ] All four Mermaid .mmd files exist in docs/diagrams/
- [ ] Mermaid diagrams render correctly via mmdc or GitHub native rendering
- [ ] All vhs .tape files exist in docs/tapes/
- [ ] Generated GIFs exist in docs/assets/
- [ ] Terminal screenshots regenerated against real database (not 12-req demo)
- [ ] All assets use rtmx.ai color palette (emerald on dark)

## Test Cases
- `tests/e2e/media.spec.ts::test_launch_media_assets`

## Dependencies
- REQ-SITE-026 (blog article defines which diagrams are needed)

## Blocks
- REQ-SITE-029 (launch checklist requires assets to be ready)

## Notes
Mermaid source and vhs tape files are the source of truth. Rendered PNGs,
SVGs, and GIFs are build artifacts committed for convenience. See
docs/show-hn-launch.md for full asset specifications and styling guidance.
