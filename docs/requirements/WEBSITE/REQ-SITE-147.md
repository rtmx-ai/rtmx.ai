# REQ-SITE-147: Project Management adapters hub and sidebar IA

## Status: COMPLETE
## Priority: P0
## Phase: 21
## External ID: rtmx-ai/REQ-MONO-039a

## Description

Adapters sidebar SHALL list Overview, **Project Management**, and MCP Server.
A single Project Management page hosts provider tabs under **`/docs/adapters/...`**
(REQ-SITE-150). Legacy `/docs/adapters/github` and `/docs/adapters/jira` SHALL
redirect (or alias) to the hub with the matching tab when feasible. Overview and
guides SHALL link to the hub.

## Acceptance Criteria

- [x] `astro.config` sidebar updated (no standalone GitHub/Jira items)
- [x] `/adapters/project-management` (or agreed slug) exists with tab shell
- [x] Redirects from `/adapters/github` and `/adapters/jira`
- [x] Overview lists five PM adapters + MCP
- [x] Playwright or content test for sidebar labels

## Dependencies

- rtmx-ai/REQ-MONO-039a
- rtmx-ai/REQ-MONO-039c
