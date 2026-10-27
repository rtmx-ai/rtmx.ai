# REQ-SITE-157: Connect GitHub Issues on /account

## Status: COMPLETE
## Priority: P0
## Phase: 22
## External ID: rtmx-ai/REQ-MONO-038e

## Description

`/account` Connections panel SHALL expose a Connect GitHub Issues CTA that
starts the same vault OAuth loop as Asana/Jira/Monday/GitLab, with copy
updated so GitHub Issues is a shipped Connections provider. Prove with GitHub
(org affiliation) remains under Organizations.

## Acceptance Criteria

- [x] `data-testid="connect-github"` button present (label Connect GitHub Issues)
- [x] OAuth start/callback JS handles `github` labels and `RTMX_GITHUB_ISSUES_CLIENT_ID` 503 hint
- [x] Help text lists GitHub Issues among vaulted providers

## Dependencies

- REQ-SITE-156
- rtmx-ai/REQ-MONO-038e
