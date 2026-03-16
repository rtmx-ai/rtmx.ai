# REQ-SITE-021: Pricing page form shall provide validation feedback and load...

## Status: MISSING
## Priority: MEDIUM
## Phase: 4

## Description
Pricing page form shall provide validation feedback and loading and success/error states

## Acceptance Criteria
- [ ] Error messages render on invalid input; button shows loading state on submit

## Test Cases
- `tests/test_website.py::test_form_validation`


## Notes
Add aria-invalid and aria-describedby; loading spinner on submit; success/error toast messaging