import { test, expect } from '@playwright/test';

/**
 * Unsigned checkout: browse tabs first; sign-in only when continuing (CTA).
 * Login next= must preserve the selected tab.
 */
test.describe('checkout tab preserved through login gate', () => {
  test('individual CTA uses next=/checkout?tab=individual', async ({ page }) => {
    await page.route('**/auth/login/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          authorization_url: 'https://github.com/login/oauth/authorize?state=x',
          state: 'x',
          provider: 'github',
          next: '/checkout',
        }),
      });
    });
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({ status: 401, body: '{}' });
    });
    await page.route('**/auth/providers', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ providers: ['github', 'google'] }),
      });
    });

    await page.goto('/checkout?tab=individual');
    await expect(page).toHaveURL(/\/checkout\?tab=individual/);
    await expect(page.getByTestId('checkout-panel-individual')).toBeVisible();
    await page.getByTestId('checkout-cta').click();
    await page.waitForURL(/\/login/);
    const next = new URL(page.url()).searchParams.get('next');
    expect(next).toBe('/checkout?tab=individual');
  });
});
