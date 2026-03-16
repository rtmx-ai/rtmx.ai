# REQ-SITE-012: Website shall consolidate CSS by extracting design tokens an...

## Status: MISSING
## Priority: HIGH
## Phase: 3

## Description
Website shall consolidate CSS by extracting design tokens and eliminating !important declarations

## Acceptance Criteria
- [ ] Zero !important in custom.css; shared terminal styles extracted; colors use CSS variables

## Test Cases
- `tests/test_website.py::test_css_quality`


## Notes
Extract emerald palette to CSS variables; deduplicate Terminal/AnimatedTerminal styles; remove !important overrides