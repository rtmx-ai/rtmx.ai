# REQ-SITE-026: Blog shall publish Show HN launch article

## Status: MISSING
## Priority: HIGH
## Phase: 2

## Description
Blog shall publish Show HN launch article with origin story and AI workflow narrative.

Long-form article adapted from docs/show-hn-launch.md post text. Complements
the existing back-to-basics blog post. Linked from the rtmx README as
"Read the backstory."

The article should cover:
- Origin story: defense software, cleaning up after AI agents
- The fix: queryable, verifiable requirements model in git
- The AI workflow: next --> code --> verify --> status
- Why CSV in git
- Self-referential dogfooding (219 requirements managed by RTMX)

## Acceptance Criteria
- [ ] Blog post accessible at /blog/show-hn-rtmx (or similar slug)
- [ ] Post has structured frontmatter (title, date, description)
- [ ] Post includes embedded Mermaid diagrams or rendered images
- [ ] Post links to GitHub repo
- [ ] Post does not mention rtmx-sync or paid products

## Test Cases
- `tests/e2e/blog.spec.ts::test_show_hn_blog_post`

## Dependencies
- REQ-SITE-001 (Astro framework)
- REQ-SITE-016 (blog content strategy)

## Blocks
- REQ-SITE-029 (launch checklist)

## Notes
The HN post itself is a URL post pointing to the GitHub repo. This blog
article is the long-form companion piece, cross-posted to Dev.to and LinkedIn
after HN settles.
