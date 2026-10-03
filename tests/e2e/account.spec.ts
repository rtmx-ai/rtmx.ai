import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-115 / REQ-MONO-023c: /account management page.
 */

test.describe('account page', () => {
  test('unauthenticated visitors redirect to login', async ({ page }) => {
    await page.goto('/account');
    await page.waitForURL(/\/login\?next=/);
    expect(page.url()).toContain('next=%2Faccount');
  });

  test('signed-in visitors see profile and connections chrome', async ({ page }) => {
    await page.route('**/orgs', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          organizations: [{ id: '1', name: 'Acme', slug: 'acme' }],
        }),
      });
    });
    await page.route('**/connections', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ connections: [] }),
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

    await page.goto('/account');
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

    await expect(page.locator('#account-display-name')).toHaveText('Buyer Example');
    await expect(page.locator('#account-email')).toHaveText('buyer@example.com');
    await expect(page.locator('#org-list')).toContainText('Acme');
    await expect(page.getByRole('link', { name: 'Admin' })).toHaveAttribute(
      'href',
      '/orgs/acme/admin',
    );
    await expect(page.locator('#connect-asana')).toBeVisible();
    await expect(page.getByTestId('github-fab')).toBeHidden();
  });

  test('owner can share a connection into an org', async ({ page }) => {
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'u1',
          email: 'buyer@example.com',
          display_name: 'Buyer',
          tier: 'free',
        }),
      });
    });
    await page.route('**/orgs', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          organizations: [{ id: 'org-1', name: 'Acme', slug: 'acme' }],
        }),
      });
    });
    let shared = false;
    await page.route('**/connections**', async (route) => {
      const url = route.request().url();
      if (route.request().method() === 'POST' && url.includes('/share')) {
        shared = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'c1',
            provider: 'asana',
            status: 'active',
            owner_user_id: 'u1',
            display_label: 'Asana',
            scopes: ['default'],
            shared_org_ids: ['org-1'],
          }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          connections: [
            {
              id: 'c1',
              provider: 'asana',
              status: 'active',
              owner_user_id: 'u1',
              display_label: 'Asana',
              scopes: ['default'],
              shared_org_ids: shared ? ['org-1'] : [],
            },
          ],
        }),
      });
    });

    await page.goto('/account');
    await page.evaluate(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'test-session',
          email: 'buyer@example.com',
          display_name: 'Buyer',
          user_id: 'u1',
        }),
      );
    });
    await page.reload();

    await expect(page.locator('.share-select')).toBeVisible();
    await page.locator('.share-select').selectOption('org-1');
    await expect(page.locator('#account-message')).toContainText(/shared/i);
  });
});
