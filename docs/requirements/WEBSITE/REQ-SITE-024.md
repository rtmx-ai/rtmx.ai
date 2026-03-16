# REQ-SITE-024: Header navigation shall be a proper Astro component instead ...

## Status: MISSING
## Priority: MEDIUM
## Phase: 3

## Description
Header navigation shall be a proper Astro component instead of inline script in config

## Acceptance Criteria
- [ ] Navigation renders from component not innerHTML in astro.config.mjs

## Test Cases
- `tests/test_website.py::test_header_nav_component`


## Notes
Extract inline navigation script from astro.config.mjs into HeaderNav.astro component