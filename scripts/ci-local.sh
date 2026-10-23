#!/usr/bin/env bash
# Mirror Deploy Website CI locally (build + form-proxy + full Playwright).
# Used by monorepo pre-push and `make sync-push PROJECT=rtmx.ai`.
#
# Skip (rare): SKIP_RTMX_AI_E2E=1
# Already ran in this push: RTMX_AI_CI_LOCAL_OK=1 (set by Makefile after success)
# Fresh stamp: .rtmx/ci-local.ok matches HEAD and is < 20 minutes old

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

STAMP_DIR="${ROOT}/.rtmx"
STAMP_FILE="${STAMP_DIR}/ci-local.ok"
STAMP_MAX_AGE_SEC=1200

if [[ "${SKIP_RTMX_AI_E2E:-}" == "1" ]]; then
  echo "SKIP_RTMX_AI_E2E=1 — skipping rtmx.ai CI-local gate"
  exit 0
fi

if [[ "${RTMX_AI_CI_LOCAL_OK:-}" == "1" ]]; then
  echo "rtmx.ai CI-local gate already passed this push — skipping"
  exit 0
fi

head_sha="$(git -C "$(git rev-parse --show-toplevel 2>/dev/null || echo "$ROOT")" rev-parse HEAD 2>/dev/null || echo unknown)"
if [[ -f "$STAMP_FILE" ]]; then
  stamp_sha="$(head -1 "$STAMP_FILE" 2>/dev/null || true)"
  stamp_ts="$(sed -n '2p' "$STAMP_FILE" 2>/dev/null || true)"
  now="$(date +%s)"
  if [[ "$stamp_sha" == "$head_sha" && -n "$stamp_ts" ]]; then
    age=$((now - stamp_ts))
    if (( age >= 0 && age < STAMP_MAX_AGE_SEC )); then
      echo "rtmx.ai CI-local stamp fresh for HEAD ${head_sha:0:8} (${age}s ago) — skipping"
      exit 0
    fi
  fi
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

mkdir -p "$STAMP_DIR"
{
  echo "$head_sha"
  date +%s
} >"$STAMP_FILE"

echo "=== rtmx.ai CI-local: all checks passed ==="
