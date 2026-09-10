import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-111: Sync marketing leads with multiplayer, not CRDT.
 */
test.describe('multiplayer Sync marketing', () => {
  test('pricing leads with multiplayer, not CRDT', async ({ page }) => {
    await page.goto('/pricing');

    await expect(page.locator('.pricing-subtitle')).toContainText(/multiplayer/i);
    await expect(page.locator('.pricing-subtitle')).not.toContainText(/CRDT/i);

    const teamCard = page.locator('.pricing-card', { hasText: 'Team' }).first();
    await expect(teamCard).toContainText(/multiplayer/i);
    await expect(teamCard).not.toContainText(/CRDT/i);

    await expect(page.locator('.faq-section')).toContainText(/multiplayer Sync/i);
    await expect(page.locator('.faq-section')).not.toContainText(/What is CRDT/i);
  });

  test('landing Team Sync card is multiplayer, not CRDT', async ({ page }) => {
    await page.goto('/');

    const teamSync = page.locator('.feature-card', { hasText: 'Team Sync' }).first();
    await expect(teamSync).toContainText(/Multiplayer/i);
    await expect(teamSync).not.toContainText(/CRDT/i);

    await expect(page.locator('.comparison-table')).toContainText(/Multiplayer Sync/);
    await expect(page.locator('.comparison-table')).not.toContainText(/CRDT sync/);
  });

  test('pricing waitlist is Enterprise interest, not Team launch gate', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('#waitlist')).toContainText(/Enterprise interest/i);
    await expect(page.locator('#waitlist')).not.toContainText(/when RTMX Sync launches/i);
  });
});
