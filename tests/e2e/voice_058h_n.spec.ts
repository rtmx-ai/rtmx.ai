import { test, expect } from '@playwright/test';

/**
 * MONO-058h–n / SITE-166–172 — P1 voice consistency.
 */

test.describe('Site voice P1 (SITE-166–172)', () => {
  test('pricing deploy glossary and Sync/CLI FAQ (SITE-166/168)', async ({
    page,
  }) => {
    await page.goto('/pricing');
    await expect(page.getByTestId('deploy-glossary')).toContainText(
      /managed Sync/i,
    );
    await expect(page.getByTestId('pricing-sync-cli-faq')).toContainText(
      /How does Sync relate to the CLI/i,
    );
  });

  test('checkout kicker is trial not Purchase (SITE-167)', async ({ page }) => {
    await page.goto('/checkout');
    const kick = page.getByTestId('checkout-kicker');
    await expect(kick).toBeVisible();
    await expect(kick).not.toHaveText(/Purchase/i);
    await expect(kick).toContainText(/trial|Sync/i);
  });

  test('about OSS carve-out (SITE-169)', async ({ page }) => {
    await page.goto('/about');
    const oss = page.getByTestId('about-oss');
    await expect(oss).toContainText(/Apache 2\.0/i);
    await expect(oss).toContainText(/CLI/i);
    await expect(oss).toContainText(/commercial/i);
  });

  test('roadmap Sync-aware (SITE-170)', async ({ page }) => {
    await page.goto('/roadmap');
    await expect(page.getByTestId('roadmap-sot-note')).toContainText(/Sync/i);
  });

  test('enterprise H1 names Sync (SITE-171)', async ({ page }) => {
    await page.goto('/enterprise');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      /RTMX Sync/i,
    );
  });

  test('home feature grid Sync-first (SITE-172)', async ({ page }) => {
    await page.goto('/');
    const grid = page.getByTestId('home-feature-grid');
    await expect(page.getByTestId('home-feature-lede')).toContainText(
      /product surface/i,
    );
    const sync = grid.getByTestId('hero-sync-card');
    await expect(sync).toBeVisible();
    const syncBox = await sync.boundingBox();
    const cli = grid.locator('a[href="/docs/guides/cli-reference"]');
    const cliBox = await cli.boundingBox();
    expect(syncBox && cliBox).toBeTruthy();
    if (syncBox && cliBox) {
      expect(syncBox.y).toBeLessThanOrEqual(cliBox.y);
    }
  });
});
