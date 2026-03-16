# REQ-SITE-020: Terminal carousel shall support keyboard arrow navigation an...

## Status: MISSING
## Priority: MEDIUM
## Phase: 4

## Description
Terminal carousel shall support keyboard arrow navigation and ARIA live regions

## Acceptance Criteria
- [ ] Arrow keys change slides; aria-live announces slide changes

## Test Cases
- `tests/test_website.py::test_carousel_accessibility`


## Notes
Add keydown listener for ArrowLeft/ArrowRight; add aria-live=polite region for slide announcements