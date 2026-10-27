import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-152 / REQ-MONO-043a: Branded HTTP 404 for missing paths.
 */

test.describe('branded path 404 (SITE-152)', () => {
  test('missing path returns branded recovery page', async ({ page }) => {
    const resp = await page.goto('/this-page-does-not-exist-xyzzy');
    expect(resp?.status()).toBe(404);
    await expect(page.getByTestId('branded-404')).toBeVisible();
    await expect(page.getByTestId('404-home')).toHaveAttribute('href', '/');
    await expect(page.getByTestId('404-docs')).toHaveAttribute('href', '/docs');
    await expect(page.getByTestId('404-sync')).toHaveAttribute('href', '/sync');
    await expect(page.getByTestId('404-account')).toHaveAttribute('href', '/account');
  });
});

/**
 * REQ-SITE-153 / REQ-MONO-043c: Apex recovery after unknown-host edge redirect.
 * Live DNS for x.rtmx.ai is ops cutover; this covers the landing UX.
 */
test.describe('unknown host recovery landing (SITE-153)', () => {
  test('from_host query shows recovery banner', async ({ page }) => {
    await page.goto('/?from_host=x.rtmx.ai');
    await expect(page.getByTestId('from-host-banner')).toBeVisible();
    await expect(page.getByTestId('from-host-docs')).toHaveAttribute('href', '/docs');
    await expect(page.getByTestId('from-host-sync')).toHaveAttribute('href', '/sync');
  });

  test('no banner without from_host', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('from-host-banner')).toBeHidden();
  });
});
