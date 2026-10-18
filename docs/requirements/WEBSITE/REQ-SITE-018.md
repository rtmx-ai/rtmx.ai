# REQ-SITE-018: Website shall include product demo video on landing page

## Status: COMPLETE
## Priority: MEDIUM
## Phase: 2
## Completed: 2026-10-17

## Description
Website shall include product demo video on landing page

## Acceptance Criteria
- [x] Video element or embed renders on landing page
- [x] Walkthrough matches title: `status`, `next`, `verify`, Cursor MCP setup
- [x] Recordings produced in Docker (generic `/workspace`, `/home/demo` paths)

## Test Cases
- `tests/test_website.py::test_demo_video`

## Notes
`<video data-testid="product-demo-video">` embeds
`public/demo/rtmx-product-demo.mp4`, concatenated from container-recorded
vhs assets (`rtmx-workflow` + `rtmx-mcp-setup`).

Regenerate from the CLI repo:

```bash
cd rtmx && make gifs-site
```
