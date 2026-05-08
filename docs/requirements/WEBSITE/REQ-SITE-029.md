# REQ-SITE-029: Show HN launch checklist executed

## Status: MISSING
## Priority: HIGH
## Phase: 2

## Description
Show HN launch checklist shall be executed with README updated, all assets
published, and the repo in a star-worthy state.

This is the integration requirement that coordinates the rtmx.ai blog post,
the media assets, and the rtmx repo README rewrite into a single launch-ready
state.

## Acceptance Criteria
- [ ] rtmx repo README rewritten as a landing page (hero GIF, pitch, install, features)
- [ ] README embeds workflow GIF and Mermaid diagrams (or rendered images)
- [ ] README links to blog post ("Read the backstory")
- [ ] brew install rtmx-ai/tap/rtmx works on a clean machine
- [ ] A tagged release exists matching the post version
- [ ] CI is green on both rtmx and rtmx.ai repos
- [ ] Blog post published and accessible
- [ ] All media assets committed and rendering

## Test Cases
- `tests/e2e/launch.spec.ts::test_show_hn_readiness`

## Dependencies
- REQ-SITE-026 (blog article)
- REQ-SITE-028 (media assets)
- rtmx/REQ-LAUNCH-001 (README rewrite -- external, in rtmx repo)

## External References
- rtmx/REQ-LAUNCH-001: README rewrite as landing page (to be created in rtmx RTM)
- docs/show-hn-launch.md: launch playbook with timing, response strategy, FAQ

## Notes
The HN post is a URL post: title + link to github.com/rtmx-ai/rtmx.
The README is the pitch. The blog is the backstory. The media makes it scan.
Post Tuesday or Wednesday, 8-10am ET.
