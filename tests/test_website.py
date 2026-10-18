"""Website inspection tests referenced by REQ-SITE-* rows."""

from __future__ import annotations

from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
DEPLOY_WORKFLOW = ROOT / ".github" / "workflows" / "deploy.yml"
BLOG_DIR = ROOT / "src" / "content" / "docs" / "blog"
CONTENT_CALENDAR = ROOT / "docs" / "blog-content-calendar.md"


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


@pytest.mark.req("REQ-SITE-018")
@pytest.mark.technique_nominal
def test_demo_video() -> None:
    """Landing page ships a product demo video asset and embeds it."""
    demo = ROOT / "public" / "demo" / "rtmx-product-demo.mp4"
    assert demo.exists(), "public/demo/rtmx-product-demo.mp4 required"
    assert demo.stat().st_size > 50_000

    hero = (ROOT / "src" / "components" / "Hero.astro").read_text()
    assert 'data-testid="product-demo-video"' in hero
    assert "/demo/rtmx-product-demo.mp4" in hero
    assert "<video" in hero


@pytest.mark.req("REQ-SITE-016")
@pytest.mark.technique_nominal
def test_blog_cadence() -> None:
    """Blog index has 2+ dated posts and a documented content calendar."""
    assert CONTENT_CALENDAR.exists(), "docs/blog-content-calendar.md required"
    calendar = CONTENT_CALENDAR.read_text()
    assert "one post per month" in calendar.lower() or "cadence" in calendar.lower()

    posts = [
        p
        for p in BLOG_DIR.iterdir()
        if p.suffix in {".md", ".mdx"} and p.name != "index.mdx"
    ]
    assert len(posts) >= 2, f"expected 2+ blog posts, found {len(posts)}"
    for post in posts:
        body = post.read_text()
        assert body.startswith("---"), f"{post.name} missing frontmatter"
        assert "\ndate:" in body or body.startswith("---\ndate:"), f"{post.name} missing date"
        assert "title:" in body
