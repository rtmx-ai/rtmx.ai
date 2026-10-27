# REQ-SITE-155: Connect Monday on /account

## Status: COMPLETE
## Priority: P0
## Phase: 22
## External ID: rtmx-ai/REQ-MONO-038c

## Description

`/account` Connections panel SHALL expose a Connect Monday CTA that starts the
same vault OAuth loop as Asana/Jira, with copy updated so Monday is a shipped
Connections provider (GitLab/GitHub Issues still deferred).

## Acceptance Criteria

- [x] `data-testid="connect-monday"` button present
- [x] OAuth start/callback JS handles `monday` labels and `RTMX_MONDAY_CLIENT_ID` 503 hint
- [x] Help text no longer claims Monday is not a Connections provider

## Dependencies

- REQ-SITE-154 (docs prefix stability)
- rtmx-ai/REQ-MONO-038c
