import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-150 / REQ-MONO-042: Documentation under /docs.
 * REQ-SITE-151: Legacy root docs paths redirect to /docs/*.
 */

test.describe('docs route prefix (SITE-150/151)', () => {
  test('Docs nav targets /docs and serves documentation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('nav-docs')).toHaveAttribute('href', '/docs');
    await page.getByTestId('nav-docs').click();
    await expect(page).toHaveURL(/\/docs\/?$/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('adapters docs live under /docs/adapters', async ({ page }) => {
    const resp = await page.goto('/docs/adapters');
    expect(resp?.status()).toBe(200);
    await expect(page.locator('main')).toContainText(/adapter/i);
  });

  test('legacy /adapters redirects to /docs/adapters', async ({ page }) => {
    await page.goto('/adapters');
    await expect(page).toHaveURL(/\/docs\/adapters\/?$/);
  });

  test('legacy /installation redirects to /docs/installation', async ({ page }) => {
    await page.goto('/installation');
    await expect(page).toHaveURL(/\/docs\/installation\/?$/);
  });

  test('account remains a top-level product route', async ({ page }) => {
    await page.goto('/account');
    await expect(page).toHaveURL(/\/login\?next=/);
  });
});
