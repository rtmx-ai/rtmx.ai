#!/usr/bin/env bash
# REQ-SITE-153 exit probes
set -euo pipefail

resolve_curl() {
  local host="$1"
  local ip
  ip="$(dig +short "$host" A @1.1.1.1 | head -1)"
  if [[ -z "$ip" ]]; then
    echo "FAIL $host NXDOMAIN (wildcard DNS missing?)"
    return 1
  fi
  echo "=== $host ($ip) ==="
  curl --resolve "${host}:443:${ip}" -sI --max-time 20 "https://${host}/" | tr -d '\r' | grep -iE 'HTTP/|location:' || true
}

echo "=== allowlisted ==="
curl -sI --max-time 15 "https://www.rtmx.ai/" | tr -d '\r' | grep -iE 'HTTP/|location:' | head -3
curl -sI --max-time 15 -X GET "https://sync.rtmx.ai/health" | tr -d '\r' | head -3

resolve_curl x.rtmx.ai
resolve_curl synck.rtmx.ai
resolve_curl "randomtypo123.rtmx.ai" || true
