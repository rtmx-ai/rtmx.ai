# REQ-SITE-025: All grid containers shall use not-content class to prevent S...

## Status: COMPLETE
## Priority: HIGH
## Phase: 4

## Description
All grid containers shall use not-content class to prevent Starlight margin distortion

## Acceptance Criteria
- [ ] No visual distortion on first grid items; not-content class on all grids

## Test Cases
- `tests/test_website.py::test_grid_alignment`


## Notes
Starlight adjacent sibling margin rule causes first grid item to appear shorter; fixed by adding not-content class