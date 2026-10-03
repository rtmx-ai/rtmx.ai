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

  test('numeric GitHub noreply prefix is dropped', async ({ page }) => {
    await page.goto('/checkout');
    await page.evaluate(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'test-session',
          email: '12345678+rhino11@users.noreply.github.com',
          display_name: '12345678+rhino11@users.noreply.github.com',
        }),
      );
    });
    await page.reload();
    await expect(page.getByTestId('session-identity')).toHaveText('rhino11');
    await expect(page.getByTestId('session-identity')).not.toContainText('noreply');
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
    const width = page.viewportSize()!.width;
    expect(chromeBox).toBeTruthy();
    expect(fabBox).toBeTruthy();
    // Pinned to the top-right of the site header, not the content column.
    expect(chromeBox!.x + chromeBox!.width).toBeGreaterThan(width - 48);
    expect(chromeBox!.y).toBeLessThan(80);
    // GitHub FAB is bottom-right.
    expect(fabBox!.x).toBeGreaterThan(width * 0.7);
    expect(fabBox!.y).toBeGreaterThan(page.viewportSize()!.height * 0.7);
  });

  test('checkout splash keeps identity at the top-right, not beside search', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/checkout');
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
    const chrome = page.getByTestId('session-chrome');
    await expect(chrome.getByTestId('session-identity')).toHaveText('rhino11');
    await expect(chrome.getByTestId('session-identity')).toHaveAttribute('href', '/account');
    await expect(page.getByTestId('github-fab')).toBeHidden();
    const box = await chrome.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.x + box!.width).toBeGreaterThan(1280 - 48);
    expect(box!.y).toBeLessThan(80);
  });
});
