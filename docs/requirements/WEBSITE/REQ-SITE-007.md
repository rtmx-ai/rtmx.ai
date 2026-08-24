# REQ-SITE-007: Website roadmap shall display live RTM status via RTMX Sync ...

## Status: COMPLETE
## Priority: HIGH
## Phase: 1

## Description
Website roadmap shall display live RTM status via RTMX Sync WebSocket

## Acceptance Criteria
- [x] Live updates in <1s (WS activity triggers curated snapshot refresh)
- [x] Static fallback when PUBLIC_RTMX_SYNC_URL is unset

## Test Cases
- `tests/e2e/roadmap-sync.spec.ts`
- monorepo `system/tests/test_live_rtm_status.py`

## Notes
First live consumer of RTMX Sync WebSocket API. Progress bars refresh from
`GET /api/public/{project_id}/roadmap` when the public room is live.
