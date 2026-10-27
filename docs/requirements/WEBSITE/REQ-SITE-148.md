# REQ-SITE-148: PM hub tab content for all sync adapters + bootstrap

## Status: COMPLETE
## Priority: P0
## Phase: 21
## External ID: rtmx-ai/REQ-MONO-039b

## Description

Project Management hub tabs SHALL cover GitHub, Jira, Asana, Monday, and
GitLab with credentials, `rtmx.yaml`, sync commands, and matching
`rtmx bootstrap --from-<service>` examples. Shared narrative; yaml/credentials
differ per tab.

## Acceptance Criteria

- [x] Five provider tabs with yaml fences
- [x] Bootstrap `--from-*` documented per provider
- [x] Sync examples use current CLI shape (`rtmx sync --service …` or equivalent accurate form)
- [x] Content/Playwright assertions for Asana, Monday, GitLab presence

## Dependencies

- REQ-SITE-147
- rtmx-ai/REQ-MONO-039b
- rtmx-ai/REQ-MONO-040c
