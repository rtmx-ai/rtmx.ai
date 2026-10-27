import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-027: Blog in nav; /docs/blog index lists posts newest-first with dates.
 * REQ-MONO-042: docs namespace under /docs (legacy /blog redirects).
 */

test.describe('Blog navigation and index (SITE-027)', () => {
  test('header Blog link reaches /docs/blog index', async ({ page }) => {
    await page.goto('/');
    const navBlog = page.getByTestId('nav-blog');
    await expect(navBlog).toBeVisible();
    await navBlog.click();
    await expect(page).toHaveURL(/\/docs\/blog\/?$/);
  });

  test('blog index lists posts reverse-chronologically with dates', async ({ page }) => {
    await page.goto('/docs/blog');
    const list = page.getByTestId('blog-post-list');
    await expect(list).toBeVisible();

    const items = page.getByTestId('blog-post-item');
    await expect(items).toHaveCount(2);

    const titles = await page.getByTestId('blog-post-link').allTextContents();
    expect(titles[0]).toMatch(/Show HN/);
    expect(titles[1]).toMatch(/Back to Basics|Cleaning Up/i);

    const dates = page.getByTestId('blog-post-date');
    await expect(dates).toHaveCount(2);
    await expect(dates.nth(0)).toContainText(/2026/);
    await expect(dates.nth(1)).toContainText(/2026/);

    // Newest first: Oct Show HN before May Back to Basics.
    const newest = await dates.nth(0).getAttribute('datetime');
    const older = await dates.nth(1).getAttribute('datetime');
    expect(newest).toBeTruthy();
    expect(older).toBeTruthy();
    expect(newest! >= older!).toBeTruthy();
  });

  test('sidebar Blog section is present', async ({ page }) => {
    await page.goto('/docs/blog');
    const sidebar = page.locator('nav.sidebar, .sidebar-content, starlight-menu').first();
    await expect(sidebar.getByText('Blog', { exact: true }).first()).toBeVisible();
  });

  test('SITE-151: legacy /blog redirects to /docs/blog', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveURL(/\/docs\/blog\/?$/);
  });
});

test.describe('Show HN blog post (SITE-026)', () => {
  test('post is published with frontmatter signals and GitHub link', async ({ page }) => {
    await page.goto('/docs/blog/show-hn-rtmx');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Show HN|RTMX/);
    await expect(
      page.locator('a[href="https://github.com/rtmx-ai/rtmx"]').first(),
    ).toBeVisible();

    // Mermaid fences are present in the rendered page (client plugin renders them).
    const main = page.locator('main');
    await expect(main).toContainText(/rtmx next/i);
    const html = await main.innerHTML();
    expect(html).toMatch(/mermaid|flowchart|stateDiagram/i);

    const body = await main.innerText();
    expect(body.toLowerCase()).not.toContain('rtmx-sync');
    expect(body).not.toMatch(/\$\d+\s*\/\s*(user|seat|month)/i);
  });
});
