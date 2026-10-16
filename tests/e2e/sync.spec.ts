import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-117: Sync explainer is the product thesis; Pricing is plans only.
 * Open source CLI is positioned as how you access Sync.
 * Header is product-led: Sync · Docs · Pricing.
 */

test.describe('Sync explainer (SITE-117)', () => {
  test('header is Sync, Docs, Pricing — Sync ahead of Pricing', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByTestId('header-nav');
    await expect(nav.getByTestId('nav-sync')).toBeVisible();
    await expect(nav.getByTestId('nav-sync')).toHaveAttribute('href', '/sync');
    await expect(nav.getByTestId('nav-docs')).toHaveAttribute('href', '/quickstart');
    await expect(nav.getByTestId('nav-pricing')).toHaveAttribute('href', '/pricing');

    const links = nav.locator('a.header-nav-link');
    const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    expect(hrefs).toEqual(['/sync', '/quickstart', '/pricing']);
    expect(hrefs.indexOf('/sync')).toBeLessThan(hrefs.indexOf('/pricing'));

    // Demoted links live in the product footer, not the header.
    await expect(nav.getByRole('link', { name: 'aegis' })).toHaveCount(0);
    await expect(nav.getByRole('link', { name: 'About' })).toHaveCount(0);
    await expect(page.getByTestId('product-footer').getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByTestId('product-footer').getByRole('link', { name: 'aegis' })).toBeVisible();
  });

  test('Sync page leads after-Git thesis without pricing-only framing', async ({ page }) => {
    await page.goto('/sync');
    const root = page.getByTestId('sync-explainer');
    await expect(root).toBeVisible();
    await expect(root.locator('h1')).toHaveText('RTMX Sync');
    await expect(root).toContainText(/after Git/i);
    await expect(root).toContainText(/open source/i);
    await expect(root).toContainText(/client is open source|no URL pasting/i);
    await expect(root).not.toContainText(/\$9/);
    await expect(page.getByTestId('sync-cta-checkout')).toBeVisible();
    await expect(page.getByTestId('sync-cta-checkout')).toHaveText(/14-day free trial/i);
    await expect(page.getByTestId('sync-trial-note')).toContainText(/14 days/i);
    await expect(page.getByTestId('sync-cta-cli')).toHaveAttribute('href', '/installation');
    await expect(page.locator('body')).not.toContainText(/Claude/i);

    const install = page.getByTestId('sync-install');
    await expect(install).toContainText('rtmx login');
    await expect(install).toContainText('rtmx sync');
    await expect(install).not.toContainText('wss://');
    await expect(install).not.toContainText('--sync-url');

    const demo = page.getByTestId('sync-collab-demo');
    await expect(demo).toBeVisible();
    await expect(demo.getByRole('heading', { name: /Watch the room converge/i })).toBeVisible();
    await expect(demo.locator('[data-pane="you"]')).toBeVisible();
    await expect(demo.locator('[data-pane="agent"]')).toBeVisible();
    await expect(demo).toContainText(/acme \/ main/);

    // Primary emerald CTA must use white label (Starlight link styles otherwise wash it out).
    const primaryColor = await page.getByTestId('sync-cta-checkout').evaluate((el) => getComputedStyle(el).color);
    expect(primaryColor.replace(/\s/g, '')).toMatch(/^rgb\(255,255,255\)$|^rgba\(255,255,255/);

    // Feature points are cards inside the shared shell border.
    const cards = page.locator('.sync-point');
    await expect(cards).toHaveCount(4);
    const cardBorder = await cards.first().evaluate((el) => getComputedStyle(el).borderTopWidth);
    expect(parseFloat(cardBorder)).toBeGreaterThan(0);
    await expect(page.locator('.sync-shell')).toBeVisible();
  });

  test('hero Sync card and CTA point at /sync, not /pricing', async ({ page }) => {
    await page.goto('/');
    const card = page.getByTestId('hero-sync-card');
    await expect(card).toHaveAttribute('href', '/sync');
    await expect(card).toContainText(/After Git|Sync/i);
    await expect(card).toContainText(/14-day free trial/i);
    await expect(card).not.toContainText(/CRDT/i);
    await expect(page.getByTestId('hero-cta-install')).toHaveAttribute('href', '/installation');
    await expect(page.getByTestId('hero-cta-sync')).toHaveAttribute('href', '/sync');
    await expect(page.getByTestId('hero-cta-sync')).toHaveText(/Try Sync free/i);
    await expect(page.getByTestId('hero-funnel-note')).toContainText(/14-day/i);
    await expect(page.locator('body')).not.toContainText(/Claude/i);
  });

  test('pricing defers product thesis to /sync', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByTestId('pricing-page')).toContainText(/Plans for RTMX Sync|Sync pricing/i);
    await expect(page.locator('a[href="/sync"]').first()).toBeVisible();
    await expect(page.locator('.pricing-subtitle')).toContainText(/multiplayer/i);
  });
});
