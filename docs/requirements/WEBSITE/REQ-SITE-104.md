# REQ-SITE-104: Authenticated dashboard shall display only rooms belonging to the user org

## Requirement

Authenticated dashboard shall display only rooms belonging to the user org

## Acceptance Criteria

1. [ ] Room list is scoped to the authenticated org
2. [ ] Rooms from other orgs never appear
3. [ ] Empty org shows empty-state, not other tenants' data
4. [ ] Playwright/integration covers tenant isolation of room list

## Decomposition

1. Room list is fetched/rendered scoped to authenticated org
2. Cross-org rooms never appear in the list
3. Empty org shows empty-state (not foreign data)
4. Test covers tenant isolation of the room list

## Effort Estimate

See database.csv
