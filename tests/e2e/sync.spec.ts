import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-117: Sync explainer is the product thesis; Pricing is plans only.
 * Open source CLI is positioned as how you access Sync.
 */

test.describe('Sync explainer (SITE-117)', () => {
  test('header leads with Sync ahead of Pricing', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('.header-nav');
    await expect(nav.getByTestId('nav-sync')).toBeVisible();
    await expect(nav.getByTestId('nav-sync')).toHaveAttribute('href', '/sync');

    const links = nav.locator('a.header-nav-link');
    const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    expect(hrefs.indexOf('/sync')).toBeGreaterThanOrEqual(0);
    expect(hrefs.indexOf('/sync')).toBeLessThan(hrefs.indexOf('/pricing'));
  });

  test('Sync page leads after-Git thesis without pricing-only framing', async ({ page }) => {
    await page.goto('/sync');
    const root = page.getByTestId('sync-explainer');
    await expect(root).toBeVisible();
    await expect(root.locator('h1')).toHaveText('RTMX Sync');
    await expect(root).toContainText(/after Git/i);
    await expect(root).toContainText(/open source/i);
    await expect(root).toContainText(/how you enter the room|how you access Sync|client is open source/i);
    await expect(root).not.toContainText(/\$9/);
    await expect(page.getByTestId('sync-cta-checkout')).toBeVisible();
    await expect(page.getByTestId('sync-cta-cli')).toHaveAttribute('href', '/installation');
  });

  test('hero Sync card and CTA point at /sync, not /pricing', async ({ page }) => {
    await page.goto('/');
    const card = page.getByTestId('hero-sync-card');
    await expect(card).toHaveAttribute('href', '/sync');
    await expect(card).toContainText(/After Git|Sync/i);
    await expect(card).not.toContainText(/CRDT/i);
    await expect(page.getByTestId('hero-cta-sync')).toHaveAttribute('href', '/sync');
  });

  test('pricing defers product thesis to /sync', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByTestId('pricing-page')).toContainText(/Plans for RTMX Sync|Sync pricing/i);
    await expect(page.locator('a[href="/sync"]').first()).toBeVisible();
    await expect(page.locator('.pricing-subtitle')).toContainText(/multiplayer/i);
  });
});
