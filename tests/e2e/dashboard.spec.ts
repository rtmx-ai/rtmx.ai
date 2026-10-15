import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-101: Authenticated /dashboard route (post-pay chrome).
 * REQ-SITE-103: WebSocket connect with session token.
 * REQ-SITE-104: Org-scoped room list isolation.
 * REQ-WEB-005 / REQ-WEB-006: Status overview + backlog panels (sync APIs).
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

/** Stub WEB-005/006 APIs so room-focused tests stay hermetic. */
async function stubOverviewBacklog(
  page: import('@playwright/test').Page,
  opts?: {
    overview?: Record<string, unknown>;
    backlog?: { total?: number; backlog?: unknown[] };
  },
) {
  await page.route('**/api/overview', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        opts?.overview ?? {
          total: 0,
          complete: 0,
          partial: 0,
          missing: 0,
          completion_percent: 0,
          phases: [],
        },
      ),
    });
  });
  await page.route('**/api/backlog', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        opts?.backlog ?? {
          total: 0,
          complete: 0,
          missing: 0,
          completion_percent: 0,
          backlog: [],
        },
      ),
    });
  });
}

async function stubAuthOrgsRooms(
  page: import('@playwright/test').Page,
  rooms: unknown[] = [],
) {
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
      body: JSON.stringify({ org_id: 'org-1', org_slug: 'acme', rooms }),
    });
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
    await stubAuthOrgsRooms(page, []);
    await stubOverviewBacklog(page);
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
    await stubAuthOrgsRooms(page, [{ name: 'mvp', org_slug: 'acme', connections: 0 }]);
    await stubOverviewBacklog(page);
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
    await stubAuthOrgsRooms(page, [{ name: 'mvp', org_slug: 'acme', connections: 0 }]);
    await stubOverviewBacklog(page);
    await page.routeWebSocket(/\/sync\//, (ws) => {
      ws.onMessage(() => {});
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
    await stubAuthOrgsRooms(page, [
      { name: 'mvp', org_slug: 'acme', connections: 1 },
      { name: 'secret', org_slug: 'other-tenant', connections: 9 },
    ]);
    await stubOverviewBacklog(page);
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
    await stubAuthOrgsRooms(page, []);
    await stubOverviewBacklog(page);
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

test.describe('dashboard status overview and backlog (WEB-005 / WEB-006)', () => {
  test('renders overview counts and phase breakdown (WEB-005b/c/e)', async ({ page }) => {
    await stubAuthOrgsRooms(page, []);
    await stubOverviewBacklog(page, {
      overview: {
        total: 3,
        complete: 1,
        partial: 1,
        missing: 1,
        completion_percent: 33.3,
        phases: [
          { phase: '1', total: 2, complete: 1, partial: 1, missing: 0 },
          { phase: '2', total: 1, complete: 0, partial: 0, missing: 1 },
        ],
      },
      backlog: { total: 3, backlog: [] },
    });
    await page.routeWebSocket(/\/sync\//, (ws) => {
      ws.onMessage(() => {});
    });

    await seedSession(page);
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-overview')).toBeVisible();
    await expect(page.getByTestId('dashboard-overview-summary')).toContainText(/1 of 3 complete/);
    await expect(page.getByTestId('dashboard-overview-stats')).toBeVisible();
    await expect(page.getByTestId('dashboard-phase-list')).toContainText(/Phase 1/);
    await expect(page.getByTestId('dashboard-phase-list')).toContainText(/Phase 2/);
  });

  test('empty overview shows zeroed summary (WEB-005c)', async ({ page }) => {
    await stubAuthOrgsRooms(page, []);
    await stubOverviewBacklog(page);
    await page.routeWebSocket(/\/sync\//, (ws) => {
      ws.onMessage(() => {});
    });

    await seedSession(page);
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-overview-summary')).toContainText(/0 of 0 complete/);
    await expect(page.getByTestId('dashboard-backlog-empty')).toBeVisible();
  });

  test('backlog distinguishes blocked items and exposes req_id on select (WEB-006b/c/e)', async ({
    page,
  }) => {
    await stubAuthOrgsRooms(page, []);
    await stubOverviewBacklog(page, {
      overview: {
        total: 2,
        complete: 0,
        partial: 0,
        missing: 2,
        completion_percent: 0,
        phases: [],
      },
      backlog: {
        total: 2,
        backlog: [
          {
            req_id: 'REQ-OPEN',
            priority: 'HIGH',
            effort_weeks: '1',
            status: 'MISSING',
            blocked: false,
          },
          {
            req_id: 'REQ-LEAF',
            priority: 'HIGH',
            effort_weeks: '0.5',
            status: 'MISSING',
            blocked: true,
          },
        ],
      },
    });
    await page.routeWebSocket(/\/sync\//, (ws) => {
      ws.onMessage(() => {});
    });

    await seedSession(page);
    await page.goto('/dashboard');
    const list = page.getByTestId('dashboard-backlog-list');
    await expect(list).toContainText('REQ-OPEN');
    await expect(list).toContainText('REQ-LEAF');
    const blocked = list.locator('li.is-blocked');
    await expect(blocked).toContainText('REQ-LEAF');
    await list.getByRole('button', { name: /REQ-OPEN/ }).click();
    await expect(page.getByTestId('dashboard-backlog-selected')).toBeVisible();
    await expect(page.getByTestId('dashboard-backlog-selected')).toHaveText(/Selected: REQ-OPEN/);
    await expect(page.getByTestId('dashboard-backlog-selected')).toHaveAttribute(
      'data-req-id',
      'REQ-OPEN',
    );
  });

  test('empty backlog renders idle state (WEB-006d)', async ({ page }) => {
    await stubAuthOrgsRooms(page, []);
    await stubOverviewBacklog(page, {
      overview: {
        total: 1,
        complete: 1,
        partial: 0,
        missing: 0,
        completion_percent: 100,
        phases: [],
      },
      backlog: { total: 1, backlog: [] },
    });
    await page.routeWebSocket(/\/sync\//, (ws) => {
      ws.onMessage(() => {});
    });

    await seedSession(page);
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-backlog-empty')).toBeVisible();
    await expect(page.getByTestId('dashboard-backlog-empty')).toContainText(/idle/i);
    await expect(page.getByTestId('dashboard-backlog-list')).toBeEmpty();
  });
});

