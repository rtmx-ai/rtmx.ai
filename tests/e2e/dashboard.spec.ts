import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-101: Authenticated /dashboard route (post-pay chrome).
 * REQ-SITE-103: WebSocket connect with session token.
 * REQ-SITE-104: Org-scoped room list isolation.
 */

async function seedSession(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.evaluate(() => {
    sessionStorage.setItem(
      'rtmx.session',
      JSON.stringify({
        token: 'sess-test',
        email: 'ada@rtmx.ai',
        display_name: 'Ada Lovelace',
        login: 'ada',
      }),
    );
  });
}

test.describe('dashboard auth gate (SITE-101)', () => {
  test('unauthenticated visitors redirect to login with next=/dashboard (SITE-101a)', async ({
    page,
  }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/\/login\?next=/);
    expect(decodeURIComponent(page.url())).toMatch(/next=.*\/dashboard/);
    await expect(page.getByRole('button', { name: /Continue with GitHub/i })).toBeVisible();
  });

  test('missing/expired session is treated as unauthenticated (SITE-101c)', async ({ page }) => {
    await page.goto('/dashboard');
    await page.evaluate(() => {
      sessionStorage.setItem('rtmx.session', JSON.stringify({ email: 'no-token@example.com' }));
    });
    await page.goto('/dashboard');
    await page.waitForURL(/\/login\?next=/);
    expect(decodeURIComponent(page.url())).toMatch(/next=.*\/dashboard/);
  });

  test('authenticated visit renders dashboard shell (SITE-101b)', async ({ page }) => {
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-1',
          email: 'ada@rtmx.ai',
          display_name: 'Ada Lovelace',
          login: 'ada',
        }),
      });
    });
    await page.route('**/orgs', async (route) => {
      if (route.request().method() !== 'GET' || route.request().url().includes('/rooms')) {
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
    await page.route('**/orgs/acme/rooms', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ org_id: 'org-1', org_slug: 'acme', rooms: [] }),
      });
    });
    await page.routeWebSocket(/\/sync\//, (ws) => {
      ws.connectToServer();
    });

    await seedSession(page);
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-shell')).toBeVisible();
    await expect(page.getByTestId('dashboard-identity')).toHaveText(/Ada Lovelace/);
    await expect(page.getByTestId('dashboard-org-list')).toContainText(/Acme/);
    await expect(page.getByRole('link', { name: 'Account' })).toBeVisible();
  });

  test('401 from auth/me clears session and redirects (SITE-101c)', async ({ page }) => {
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({ status: 401, body: 'unauthorized' });
    });
    await seedSession(page);
    await page.goto('/dashboard');
    await page.waitForURL(/\/login\?next=/);
    const session = await page.evaluate(() => sessionStorage.getItem('rtmx.session'));
    expect(session).toBeNull();
  });
});

test.describe('dashboard WebSocket (SITE-103)', () => {
  test('connects to /sync/{org}/{room} with session token and shows live (SITE-103a/b/d)', async ({
    page,
  }) => {
    const seen: string[] = [];
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-1',
          email: 'ada@rtmx.ai',
          display_name: 'Ada Lovelace',
          login: 'ada',
        }),
      });
    });
    await page.route('**/orgs', async (route) => {
      if (route.request().url().includes('/rooms')) {
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
    await page.route('**/orgs/acme/rooms', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: 'org-1',
          org_slug: 'acme',
          rooms: [{ name: 'mvp', org_slug: 'acme', connections: 0 }],
        }),
      });
    });
    await page.routeWebSocket(/\/sync\//, (ws) => {
      seen.push(ws.url());
      ws.onMessage(() => {});
    });

    await seedSession(page);
    await page.goto('/dashboard');
    await expect
      .poll(() => seen.some((u) => u.includes('/sync/acme/mvp') && u.includes('token=sess-test')), {
        timeout: 10000,
      })
      .toBeTruthy();
    await expect(page.getByTestId('dashboard-sync-status')).toHaveAttribute('data-state', 'connected', {
      timeout: 10000,
    });
  });

  test('auth failure is visible — no silent hang (SITE-103c)', async ({ page }) => {
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-1',
          email: 'ada@rtmx.ai',
          display_name: 'Ada Lovelace',
        }),
      });
    });
    await page.route('**/orgs', async (route) => {
      if (route.request().url().includes('/rooms')) {
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
    await page.route('**/orgs/acme/rooms', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: 'org-1',
          org_slug: 'acme',
          rooms: [{ name: 'mvp', org_slug: 'acme', connections: 0 }],
        }),
      });
    });
    await page.routeWebSocket(/\/sync\//, (ws) => {
      // Close with auth-required code after the page opens the socket.
      ws.onMessage(() => {});
      // Playwright: close from server side
      void Promise.resolve().then(() => ws.close({ code: 4401, reason: 'Authentication required' }));
    });

    await seedSession(page);
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-sync-status')).toHaveAttribute(
      'data-state',
      'auth-failed',
      { timeout: 10000 },
    );
    await expect(page.getByTestId('dashboard-sync-status')).toContainText(/Authentication|4401/i);
  });
});

test.describe('dashboard rooms isolation (SITE-104)', () => {
  test('renders only rooms for the selected org (SITE-104a/b)', async ({ page }) => {
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-1',
          email: 'ada@rtmx.ai',
          display_name: 'Ada Lovelace',
        }),
      });
    });
    await page.route('**/orgs', async (route) => {
      if (route.request().url().includes('/rooms')) {
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
    await page.route('**/orgs/acme/rooms', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          org_id: 'org-1',
          org_slug: 'acme',
          rooms: [
            { name: 'mvp', org_slug: 'acme', connections: 1 },
            // Hostile/extra field — must be filtered if org_slug mismatches
            { name: 'secret', org_slug: 'other-tenant', connections: 9 },
          ],
        }),
      });
    });
    await page.routeWebSocket(/\/sync\//, (ws) => {
      ws.onMessage(() => {});
    });

    await seedSession(page);
    await page.goto('/dashboard');
    const list = page.getByTestId('dashboard-room-list');
    await expect(list).toContainText('mvp');
    await expect(list).not.toContainText('secret');
    await expect(page.getByTestId('dashboard-selected-org')).toContainText(/Acme|acme/);
  });

  test('empty org shows empty-state, not foreign rooms (SITE-104c/d)', async ({ page }) => {
    await page.route('**/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-1',
          email: 'ada@rtmx.ai',
          display_name: 'Ada Lovelace',
        }),
      });
    });
    await page.route('**/orgs', async (route) => {
      if (route.request().url().includes('/rooms')) {
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
    await page.route('**/orgs/acme/rooms', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ org_id: 'org-1', org_slug: 'acme', rooms: [] }),
      });
    });
    await page.routeWebSocket(/\/sync\//, (ws) => {
      ws.onMessage(() => {});
    });

    await seedSession(page);
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-room-empty')).toBeVisible();
    await expect(page.getByTestId('dashboard-room-empty')).toContainText(/No rooms/);
    await expect(page.getByTestId('dashboard-room-list')).toBeEmpty();
  });
});

test.describe('dashboard does not block account chrome (SITE-101e)', () => {
  test('SITE-114 session chrome still renders on splash home', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('session-chrome')).toBeVisible();
  });
});
