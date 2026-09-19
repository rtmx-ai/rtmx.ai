import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-114: header shows signed-in identity / Sign in / Sign out.
 */

test.describe('header session chrome', () => {
  test('signed-out visitors see Sign in', async ({ page }) => {
    await page.goto('/pricing');
    const chrome = page.getByTestId('session-chrome');
    await expect(chrome.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(chrome.getByTestId('session-identity')).toBeHidden();
  });

  test('signed-in visitors see identity and can Sign out', async ({ page }) => {
    await page.goto('/pricing');
    await page.evaluate(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'test-session',
          email: 'buyer@example.com',
          display_name: 'Buyer Example',
        }),
      );
    });
    await page.reload();

    const chrome = page.getByTestId('session-chrome');
    await expect(chrome.getByTestId('session-identity')).toHaveText('Buyer Example');
    await expect(chrome.getByRole('link', { name: 'Sign in' })).toBeHidden();

    await chrome.getByRole('button', { name: 'Sign out' }).click();
    await expect(chrome.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(chrome.getByTestId('session-identity')).toBeHidden();
    const remaining = await page.evaluate(() => sessionStorage.getItem('rtmx.session'));
    expect(remaining).toBeNull();
  });

  test('Sign in points at /login', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByTestId('session-chrome').getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/login',
    );
  });
});
