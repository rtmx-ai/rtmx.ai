# REQ-SITE-109: Production Sync Server URL in Website CI

## Metadata
- **Category**: WEBSITE
- **Subcategory**: DEPLOY
- **Priority**: HIGH
- **Phase**: 5
- **Status**: MISSING
- **Dependencies**: REQ-SITE-004, REQ-SITE-106
- **Blocks**: REQ-MONO-017
- **External ID**: rtmx-ai/REQ-MONO-017d

## Requirement

The GitHub Pages deploy workflow (`.github/workflows/deploy.yml`) SHALL
pass `PUBLIC_RTMX_SYNC_HTTP_URL` to the Astro build so checkout,
license, and billing pages target the production sync host without
relying on hardcoded fallbacks alone.

The value SHALL come from a GitHub Actions repository variable
(`vars.PUBLIC_RTMX_SYNC_HTTP_URL`) with fallback
`https://sync.rtmx.ai` when unset.

## Rationale

Checkout and fulfillment pages read `import.meta.env.PUBLIC_RTMX_SYNC_HTTP_URL`.
Hardcoded defaults work locally but production deploy should be explicit
and overridable per environment (staging vs production).

## Acceptance Criteria

1. `deploy.yml` sets `PUBLIC_RTMX_SYNC_HTTP_URL` in the build step env.
2. Variable is documented in requirement and inspectable by test.
3. Checkout page continues to POST to the configured sync server URL.

## Test Strategy

- `tests/test_website.py::test_production_sync_url_in_deploy_workflow`

## Effort Estimate

0.25 weeks
