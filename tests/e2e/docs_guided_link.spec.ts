import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-154 / REQ-MONO-044d: migrate-from-tracker path uses link after init.
 */

test.describe('guided link docs (SITE-154)', () => {
  test('for-developers third step is link/bootstrap not status-only', async ({
    page,
  }) => {
    const resp = await page.goto('/docs/guides/for-developers');
    expect(resp?.status()).toBe(200);
    const main = page.locator('main');
    await expect(main).toContainText(/Get Started in 3 Steps/i);
    await expect(main).toContainText('rtmx link');
    await expect(main).toContainText(/rtmx status/);
    // Third step region should emphasize link/bootstrap for tracker migrants
    const steps = main.locator('pre, code, .expressive-code').filter({
      hasText: 'rtmx init',
    });
    await expect(steps.first()).toBeVisible();
    await expect(main).toContainText(/issue store/i);
  });

  test('quickstart teaches link after init', async ({ page }) => {
    const resp = await page.goto('/docs/quickstart');
    expect(resp?.status()).toBe(200);
    const main = page.locator('main');
    await expect(main).toContainText('rtmx link');
    await expect(main).toContainText(/bootstrap/i);
    await expect(main).toContainText(/for-developers|issue store/i);
  });
});
