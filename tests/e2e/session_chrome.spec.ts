import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-114: header shows signed-in identity / Sign in / Sign out.
 * REQ-SITE-134: validate token; clear on 401; soft checkout prompt.
 */

async function mockAuthMeOk(
  page: import('@playwright/test').Page,
  body: { id?: string; email: string; display_name: string; tier?: string } = {
    id: 'u1',
    email: 'buyer@example.com',
    display_name: 'Buyer Example',
    tier: 'free',
  },
) {
  await page.route('**/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

test.describe('header session chrome', () => {
  test('signed-out visitors see Sign in', async ({ page }) => {
    await page.goto('/pricing');
    const chrome = page.getByTestId('session-chrome');
    await expect(chrome.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(chrome.getByTestId('session-identity')).toBeHidden();
  });

  test('signed-in visitors see identity and can Sign out', async ({ page }) => {
    await mockAuthMeOk(page);
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
    await mockAuthMeOk(page, {
      email: 'rhino11@users.noreply.github.com',
      display_name: 'rhino11@users.noreply.github.com',
    });
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
    await mockAuthMeOk(page, {
      email: '12345678+rhino11@users.noreply.github.com',
      display_name: '12345678+rhino11@users.noreply.github.com',
    });
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
    await mockAuthMeOk(page, {
      email: 'rhino11@users.noreply.github.com',
      display_name: 'rhino11@users.noreply.github.com',
    });
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

  test('SITE-134: stale token clears chrome to Sign in', async ({ page }) => {
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Unauthorized' }),
      });
    });
    // SITE-135: silent providers unavailable → fall through to SITE-134 clear
    await page.route('**/auth/login/**', async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: {
            error: 'login_required',
            silent_supported: false,
            provider: 'github',
          },
        }),
      });
    });
    await page.goto('/pricing');
    await page.evaluate(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'expired-token',
          email: 'stale@example.com',
          display_name: 'Stale User',
        }),
      );
    });
    await page.reload();
    const chrome = page.getByTestId('session-chrome');
    await expect(chrome.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(chrome.getByTestId('session-identity')).toBeHidden();
    const remaining = await page.evaluate(() => sessionStorage.getItem('rtmx.session'));
    expect(remaining).toBeNull();
  });

  test('SITE-135: silent OAuth starts when Sync returns 401 and IdP supports prompt=none', async ({
    page,
  }) => {
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Unauthorized' }),
      });
    });
    let silentLogin = false;
    await page.route('**/auth/login/**', async (route) => {
      const url = route.request().url();
      if (url.includes('prompt=none') && url.includes('/google')) {
        silentLogin = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            authorization_url: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=none&state=x',
            state: 'x',
            provider: 'google',
            silent_supported: true,
            prompt: 'none',
            next: '/pricing',
          }),
        });
        return;
      }
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: { error: 'login_required', silent_supported: false },
        }),
      });
    });

    await page.addInitScript(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'expired-token',
          email: 'buyer@gmail.com',
          display_name: 'Buyer',
        }),
      );
      sessionStorage.setItem('rtmx.oauth.provider', 'google');
    });

    const nav = page.waitForURL(/accounts\.google\.com/, { timeout: 10000 });
    await page.goto('/pricing');
    await nav;
    expect(silentLogin).toBe(true);
  });

  test('SITE-134: checkout 401 soft-prompts Sign in without red sign-out-again copy', async ({
    page,
  }) => {
    // auth/me stays valid long enough for chrome optimistic render; orgs 401 drives soft sign-out
    let meCalls = 0;
    await page.route('**/auth/me', async (route) => {
      meCalls += 1;
      // After soft sign-out, any re-validate must not resurrect
      if (meCalls > 1) {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ detail: 'Unauthorized' }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'u1',
          email: 'buyer@example.com',
          display_name: 'Buyer Example',
          tier: 'free',
        }),
      });
    });
    await page.route('**/orgs', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ detail: 'Unauthorized' }),
        });
        return;
      }
      await route.continue();
    });

    await page.addInitScript(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'stale-for-orgs',
          email: 'buyer@example.com',
          display_name: 'Buyer Example',
        }),
      );
    });
    await page.goto('/checkout?tab=team');

    const message = page.locator('#checkout-message');
    await expect(message).toContainText('Your session ended');
    await expect(message.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login');
    await expect(message).not.toContainText('Sign out and sign in again');
    await expect(message).toHaveClass(/is-info/);

    const chrome = page.getByTestId('session-chrome');
    await expect(chrome.getByRole('link', { name: 'Sign in' })).toBeVisible({ timeout: 10000 });
    await expect(chrome.getByTestId('session-identity')).toBeHidden();
  });
});
