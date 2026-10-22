import { test, expect } from '@playwright/test';

/**
 * Unsigned Individual checkout must send buyers to login with tab preserved
 * so post-OAuth return does not drop them on Team.
 */
test.describe('checkout tab preserved through login gate', () => {
  test('individual tab gate uses next=/checkout?tab=individual', async ({ page }) => {
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
    await page.waitForURL(/\/login/);
    const next = new URL(page.url()).searchParams.get('next');
    expect(next).toBe('/checkout?tab=individual');
  });
});
