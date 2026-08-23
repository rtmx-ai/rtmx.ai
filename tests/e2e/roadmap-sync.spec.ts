import { test, expect } from '@playwright/test';

/**
 * Consumer-side contract tests for the roadmap sync client (REQ-SITE-007).
 *
 * Tests that the roadmap page:
 * - Renders with static data as baseline (graceful degradation)
 * - Has correct data-sync attributes for DOM updates
 * - Shows connection status indicator
 * - Falls back gracefully when no sync URL is configured
 *
 * Note: Full WebSocket integration tests (connecting to a real rtmx-sync
 * instance) live in system/tests/ in the monorepo. These tests verify the
 * consumer-side DOM structure and fallback behavior only.
 */

test.describe('Roadmap page static baseline', () => {
  test('renders with hardcoded phase data', async ({ page }) => {
    await page.goto('/roadmap');

    // Overall progress renders
    const overallPct = page.locator('[data-sync="overall-pct"]');
    await expect(overallPct).toBeVisible();
    await expect(overallPct).toHaveText(/\d+%/);

    const overallBar = page.locator('[data-sync="overall-bar"]');
    await expect(overallBar).toBeVisible();

    const overallCounts = page.locator('[data-sync="overall-counts"]');
    await expect(overallCounts).toHaveText(/\d+ of \d+ requirements/);
  });

  test('renders all phase cards with data-sync attributes', async ({ page }) => {
    await page.goto('/roadmap');

    // The cards come from the static phase list on the page. Asserting a
    // frozen count (13, then 25) made the suite fail every time the RTM
    // grew. The contract is: every rendered phase is addressable by the
    // sync client, and each card has a bar and a count.
    const phaseCards = page.locator('[data-sync-phase]');
    const count = await phaseCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const card = phaseCards.nth(i);
      await expect(card).toBeVisible();
      await expect(card).toHaveAttribute('data-sync-phase', /\d+/);
      await expect(card.locator('[data-sync="phase-bar"]')).toBeVisible();
      await expect(card.locator('[data-sync="phase-stats"]')).toHaveText(/\d+\/\d+/);
    }
  });

  test('phase cards carry a known status class', async ({ page }) => {
    await page.goto('/roadmap');

    const phaseCards = page.locator('[data-sync-phase]');
    const count = await phaseCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(phaseCards.nth(i)).toHaveClass(/status-(complete|progress|planned)/);
    }
  });
});

test.describe('Roadmap sync connection indicator', () => {
  test('connection status indicator exists', async ({ page }) => {
    await page.goto('/roadmap');

    const statusEl = page.locator('[data-sync="connection-status"]');
    await expect(statusEl).toBeAttached();
    // aria-live for accessibility
    await expect(statusEl).toHaveAttribute('aria-live', 'polite');
  });

  test('indicator is hidden when no sync URL configured', async ({ page }) => {
    // Default build has no PUBLIC_RTMX_SYNC_URL, so no WebSocket attempt
    await page.goto('/roadmap');

    const statusEl = page.locator('[data-sync="connection-status"]');
    // Should not have 'visible' class when sync is not configured
    await expect(statusEl).not.toHaveClass(/visible/);
  });
});

test.describe('Roadmap graceful degradation', () => {
  test('page is fully functional without sync server', async ({ page }) => {
    await page.goto('/roadmap');

    // All content renders from static data
    await expect(page.getByRole('heading', { name: 'Project Roadmap' })).toBeVisible();
    await expect(page.locator('[data-sync="overall-pct"]')).toBeVisible();
    expect(await page.locator('[data-sync-phase]').count()).toBeGreaterThan(0);

    // No JavaScript errors
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.waitForTimeout(2000);
    expect(errors).toHaveLength(0);
  });
});