test.describe('dashboard live updates (RT-004)', () => {
  test('sync event refreshes overview DOM without reload (RT-004a/b/d)', async ({ page }) => {
    let overviewHits = 0;
    await stubAuthOrgsRooms(page, [{ name: 'mvp', org_slug: 'acme', connections: 0 }]);
    await page.route('**/api/overview', async (route) => {
      overviewHits += 1;
      const body =
        overviewHits === 1
          ? {
              total: 2,
              complete: 1,
              partial: 0,
              missing: 1,
              completion_percent: 50,
              phases: [{ phase: '1', total: 2, complete: 1, partial: 0, missing: 1 }],
            }
          : {
              total: 2,
              complete: 2,
              partial: 0,
              missing: 0,
              completion_percent: 100,
              phases: [{ phase: '1', total: 2, complete: 2, partial: 0, missing: 0 }],
            };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
    await page.route('**/api/backlog', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ total: 2, complete: overviewHits > 1 ? 2 : 1, backlog: [] }),
      });
    });

    /** @type {import('@playwright/test').WebSocketRoute | null} */
    let mockWs: import('@playwright/test').WebSocketRoute | null = null;
    await page.routeWebSocket(/\/sync\//, (ws) => {
      mockWs = ws;
      ws.onMessage(() => {});
    });

    await seedSession(page);
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-overview-summary')).toContainText(/1 of 2 complete/);
    await expect(page.getByTestId('dashboard-sync-status')).toHaveAttribute('data-state', 'connected', {
      timeout: 10000,
    });

    const beforeUrl = page.url();
    // Simulate CRDT/sync change notification (REQ-RT-004a).
    mockWs!.send(JSON.stringify({ type: 'rtm_changed' }));
    await expect(page.getByTestId('dashboard-overview-summary')).toContainText(/2 of 2 complete/, {
      timeout: 5000,
    });
    await expect(page.getByTestId('dashboard-overview-summary')).toHaveAttribute(
      'data-live-updated',
      /.+/,
    );
    expect(page.url()).toBe(beforeUrl);
    expect(overviewHits).toBeGreaterThanOrEqual(2);
  });

  test('unexpected socket drop shows reconnecting state (RT-004c)', async ({ page }) => {
    await stubAuthOrgsRooms(page, [{ name: 'mvp', org_slug: 'acme', connections: 0 }]);
    await stubOverviewBacklog(page);
    await page.routeWebSocket(/\/sync\//, (ws) => {
      ws.onMessage(() => {});
      void Promise.resolve().then(() => ws.close({ code: 1006, reason: 'abnormal closure' }));
    });

    await seedSession(page);
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-sync-status')).toHaveAttribute(
      'data-state',
      'reconnecting',
      { timeout: 10000 },
    );
    await expect(page.getByTestId('dashboard-sync-status')).toContainText(/Reconnecting/i);
  });

  test('auto-reconnects within 5s and resyncs overview (RT-006a/b/c/d)', async ({ page }) => {
    let overviewHits = 0;
    let wsConnections = 0;
    await stubAuthOrgsRooms(page, [{ name: 'mvp', org_slug: 'acme', connections: 0 }]);
    await page.route('**/api/overview', async (route) => {
      overviewHits += 1;
      const body =
        overviewHits <= 1
          ? {
              total: 2,
              complete: 1,
              partial: 0,
              missing: 1,
              completion_percent: 50,
              phases: [],
            }
          : {
              total: 2,
              complete: 2,
              partial: 0,
              missing: 0,
              completion_percent: 100,
              phases: [],
            };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
    await page.route('**/api/backlog', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ total: 2, backlog: [] }),
      });
    });

    await page.routeWebSocket(/\/sync\//, (ws) => {
      wsConnections += 1;
      ws.onMessage(() => {});
      // Drop only the first connection so the client can reconnect (REQ-RT-006).
      if (wsConnections === 1) {
        void Promise.resolve().then(() => ws.close({ code: 1006, reason: 'abnormal closure' }));
      }
    });

    await seedSession(page);
    const started = Date.now();
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-overview-summary')).toContainText(/1 of 2 complete/);

    // Reconnect can finish before the first poll; require a second socket and
    // a final connected state within the SLA (reconnecting may be skipped).
    await expect
      .poll(async () => wsConnections, { timeout: 5000 })
      .toBeGreaterThanOrEqual(2);
    await expect(page.getByTestId('dashboard-sync-status')).toHaveAttribute(
      'data-state',
      'connected',
      { timeout: 5000 },
    );
    const elapsed = Date.now() - started;
    expect(elapsed).toBeLessThan(15000);
    expect(wsConnections).toBeGreaterThanOrEqual(2);

    await expect(page.getByTestId('dashboard-sync-status')).toHaveAttribute(
      'data-resynced-at',
      /.+/,
      { timeout: 5000 },
    );
    await expect(page.getByTestId('dashboard-overview-summary')).toContainText(/2 of 2 complete/, {
      timeout: 5000,
    });
    expect(overviewHits).toBeGreaterThanOrEqual(2);
  });
});

