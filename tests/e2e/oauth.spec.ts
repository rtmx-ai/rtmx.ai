import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-102 / REQ-MONO-020a: OAuth login chrome and checkout gate.
 */

test.describe('OAuth login chrome', () => {
  test('offers GitHub and Google sign-in (AC1)', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /Continue with GitHub/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
  });

  test('starts GitHub OAuth against the managed sync host (AC2)', async ({ page }) => {
    await page.route('**/auth/login/github**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          authorization_url: 'https://github.com/login/oauth/authorize?client_id=test&state=abc',
          state: 'abc',
          provider: 'github',
          next: '/checkout',
        }),
      });
    });

    await page.goto('/login?next=/checkout');
    await page.getByRole('button', { name: /Continue with GitHub/i }).click();
    // GitHub may land on /login?return_to=.../oauth/authorize rather than the
    // authorize path itself when the client_id is a test stub.
    await page.waitForURL(/github\.com\/login/);
  });
});

test.describe('checkout sign-in gate', () => {
  test('redirects unauthenticated visitors when OAuth is configured (AC3)', async ({ page }) => {
    await page.route('**/auth/login/github**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          authorization_url: 'https://github.com/login/oauth/authorize?client_id=test&state=x',
          state: 'x',
          provider: 'github',
          next: '/checkout',
        }),
      });
    });

    await page.goto('/checkout');
    await page.waitForURL(/\/login\?next=/);
    await expect(page.getByRole('button', { name: /Continue with GitHub/i })).toBeVisible();
  });

  test('keeps private-beta key path when OAuth is unconfigured', async ({ page }) => {
    await page.route('**/auth/login/github**', async (route) => {
      await route.fulfill({ status: 503, body: 'OAuth provider not configured' });
    });

    await page.goto('/checkout');
    await expect(page.locator('#checkout-submit')).toBeVisible();
    await expect(page.locator('#api-key')).toBeVisible();
  });
});
