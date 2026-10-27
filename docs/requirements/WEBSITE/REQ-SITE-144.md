# REQ-SITE-144: Connections vault copy (not forge adapters)

## Status: COMPLETE
## Priority: MEDIUM
## Phase: 19
## External ID: rtmx-ai/REQ-MONO-036d

## Description

`/account` Connections SHALL present vaulted project-management OAuth (Asana)
and SHALL NOT offer Jira, Monday, GitLab, or GitHub Issues as Connections
providers. Copy MUST distinguish Connections from Organizations forge prove.

## Acceptance Criteria

- [x] Panel intro mentions vault / project tools / Asana (or equivalent)
- [x] No Connect buttons for jira, monday, gitlab, github-issues
- [x] Playwright asserts vault copy and absent adapter CTAs

## Dependencies

- REQ-SITE-143
- rtmx-ai/REQ-MONO-036d
- saas-connections (MONO-026) Asana vault
