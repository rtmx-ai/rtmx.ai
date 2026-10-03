import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-116 / REQ-MONO-025: organization admin panel.
 */

test.describe('org admin panel', () => {
  test('unauthenticated visitors redirect to login', async ({ page }) => {
    await page.goto('/orgs/acme/admin');
    await page.waitForURL(/\/login\?next=/);
    expect(page.url()).toMatch(/orgs%2Facme%2Fadmin|orgs\/acme\/admin/);
  });

  test('admin can list members and change roles', async ({ page }) => {
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
    await page.route('**/orgs/org-1/members', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            org_id: 'org-1',
            members: [
              { id: 'm1', user_id: 'u-admin', role: 'admin', joined_at: null },
              { id: 'm2', user_id: 'u-member', role: 'member', joined_at: null },
            ],
          }),
        });
        return;
      }
      await route.continue();
    });
    await page.route('**/orgs/org-1/members/u-member', async (route) => {
      expect(route.request().method()).toBe('PATCH');
      const body = route.request().postDataJSON();
      expect(body.role).toBe('viewer');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ org_id: 'org-1', user_id: 'u-member', role: 'viewer' }),
      });
    });

    await page.goto('/orgs/acme/admin');
    await page.evaluate(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'test-session',
          email: 'admin@example.com',
          display_name: 'Admin',
          user_id: 'u-admin',
        }),
      );
    });
    await page.reload();

    await expect(page.locator('#member-table')).toBeVisible();
    await expect(page.locator('#member-body')).toContainText('u-member');
    const roleSelect = page.locator('#member-body select').nth(1);
    await roleSelect.selectOption('viewer');
    await expect(page.locator('#admin-message')).toContainText('Updated role');
    await expect(page.getByRole('link', { name: /billing/i })).toHaveAttribute(
      'href',
      '/billing/manage',
    );
  });

  test('member is denied admin panel', async ({ page }) => {
    await page.route('**/orgs', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          organizations: [{ id: 'org-1', name: 'Acme', slug: 'acme' }],
        }),
      });
    });
    await page.route('**/orgs/org-1/members', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: 'org-1',
          members: [{ id: 'm2', user_id: 'u-member', role: 'member', joined_at: null }],
        }),
      });
    });

    await page.goto('/orgs/acme/admin');
    await page.evaluate(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'test-session',
          email: 'member@example.com',
          user_id: 'u-member',
        }),
      );
    });
    await page.reload();

    await expect(page.locator('#admin-status')).toContainText(/Access denied/i);
    await expect(page.locator('#member-table')).toBeHidden();
  });
});
