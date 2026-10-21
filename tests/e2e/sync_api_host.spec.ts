import { test, expect } from '@playwright/test';

/**
 * Humans who open sync.rtmx.ai in a browser are redirected to /sync?from=api-host.
 */
test.describe('API host landing on marketing site', () => {
  test('shows API-host note when from=api-host', async ({ page }) => {
    await page.goto('/sync?from=api-host');
    await expect(page.getByTestId('sync-api-host-note')).toBeVisible();
    await expect(page.getByTestId('sync-api-host-note')).toContainText('sync.rtmx.ai');
    await expect(page.getByTestId('sync-cta-checkout')).toBeVisible();
  });

  test('hides API-host note on normal /sync visits', async ({ page }) => {
    await page.goto('/sync');
    await expect(page.getByTestId('sync-api-host-note')).toBeHidden();
  });
});
