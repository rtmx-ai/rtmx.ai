# REQ-SITE-185: /sync CLI recording section

## Metadata
- **External**: rtmx-ai/REQ-MONO-060a
- **Status**: COMPLETE

## Requirement

`/sync` SHALL include a below-fold section framed as a CLI recording (not a
second How-it-works). It prefers `multi-agent-sync-live.gif` when present,
else the mock GIF (MONO-045c).

## Acceptance Criteria

1. [x] `data-testid="sync-cli-recording"` visible on `/sync`.
2. [x] Figcaption / heading distinguishes recorded CLI from the N-pane stage.
3. [x] Homepage does not show `sync-cli-recording`.
