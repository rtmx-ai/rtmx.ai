#!/usr/bin/env bash
# Mirror Deploy Website CI locally (build + form-proxy + full Playwright).
# Used by monorepo pre-push and `make sync-push PROJECT=rtmx.ai`.
#
# Skip (rare): SKIP_RTMX_AI_E2E=1
# Already ran in this push: RTMX_AI_CI_LOCAL_OK=1 (set by Makefile after success)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ "${SKIP_RTMX_AI_E2E:-}" == "1" ]]; then
  echo "SKIP_RTMX_AI_E2E=1 — skipping rtmx.ai CI-local gate"
  exit 0
fi

if [[ "${RTMX_AI_CI_LOCAL_OK:-}" == "1" ]]; then
  echo "rtmx.ai CI-local gate already passed this push — skipping"
  exit 0
fi

if [[ ! -d node_modules ]]; then
  echo "Installing npm dependencies..."
  npm ci
fi

echo "=== rtmx.ai CI-local: build ==="
npm run build

echo "=== rtmx.ai CI-local: form-proxy unit tests ==="
npm run test:worker

echo "=== rtmx.ai CI-local: Playwright (chromium) ==="
# Match GitHub Actions: CI=1 enables workers=2, one retry, fresh webServer.
export CI=1
npx playwright install chromium
npx playwright test

echo "=== rtmx.ai CI-local: all checks passed ==="
