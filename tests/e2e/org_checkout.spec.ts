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
    await page.route('**/auth/me', async (route) => {
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
    const orgs: Array<{ id: string; name: string; slug: string; tier: string }> = [];
    await page.route('**/orgs', async (route) => {
      const auth = route.request().headers()['authorization'] || '';
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ organizations: orgs }),
        });
        return;
      }
      if (route.request().method() === 'POST') {
        createdWithBearer = auth;
        expect(auth).toBe('Bearer session-test');
        expect(auth.toLowerCase()).not.toContain('bootstrap');
        const created = { id: 'o2', name: 'Globex', slug: 'globex', tier: 'free' };
        orgs.push(created);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(created),
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

  test('duplicate slug 409 shows actionable error and refreshes org list', async ({ page }) => {
    let createPosted = false;
    await page.route('**/orgs', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            organizations: createPosted
              ? [
                  {
                    id: 'o1',
                    name: 'irregularchat',
                    slug: 'irregularchat',
                    tier: 'free',
                    visibility: 'public',
                  },
                ]
              : [],
          }),
        });
        return;
      }
      if (route.request().method() === 'POST') {
        createPosted = true;
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            detail: 'Organization slug already taken: irregularchat',
          }),
        });
        return;
      }
      await route.fallback();
    });

    await page.goto('/checkout');
    await expect(page.getByTestId('org-create-wrap')).toBeVisible();
    await page.getByTestId('org-create-name').fill('irregularchat');
    await page.getByTestId('org-create').click();
    await expect(page.locator('#checkout-message')).toContainText(/already|taken|exists/i);
    await expect(page.getByTestId('org-select')).toContainText('irregularchat');
  });

  test('network failure on create does not claim CORS/allowlist alone', async ({ page }) => {
    await page.route('**/orgs', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ organizations: [] }),
        });
        return;
      }
      if (route.request().method() === 'POST') {
        await route.abort('failed');
        return;
      }
      await route.fallback();
    });

    await page.goto('/checkout');
    await page.getByTestId('org-create-name').fill('Globex');
    await page.getByTestId('org-create').click();
    await expect(page.locator('#checkout-message')).toContainText(/Could not reach/i);
    await expect(page.locator('#checkout-message')).toContainText(/already be taken|another|refresh/i);
  });

  test('Individual public create handles 409 with list refresh', async ({ page }) => {
    let createPosted = false;
    await page.route('**/orgs', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            organizations: createPosted
              ? [
                  {
                    id: 'p1',
                    name: 'irregularchat',
                    slug: 'irregularchat',
                    visibility: 'public',
                  },
                ]
              : [],
          }),
        });
        return;
      }
      if (route.request().method() === 'POST') {
        createPosted = true;
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            detail: 'Organization slug already taken: irregularchat',
          }),
        });
        return;
      }
      await route.fallback();
    });

    await page.goto('/checkout?tab=individual');
    await expect(page.getByTestId('individual-public-panel')).toBeVisible();
    await page.getByTestId('individual-public-create-name').fill('irregularchat');
    await page.getByTestId('individual-public-create').click();
    await expect(page.locator('#checkout-message')).toContainText(/already|taken|exists/i);
    await expect(page.getByTestId('individual-public-org')).toContainText('irregularchat');
  });
});
