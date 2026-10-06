# REQ-SITE-103: Authenticated dashboard shall connect to rtmx-sync WebSocket with auth token

## Requirement

Authenticated dashboard shall connect to rtmx-sync WebSocket with auth token

## Acceptance Criteria

1. [x] Dashboard opens a WebSocket to /sync/{org_slug}/{room} (or contract path)
2. [x] Connection sends Bearer/auth-token-v1 credential from the site session
3. [x] Failed auth closes or errors visibly (no silent hang)
4. [x] Playwright/integration covers authenticated connect smoke

## Decomposition

1. Dashboard opens WebSocket to the org/room sync path
2. Connection attaches auth-token-v1 / Bearer credential from session
3. Auth failure is visible (no silent hang)
4. Integration/Playwright covers authenticated connect smoke

## Effort Estimate

See database.csv
