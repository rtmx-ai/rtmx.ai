# REQ-SITE-018: Website shall include product demo video on landing page

## Status: COMPLETE
## Priority: MEDIUM
## Phase: 2
## Completed: 2026-10-17

## Description
Website shall include product demo video on landing page

## Acceptance Criteria
- [x] Video element or embed renders on landing page

## Test Cases
- `tests/test_website.py::test_demo_video`

## Notes
Create 3-5 minute product walkthrough video showing rtmx status and MCP integration.

Shipped MVP: `<video data-testid="product-demo-video">` on the landing Hero
embeds `public/demo/rtmx-product-demo.mp4`, concatenated from the dogfooded
vhs assets (`rtmx-workflow` + `rtmx-mcp-setup`). Longer narrative walkthrough
can replace this file later without changing the embed contract.
