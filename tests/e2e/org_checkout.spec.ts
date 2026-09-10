import { test, expect } from '@playwright/test';

/**
 * REQ-MONO-020b: signed-in buyers create/select an org without ops bootstrap.
 */

test.describe('self-serve organization on checkout', () => {
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
  });

  test('lists orgs for a signed-in buyer (AC2)', async ({ page }) => {
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

    await page.goto('/checkout');
    await expect(page.locator('#org-session-panel')).toBeVisible();
    await expect(page.locator('#org-select')).toContainText('Acme');
    await expect(page.locator('#api-key-field')).toBeHidden();
  });

  test('creates an org via POST /orgs with the session (AC1/AC3)', async ({ page }) => {
    let createdWithBearer = '';
    await page.route('**/orgs', async (route) => {
      const auth = route.request().headers()['authorization'] || '';
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ organizations: [] }),
        });
        return;
      }
      if (route.request().method() === 'POST') {
        createdWithBearer = auth;
        expect(auth).toBe('Bearer session-test');
        expect(auth.toLowerCase()).not.toContain('bootstrap');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'o2', name: 'Globex', slug: 'globex', tier: 'free' }),
        });
        return;
      }
      await route.fallback();
    });

    await page.goto('/checkout');
    await page.locator('#org-create-name').fill('Globex');
    await page.locator('#org-create').click();
    await expect(page.locator('#checkout-message')).toContainText('Globex');
    await expect(page.locator('#org-select')).toHaveValue('globex');
    expect(createdWithBearer).toBe('Bearer session-test');
  });
});
