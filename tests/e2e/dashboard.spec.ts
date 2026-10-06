import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-101: Authenticated /dashboard route (post-pay chrome).
 * Children: SITE-101a–d. SITE-101e: does not block SITE-114 / MONO-021.
 */

test.describe('dashboard auth gate', () => {
  test('unauthenticated visitors redirect to login with next=/dashboard (SITE-101a)', async ({
    page,
  }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/\/login\?next=/);
    expect(decodeURIComponent(page.url())).toMatch(/next=.*\/dashboard/);
    await expect(page.getByRole('button', { name: /Continue with GitHub/i })).toBeVisible();
  });

  test('missing/expired session is treated as unauthenticated (SITE-101c)', async ({ page }) => {
    await page.goto('/dashboard');
    await page.evaluate(() => {
      sessionStorage.setItem('rtmx.session', JSON.stringify({ email: 'no-token@example.com' }));
    });
    await page.goto('/dashboard');
    await page.waitForURL(/\/login\?next=/);
    expect(decodeURIComponent(page.url())).toMatch(/next=.*\/dashboard/);
  });

  test('authenticated visit renders dashboard shell (SITE-101b)', async ({ page }) => {
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-1',
          email: 'ada@rtmx.ai',
          display_name: 'Ada Lovelace',
          login: 'ada',
        }),
      });
    });
    await page.route('**/orgs', async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          organizations: [{ id: 'org-1', name: 'Acme', slug: 'acme' }],
        }),
      });
    });

    await page.goto('/login');
    await page.evaluate(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'sess-test',
          email: 'ada@rtmx.ai',
          display_name: 'Ada Lovelace',
          login: 'ada',
        }),
      );
    });
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-shell')).toBeVisible();
    await expect(page.getByTestId('dashboard-identity')).toHaveText(/Ada Lovelace/);
    await expect(page.getByTestId('dashboard-org-list')).toContainText(/Acme/);
    await expect(page.getByRole('link', { name: 'Account' })).toBeVisible();
  });

  test('401 from auth/me clears session and redirects (SITE-101c)', async ({ page }) => {
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({ status: 401, body: 'unauthorized' });
    });
    await page.goto('/login');
    await page.evaluate(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({ token: 'expired', email: 'old@rtmx.ai' }),
      );
    });
    await page.goto('/dashboard');
    await page.waitForURL(/\/login\?next=/);
    const session = await page.evaluate(() => sessionStorage.getItem('rtmx.session'));
    expect(session).toBeNull();
  });
});

test.describe('dashboard does not block account chrome (SITE-101e)', () => {
  test('SITE-114 session chrome still renders on splash home', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('session-chrome')).toBeVisible();
  });
});
