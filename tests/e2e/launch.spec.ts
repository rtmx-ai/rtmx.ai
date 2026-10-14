import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * REQ-SITE-029: Show HN launch checklist readiness.
 * Coordinates rtmx README, blog, media, and install path.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const rtmxRoot = path.resolve(here, '../../../rtmx');
const siteRoot = path.resolve(here, '../..');

test.describe('Show HN launch readiness (SITE-029)', () => {
  test('rtmx README is a Sync-client landing page (029a/b/c)', async () => {
    const readme = fs.readFileSync(path.join(rtmxRoot, 'README.md'), 'utf8');
    expect(readme).toMatch(/docs\/assets\/rtmx-workflow\.gif/);
    expect(readme).toMatch(/```mermaid/);
    expect(readme).toMatch(/brew install rtmx-ai\/tap\/rtmx/);
    expect(readme).toMatch(/rtmx\.ai\/sync|RTMX Sync/i);
    expect(readme).toMatch(/open source client|how you enter/i);
    expect(readme).toMatch(/Read the backstory/);
    expect(readme).toMatch(/rtmx\.ai\/blog\/show-hn-rtmx/);
  });

  test('blog post is published in content tree (029g)', async () => {
    const blog = path.join(siteRoot, 'src/content/docs/blog/show-hn-rtmx.md');
    expect(fs.existsSync(blog)).toBeTruthy();
    const body = fs.readFileSync(blog, 'utf8');
    expect(body.length).toBeGreaterThan(500);
  });

  test('media assets required by README exist (029h)', async () => {
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