test.describe('dashboard live backlog activity (RT-005)', () => {
  test('claim_event shows agent identity on backlog row (RT-005a/c/d)', async ({ page }) => {
    await stubAuthOrgsRooms(page, [{ name: 'mvp', org_slug: 'acme', connections: 0 }]);
    await page.route('**/api/overview', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total: 1,
          complete: 0,
          partial: 0,
          missing: 1,
          completion_percent: 0,
          phases: [],
        }),
      });
    });
    await page.route('**/api/backlog', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total: 1,
          backlog: [
            {
              req_id: 'REQ-OPEN',
              priority: 'HIGH',
              effort_weeks: '1',
              status: 'MISSING',
              blocked: false,
              claimed: false,
            },
          ],
        }),
      });
    });

    let mockWs: import('@playwright/test').WebSocketRoute | null = null;
    await page.routeWebSocket(/\/sync\//, (ws) => {
      mockWs = ws;
      ws.onMessage(() => {});
    });

    await seedSession(page);
    await page.goto('/dashboard');
    const list = page.getByTestId('dashboard-backlog-list');
    await expect(list).toContainText('REQ-OPEN');
    await expect(list.locator('[data-testid="backlog-agent"]')).toHaveCount(0);

    mockWs!.send(
      JSON.stringify({
        type: 'claim_event',
        action: 'claim',
        req_id: 'REQ-OPEN',
        agent_id: 'bot-1',
        agent_name: 'Bot One',
      }),
    );

    await expect(list.locator('[data-testid="backlog-agent"]')).toHaveCount(1);
    await expect(list.locator('[data-testid="backlog-agent"]')).toHaveText(/Bot One/);
    await expect(list.locator('li.is-claimed')).toContainText('REQ-OPEN');
    await expect(list).toHaveAttribute('data-live-claim-at', /.+/);
  });

  test('rtm_changed updates backlog status live without reload (RT-005b/d)', async ({ page }) => {
    let backlogHits = 0;
    await stubAuthOrgsRooms(page, [{ name: 'mvp', org_slug: 'acme', connections: 0 }]);
    await page.route('**/api/overview', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total: 1,
          complete: backlogHits > 1 ? 0 : 0,
          partial: backlogHits > 1 ? 1 : 0,
          missing: backlogHits > 1 ? 0 : 1,
          completion_percent: 0,
          phases: [],
        }),
      });
    });
    await page.route('**/api/backlog', async (route) => {
      backlogHits += 1;
      const status = backlogHits === 1 ? 'MISSING' : 'PARTIAL';
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total: 1,
          backlog: [
            {
              req_id: 'REQ-OPEN',
              priority: 'HIGH',
              effort_weeks: '1',
              status,
              blocked: false,
              claimed: true,
              agent_id: 'bot-1',
              agent_name: 'Bot One',
              claimed_by: 'Bot One',
            },
          ],
        }),
      });
    });

    let mockWs: import('@playwright/test').WebSocketRoute | null = null;
    await page.routeWebSocket(/\/sync\//, (ws) => {
      mockWs = ws;
      ws.onMessage(() => {});
    });

    await seedSession(page);
    await page.goto('/dashboard');
    const list = page.getByTestId('dashboard-backlog-list');
    await expect(list.locator('.backlog-meta')).toHaveAttribute('data-status', 'MISSING');
    await expect(list.locator('[data-testid="backlog-agent"]')).toHaveText(/Bot One/);

    const beforeUrl = page.url();
    mockWs!.send(JSON.stringify({ type: 'rtm_changed' }));
    await expect(list.locator('.backlog-meta')).toHaveAttribute('data-status', 'PARTIAL', {
      timeout: 5000,
    });
    await expect(list).toContainText(/PARTIAL/);
    expect(page.url()).toBe(beforeUrl);
    expect(backlogHits).toBeGreaterThanOrEqual(2);
  });
});

test.describe('dashboard does not block account chrome (SITE-101e)', () => {
  test('SITE-114 session chrome still renders on splash home', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('session-chrome')).toBeVisible();
  });
});
