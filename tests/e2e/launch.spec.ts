import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveRtmxRoot } from './rtmx_root';

/**
 * REQ-SITE-029: Show HN launch checklist readiness.
 * Coordinates rtmx README, blog, media, and install path.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const rtmxRoot = resolveRtmxRoot();
const siteRoot = path.resolve(here, '../..');

test.describe('Show HN launch readiness (SITE-029)', () => {
  test('rtmx README is a Sync-client landing page (029a/b/c)', async () => {
    const readmePath = path.join(rtmxRoot, 'README.md');
    test.skip(!fs.existsSync(readmePath), `rtmx checkout missing at ${rtmxRoot}`);
    const readme = fs.readFileSync(readmePath, 'utf8');
    expect(readme).toMatch(/docs\/assets\/rtmx-workflow\.gif/);
    expect(readme).toMatch(/```mermaid/);
    expect(readme).toMatch(/brew install rtmx-ai\/tap\/rtmx/);
    expect(readme).toMatch(/Read the backstory/);
    expect(readme).toMatch(/rtmx\.ai\/blog\/show-hn-rtmx/);
    // Sync framing lands after CLI sync-push; require it when present.
    if (/rtmx\.ai\/sync/i.test(readme)) {
      expect(readme).toMatch(/open source client|how you enter/i);
    }
  });

  test('blog post is published in content tree (029g)', async () => {
    const blog = path.join(siteRoot, 'src/content/docs/blog/show-hn-rtmx.md');
    expect(fs.existsSync(blog)).toBeTruthy();
    const body = fs.readFileSync(blog, 'utf8');
    expect(body.length).toBeGreaterThan(500);
  });

  test('media assets required by README exist (029h)', async () => {
    test.skip(
      !fs.existsSync(path.join(rtmxRoot, 'docs/assets')),
      `rtmx docs/assets missing at ${rtmxRoot}`,
    );
    for (const name of ['rtmx-workflow.gif', 'rtmx-commands.gif', 'rtmx-mcp-setup.gif']) {
      const p = path.join(rtmxRoot, 'docs/assets', name);
      expect(fs.existsSync(p), `missing ${p}`).toBeTruthy();
    }
  });

  test('Sync explainer is linked from site nav for launch path', async ({ page }) => {
    await page.goto('/sync');
    await expect(page.getByTestId('sync-explainer')).toBeVisible();
    await expect(page.getByTestId('nav-sync')).toBeVisible();
  });
});

test('landing page embeds product demo video (SITE-018)', async ({ page }) => {
  await page.goto('/');
  const video = page.getByTestId('product-demo-video');
  await expect(video).toBeVisible();
  const src = await video.locator('source').getAttribute('src');
  expect(src).toBe('/demo/rtmx-product-demo.mp4');
});
