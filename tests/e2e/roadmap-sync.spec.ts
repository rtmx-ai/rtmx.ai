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

    // Should have 13 phase cards (matching hardcoded data)
    const phaseCards = page.locator('[data-sync-phase]');
    await expect(phaseCards).toHaveCount(13);

    // Each card has progress bar and stats
    for (let i = 1; i <= 13; i++) {
      const card = page.locator(`[data-sync-phase="${i}"]`);
      await expect(card).toBeVisible();
      await expect(card.locator('[data-sync="phase-bar"]')).toBeVisible();
      await expect(card.locator('[data-sync="phase-stats"]')).toHaveText(/\d+\/\d+/);
    }
  });

  test('phase cards have correct status classes', async ({ page }) => {
    await page.goto('/roadmap');

    // Phase 1 (Foundation) should be complete
    const phase1 = page.locator('[data-sync-phase="1"]');
    await expect(phase1).toHaveClass(/status-complete/);

    // Phase 5 (CLI UX) should be in-progress
    const phase5 = page.locator('[data-sync-phase="5"]');
    await expect(phase5).toHaveClass(/status-progress/);

    // Phase 9 (CRDT) should be planned
    const phase9 = page.locator('[data-sync-phase="9"]');
    await expect(phase9).toHaveClass(/status-planned/);
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
    await expect(page.locator('h1')).toHaveText('Project Roadmap');
    await expect(page.locator('[data-sync="overall-pct"]')).toBeVisible();
    await expect(page.locator('[data-sync-phase]')).toHaveCount(13);

    // No JavaScript errors
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.waitForTimeout(2000);
    expect(errors).toHaveLength(0);
  });
});
