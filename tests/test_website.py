"""Website inspection tests referenced by REQ-SITE-* rows."""

from __future__ import annotations

from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
DEPLOY_WORKFLOW = ROOT / ".github" / "workflows" / "deploy.yml"


@pytest.mark.req("REQ-SITE-109")
@pytest.mark.technique_nominal
def test_production_sync_url_in_deploy_workflow() -> None:
    """Build step passes PUBLIC_RTMX_SYNC_HTTP_URL to Astro."""
    assert DEPLOY_WORKFLOW.exists(), "deploy.yml required"
    content = DEPLOY_WORKFLOW.read_text()
    assert "PUBLIC_RTMX_SYNC_HTTP_URL" in content
    assert "npm run build" in content
    build_idx = content.index("npm run build")
    env_section = content[:build_idx]
    assert "PUBLIC_RTMX_SYNC_HTTP_URL" in env_section
