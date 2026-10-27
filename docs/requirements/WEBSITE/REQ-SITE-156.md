# REQ-SITE-156: Connect GitLab on /account

## Status: COMPLETE
## Priority: P0
## Phase: 22
## External ID: rtmx-ai/REQ-MONO-038d

## Description

`/account` Connections panel SHALL expose a Connect GitLab CTA that starts the
same vault OAuth loop as Asana/Jira/Monday, with copy updated so GitLab is a
shipped Connections provider (GitHub Issues still deferred).

## Acceptance Criteria

- [x] `data-testid="connect-gitlab"` button present
- [x] OAuth start/callback JS handles `gitlab` labels and `RTMX_GITLAB_CLIENT_ID` 503 hint
- [x] Help text no longer claims GitLab is not a Connections provider

## Dependencies

- REQ-SITE-155
- rtmx-ai/REQ-MONO-038d
