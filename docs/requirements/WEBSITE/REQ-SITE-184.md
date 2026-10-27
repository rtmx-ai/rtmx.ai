# REQ-SITE-184: How-it-works stage excludes nested VHS

## Metadata
- **External**: rtmx-ai/REQ-MONO-060a
- **Status**: COMPLETE

## Requirement

The Sync How-it-works `SyncCollabDemo` surface SHALL NOT embed
`multi-agent-sync.gif` or `multi-agent-sync-live.gif`. The N-pane stage is the
only medium in that component.

## Acceptance Criteria

1. [x] E2E: `sync-collab-demo` has no `sync-collab-recording` / tape img child.
2. [x] Homepage `home-sync-demo` likewise shows stage only.
