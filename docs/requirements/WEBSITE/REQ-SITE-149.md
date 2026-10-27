# REQ-SITE-149: Site-wide code fence copy with checkmark feedback

## Status: COMPLETE
## Priority: P0
## Phase: 21
## External ID: rtmx-ai/REQ-MONO-041a

## Description

Every fenced code block on documentation pages SHALL show a copy control.
After a successful copy, the control SHALL show a green checkmark briefly,
then revert. Clipboard text MUST retain newlines for multi-line snippets.
Enable via Starlight/Expressive Code (reverse `frames: false` or provide equal UX).

## Acceptance Criteria

- [x] Copy control visible on bash and yaml fences on a docs page
- [x] Click copies multi-line text with newlines
- [x] Green checkmark / copied state observable
- [x] Playwright coverage for copy + checkmark + newline retention

## Dependencies

- rtmx-ai/REQ-MONO-041a
- rtmx-ai/REQ-MONO-041b
