import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-116 / REQ-MONO-025: organization admin panel.
 * Static shell at /orgs/admin?slug= (GitHub Pages cannot host dynamic segments).
 */

const adminURL = '/orgs/admin?slug=acme';

test.describe('org admin panel', () => {
  test('unauthenticated visitors redirect to login', async ({ page }) => {
    await page.goto(adminURL);
    await page.waitForURL(/\/login\?next=/);
    expect(page.url()).toMatch(/orgs(%2F|\/)admin|slug=acme/);
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

    await page.goto(adminURL);
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

  test('MONO-050b: admin can mint and revoke SCIM tokens', async ({ page }) => {
    let keys: Array<{
      id: string;
      name: string;
      scope: string;
      prefix: string;
      org_id: string;
      is_active: boolean;
    }> = [];

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
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: 'org-1',
          members: [{ id: 'm1', user_id: 'u-admin', role: 'admin', joined_at: null }],
        }),
      });
    });
    await page.route(/\/keys(\?.*)?$/, async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      if (req.method() === 'GET') {
        expect(url.searchParams.get('org_id')).toBe('org-1');
        expect(url.searchParams.get('scope')).toBe('scim');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ keys }),
        });
        return;
      }
      if (req.method() === 'POST') {
        const body = req.postDataJSON();
        expect(body.scope).toBe('scim');
        expect(body.org_id).toBe('org-1');
        const created = {
          id: 'scim-1',
          name: body.name || 'SCIM IdP',
          scope: 'scim',
          prefix: 'rtmx_sc_',
          org_id: 'org-1',
          is_active: true,
          key: 'rtmx_sc_once-secret',
          created_at: new Date().toISOString(),
        };
        keys = [
          {
            id: created.id,
            name: created.name,
            scope: created.scope,
            prefix: created.prefix,
            org_id: created.org_id,
            is_active: true,
          },
        ];
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(created),
        });
        return;
      }
      await route.continue();
    });
    await page.route('**/keys/scim-1', async (route) => {
      expect(route.request().method()).toBe('DELETE');
      keys = keys.map((k) => ({ ...k, is_active: false }));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'revoked' }),
      });
    });

    await page.goto(adminURL);
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

    await expect(page.getByTestId('scim-token-panel')).toBeVisible();
    await page.getByTestId('scim-mint').click();
    await expect(page.getByTestId('scim-once')).toContainText('rtmx_sc_once-secret');
    await expect(page.locator('#scim-body')).toContainText('rtmx_sc_');
    await page.getByTestId('scim-revoke').click();
    await expect(page.locator('#admin-message')).toContainText(/revoked/i);
  });

  test('MONO-051c: admin can save room labels', async ({ page }) => {
    await page.route('**/orgs', async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          organizations: [{ id: 'org-1', name: 'Acme', slug: 'acme', lbac_enabled: true }],
        }),
      });
    });
    await page.route('**/orgs/org-1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'org-1',
          name: 'Acme',
          slug: 'acme',
          lbac_enabled: true,
        }),
      });
    });
    await page.route('**/orgs/org-1/members', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: 'org-1',
          members: [{ id: 'm1', user_id: 'u-admin', role: 'admin', joined_at: null }],
        }),
      });
    });
    await page.route('**/orgs/org-1/rooms', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ org_id: 'org-1', rooms: ['main', 'mvp'] }),
      });
    });
    await page.route(/\/keys(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ keys: [] }),
      });
    });
    await page.route('**/orgs/org-1/rooms/mvp/labels', async (route) => {
      expect(route.request().method()).toBe('PUT');
      const body = route.request().postDataJSON();
      expect(body.classification).toBe('SECRET');
      expect(body.compartments).toEqual(['PROG-A']);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          room_key: 'acme:mvp',
          classification: 'SECRET',
          compartments: ['PROG-A'],
        }),
      });
    });

    await page.goto(adminURL);
    await page.evaluate(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'test-session',
          email: 'admin@example.com',
          user_id: 'u-admin',
        }),
      );
    });
    await page.reload();

    await expect(page.getByTestId('lbac-admin-panel')).toBeVisible();
    await page.getByTestId('lbac-room-name').fill('mvp');
    await page.getByTestId('lbac-room-class').fill('SECRET');
    await page.getByTestId('lbac-room-comps').fill('PROG-A');
    await page.getByTestId('lbac-save-room').click();
    await expect(page.locator('#admin-message')).toContainText(/Room labels saved/i);
  });

  test('MONO-051b: admin can toggle LBAC and save subject attributes', async ({ page }) => {
    let lbac = false;
    await page.route('**/orgs', async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          organizations: [{ id: 'org-1', name: 'Acme', slug: 'acme', lbac_enabled: lbac }],
        }),
      });
    });
    await page.route('**/orgs/org-1', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'org-1',
            name: 'Acme',
            slug: 'acme',
            lbac_enabled: lbac,
          }),
        });
        return;
      }
      if (method === 'PATCH') {
        const body = route.request().postDataJSON();
        lbac = !!body.lbac_enabled;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'org-1',
            name: 'Acme',
            slug: 'acme',
            lbac_enabled: lbac,
          }),
        });
        return;
      }
      await route.continue();
    });
    await page.route('**/orgs/org-1/members', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: 'org-1',
          members: [{ id: 'm1', user_id: 'u-admin', role: 'admin', joined_at: null }],
        }),
      });
    });
    await page.route(/\/keys(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ keys: [] }),
      });
    });
    await page.route('**/orgs/org-1/subjects/u-admin/attributes', async (route) => {
      expect(route.request().method()).toBe('PUT');
      const body = route.request().postDataJSON();
      expect(body.clearance).toBe('SECRET');
      expect(body.compartments).toEqual(['PROG-A']);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: 'org-1',
          user_id: 'u-admin',
          attributes: body,
        }),
      });
    });

    await page.goto(adminURL);
    await page.evaluate(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'test-session',
          email: 'admin@example.com',
          user_id: 'u-admin',
        }),
      );
    });
    await page.reload();

    await expect(page.getByTestId('lbac-admin-panel')).toBeVisible();
    await page.getByTestId('lbac-enabled').check();
    await page.getByTestId('lbac-save-toggle').click();
    await expect(page.locator('#admin-message')).toContainText(/LBAC enabled/i);
    await page.getByTestId('lbac-clearance').fill('SECRET');
    await page.getByTestId('lbac-compartments').fill('PROG-A');
    await page.getByTestId('lbac-save-attrs').click();
    await expect(page.locator('#admin-message')).toContainText(/Subject attributes saved/i);
  });

  test('MONO-054c: admin can list audit events', async ({ page }) => {
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
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: 'org-1',
          members: [{ id: 'm1', user_id: 'u-admin', role: 'admin', joined_at: null }],
        }),
      });
    });
    await page.route('**/orgs/org-1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'org-1',
          name: 'Acme',
          slug: 'acme',
          lbac_enabled: false,
        }),
      });
    });
    await page.route(/\/keys(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ keys: [] }),
      });
    });
    await page.route(/\/orgs\/org-1\/rooms(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ org_id: 'org-1', rooms: [] }),
      });
    });
    await page.route(/\/orgs\/org-1\/audit(\?.*)?$/, async (route) => {
      expect(route.request().method()).toBe('GET');
      const url = new URL(route.request().url());
      expect(url.searchParams.get('limit')).toBe('50');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: 'org-1',
          retention: 'process',
          next_cursor: null,
          events: [
            {
              sequence: 2,
              timestamp: '2026-10-27T18:00:00+00:00',
              event_type: 'connections',
              action: 'credential.issue',
              user_id: 'u-admin',
              resource_id: 'c1',
              details: { provider: 'asana', via_shared_org_id: 'org-1' },
            },
            {
              sequence: 1,
              timestamp: '2026-10-27T17:00:00+00:00',
              event_type: 'scim',
              action: 'users.create',
              user_id: 'scim',
              resource_id: 'u-new',
              details: { org_id: 'org-1' },
            },
          ],
        }),
      });
    });

    await page.goto(adminURL);
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

    await expect(page.getByTestId('audit-admin-panel')).toBeVisible();
    await expect(page.getByTestId('audit-row').first()).toContainText('credential.issue');
    await expect(page.locator('#audit-body')).toContainText('users.create');
    await expect(page.locator('#audit-body')).toContainText('scim');
  });

  test('MONO-056c: admin can filter audit by event_type', async ({ page }) => {
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
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: 'org-1',
          members: [{ id: 'm1', user_id: 'u-admin', role: 'admin', joined_at: null }],
        }),
      });
    });
    await page.route('**/orgs/org-1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'org-1',
          name: 'Acme',
          slug: 'acme',
          lbac_enabled: false,
        }),
      });
    });
    await page.route(/\/keys(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ keys: [] }),
      });
    });
    await page.route(/\/orgs\/org-1\/rooms(\?.*)?$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ org_id: 'org-1', rooms: [] }),
      });
    });
    await page.route(/\/orgs\/org-1\/audit(\?.*)?$/, async (route) => {
      const url = new URL(route.request().url());
      const eventType = url.searchParams.get('event_type');
      const events =
        eventType === 'connections'
          ? [
              {
                sequence: 2,
                timestamp: '2026-10-27T18:00:00+00:00',
                event_type: 'connections',
                action: 'credential.issue',
                user_id: 'u-admin',
                resource_id: 'c1',
                details: {},
              },
            ]
          : [
              {
                sequence: 2,
                timestamp: '2026-10-27T18:00:00+00:00',
                event_type: 'connections',
                action: 'credential.issue',
                user_id: 'u-admin',
                resource_id: 'c1',
                details: {},
              },
              {
                sequence: 1,
                timestamp: '2026-10-27T17:00:00+00:00',
                event_type: 'scim',
                action: 'users.create',
                user_id: 'scim',
                resource_id: 'u-new',
                details: {},
              },
            ];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: 'org-1',
          retention: 'sql',
          next_cursor: null,
          events,
        }),
      });
    });

    await page.goto(adminURL);
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

    await expect(page.getByTestId('audit-filters')).toBeVisible();
    await page.getByTestId('audit-filter-type').selectOption('connections');
    await expect(page.locator('#audit-body')).toContainText('credential.issue');
    await expect(page.locator('#audit-body')).not.toContainText('users.create');
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

    await page.goto(adminURL);
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
    await expect(page.getByTestId('scim-token-panel')).toBeHidden();
    await expect(page.getByTestId('audit-admin-panel')).toBeHidden();
  });
});
