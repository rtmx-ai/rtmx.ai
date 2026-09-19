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

  test('GitHub noreply email shows username only', async ({ page }) => {
    await page.goto('/pricing');
    await page.evaluate(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'test-session',
          email: 'rhino11@users.noreply.github.com',
          display_name: 'rhino11@users.noreply.github.com',
        }),
      );
    });
    await page.reload();
    await expect(page.getByTestId('session-identity')).toHaveText('rhino11');
  });

  test('Sign in points at /login', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByTestId('session-chrome').getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/login',
    );
  });

  test('session chrome sits in the header right group; GitHub is a FAB', async ({ page }) => {
    await page.goto('/pricing');
    const chrome = page.getByTestId('session-chrome');
    const fab = page.getByTestId('github-fab');
    await expect(chrome).toBeVisible();
    await expect(fab).toBeVisible();
    await expect(fab).toHaveAttribute('href', /github\.com\/rtmx-ai\/rtmx/);

    const chromeBox = await chrome.boundingBox();
    const fabBox = await fab.boundingBox();
    expect(chromeBox).toBeTruthy();
    expect(fabBox).toBeTruthy();
    // Identity chrome is in the top-right of the header (not centered).
    expect(chromeBox!.x).toBeGreaterThan(page.viewportSize()!.width * 0.55);
    expect(chromeBox!.y).toBeLessThan(80);
    // GitHub FAB is bottom-right.
    expect(fabBox!.x).toBeGreaterThan(page.viewportSize()!.width * 0.7);
    expect(fabBox!.y).toBeGreaterThan(page.viewportSize()!.height * 0.7);
  });
});
