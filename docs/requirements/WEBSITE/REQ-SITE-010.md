# REQ-SITE-010: Website shall serve security headers via _headers file

## Status: MISSING
## Priority: HIGH
## Phase: 3

## Description
Website shall serve security headers via _headers file

## Acceptance Criteria
- [ ] CSP and X-Frame-Options present in _headers

## Test Cases
- `tests/test_website.py::test_security_headers`


## Notes
Create public/_headers with CSP X-Frame-Options X-Content-Type-Options Referrer-Policy