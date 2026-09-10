import { test, expect } from '@playwright/test';

/**
 * REQ-MONO-020c: mint admin API key once from checkout.
 */

test.describe('admin API key mint on checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({ token: 'session-test', email: 'buyer@example.com' }),
      );
    });
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
    await page.route('**/orgs', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            organizations: [{ id: 'o1', name: 'Acme', slug: 'acme', tier: 'free' }],
          }),
        });
        return;
      }
      await route.fallback();
    });
  });

  test('mints an admin key shown once (AC1/AC2)', async ({ page }) => {
    let minted = false;
    await page.route('**/keys', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.fallback();
        return;
      }
      minted = true;
      const body = route.request().postDataJSON();
      expect(body.scope).toBe('admin');
      expect(route.request().headers()['authorization']).toBe('Bearer session-test');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'k1',
          name: 'checkout-acme',
          scope: 'admin',
          key: 'rtmx_ad_once-secret',
          prefix: 'rtmx_ad_',
          created_at: new Date().toISOString(),
        }),
      });
    });

    await page.goto('/checkout');
    await expect(page.locator('#key-mint')).toBeEnabled();
    await page.locator('#key-mint').click();
    await expect(page.locator('#key-once')).toBeVisible();
    await expect(page.locator('#key-once')).toContainText('rtmx_ad_once-secret');
    await expect(page.locator('#key-once-help')).toBeVisible();
    expect(minted).toBe(true);

    await page.reload();
    await expect(page.locator('#key-once')).toBeHidden();
  });
});
