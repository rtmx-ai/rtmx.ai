# REQ-SITE-029: Show HN launch checklist executed

## Status: PARTIAL
## Priority: HIGH
## Phase: 2

## Description
Show HN launch checklist shall be executed with README updated, all assets
published, and the repo in a star-worthy state.

This is the integration requirement that coordinates the rtmx.ai blog post,
the media assets, and the rtmx repo README rewrite into a single launch-ready
state. The README now leads with Sync (CLI as open source client).

## Acceptance Criteria
- [x] rtmx repo README rewritten as a landing page (hero GIF, pitch, install, features)
- [x] README embeds workflow GIF and Mermaid diagrams (or rendered images)
- [x] README links to blog post ("Read the backstory")
- [x] brew install rtmx-ai/tap/rtmx works on a clean machine
- [x] A tagged release exists matching the post version
- [ ] CI is green on both rtmx and rtmx.ai repos
- [x] Blog post published and accessible
- [x] All media assets committed and rendering

## Test Cases
- `tests/e2e/launch.spec.ts` — Show HN launch readiness (SITE-029)

## Dependencies
- REQ-SITE-026 (blog article)
- REQ-SITE-028 (media assets)
- rtmx/REQ-LAUNCH-001 (README rewrite -- external, in rtmx repo)

## External References
- rtmx/REQ-LAUNCH-001: README rewrite as landing page (to be created in rtmx RTM)
- docs/show-hn-v0.1.0.md: launch playbook with timing, response strategy, FAQ

## Notes
The HN post is a URL post: title + link to github.com/rtmx-ai/rtmx.
The README is the pitch. The blog is the backstory. The media makes it scan.
Post Tuesday or Wednesday, 8-10am ET.
