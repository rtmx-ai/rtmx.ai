import { test, expect, type Page } from '@playwright/test';

/**
 * REQ-SITE-115 / REQ-MONO-023c: /account management page.
 * Left-tab layout: inactive panels use [hidden]; select a tab before asserting.
 */

async function selectAccountTab(page: Page, tab: string) {
  await page.locator(`.account-tab[data-tab="${tab}"]`).click();
  await expect(page.locator(`#panel-${tab}`)).toBeVisible();
}

test.describe('account page', () => {
  test('unauthenticated visitors redirect to login', async ({ page }) => {
    await page.goto('/account');
    await page.waitForURL(/\/login\?next=/);
    expect(page.url()).toContain('next=%2Faccount');
  });

  test('signed-in visitors see profile and connections chrome', async ({ page }) => {
    await page.route(/\/orgs$/, async (route) => {
      // /auth/github/orgs also ends with /orgs — do not steal that route
      if (route.request().url().includes('/auth/github')) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          organizations: [{ id: '1', name: 'Acme', slug: 'acme', role: 'owner' }],
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

    await page.addInitScript(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'test-session',
          email: 'buyer@example.com',
          display_name: 'Buyer Example',
        }),
      );
    });
    await page.goto('/account');

    await expect(page.locator('#account-display-name')).toHaveText('Buyer Example');
    await expect(page.locator('#account-email')).toHaveText('buyer@example.com');

    await selectAccountTab(page, 'organizations');
    await expect(page.locator('#org-list')).toContainText('Acme');
    await expect(page.locator('#org-list')).toContainText('owner');
    await expect(page.getByTestId('org-admin-acme')).toHaveAttribute(
      'href',
      '/orgs/admin?slug=acme',
    );

    await selectAccountTab(page, 'connections');
    await expect(page.locator('#connect-asana')).toBeVisible();
    await expect(page.getByTestId('github-fab')).toBeHidden();
  });

  test('member role does not show Admin link (public join)', async ({ page }) => {
    await page.route(/\/orgs$/, async (route) => {
      if (route.request().url().includes('/auth/github')) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          organizations: [
            { id: '1', name: 'rtmx-ai', slug: 'rtmx-ai', visibility: 'public', role: 'member' },
          ],
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
          display_name: 'Buyer',
          tier: 'free',
        }),
      });
    });
    await page.route('**/adoption', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ schema_version: 'adoption-v1', entries: [] }),
      });
    });
    await page.route('**/auth/github/orgs', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ orgs: [] }),
      });
    });
    await page.addInitScript(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'test-session',
          email: 'buyer@example.com',
          display_name: 'Buyer',
        }),
      );
    });
    await page.goto('/account');
    await selectAccountTab(page, 'organizations');
    await expect(page.locator('#org-list')).toContainText('rtmx-ai');
    await expect(page.locator('#org-list')).toContainText('member');
    await expect(page.getByTestId('org-admin-rtmx-ai')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Admin' })).toHaveCount(0);
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
    await page.route(/\/orgs$/, async (route) => {
      // /auth/github/orgs also ends with /orgs — do not steal that route
      if (route.request().url().includes('/auth/github')) {
        await route.fallback();
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
    let shared = false;
    await page.route('**/connections/**/share', async (route) => {
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
    });
    await page.route('**/connections', async (route) => {
      if (route.request().url().includes('/share')) {
        await route.fallback();
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
    await page.route('**/adoption', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ schema_version: 'adoption-v1', entries: [] }),
      });
    });
    await page.route('**/auth/github/orgs', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ orgs: [] }),
      });
    });

    await page.addInitScript(() => {
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
    await page.goto('/account');

    await selectAccountTab(page, 'connections');
    await expect(page.locator('.share-select')).toBeVisible();
    await page.locator('.share-select').selectOption('org-1');
    await expect(page.locator('#account-message')).toContainText(/shared/i);
  });

  test('SITE-132: multi-org memberships and GitHub affiliate candidates', async ({ page }) => {
    let memberships = [
      { id: 'p1', name: 'OSS Lab', slug: 'oss-lab', visibility: 'public' },
    ];
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
    await page.route(/\/orgs$/, async (route) => {
      // /auth/github/orgs also ends with /orgs — do not steal that route
      if (route.request().url().includes('/auth/github')) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ organizations: memberships }),
      });
    });
    await page.route('**/auth/github/orgs/affiliate', async (route) => {
      const body = route.request().postDataJSON() as { login?: string };
      memberships = [
        ...memberships,
        { id: 'p2', name: body.login || 'rtmx-ai', slug: body.login || 'rtmx-ai', visibility: 'public' },
      ];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'p2',
          name: body.login,
          slug: body.login,
          visibility: 'public',
          role: 'member',
          action: 'joined',
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
    await page.route('**/adoption', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ schema_version: 'adoption-v1', entries: [] }),
      });
    });
    // Register last so it wins over /orgs$ for /auth/github/orgs
    await page.route('**/auth/github/orgs', async (route) => {
      if (route.request().url().includes('/affiliate')) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          orgs: [
            { id: 1, login: 'oss-lab', description: 'Already affiliated' },
            { id: 2, login: 'rtmx-ai', description: 'RTMX' },
          ],
        }),
      });
    });

    await page.addInitScript(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'test-session',
          email: 'buyer@example.com',
          display_name: 'Buyer',
          user_id: 'u1',
        }),
      );
      localStorage.removeItem('rtmx.active_org');
    });
    await page.goto('/account');

    await selectAccountTab(page, 'organizations');
    await expect(page.getByTestId('org-membership-list')).toContainText('oss-lab');

    await expect(page.getByTestId('github-affiliation')).toBeVisible();
    await expect(page.getByTestId('github-org-candidates')).toContainText('rtmx-ai');

    await page.getByTestId('affiliate-gh-rtmx-ai').click();
    await expect(page.locator('#gh-affiliate-message')).toContainText(/Affiliated with rtmx-ai/i);

    await expect(page.getByTestId('org-membership-list')).toContainText('rtmx-ai');
    await expect(page.getByTestId('org-membership-list')).toContainText('oss-lab');

    await page.getByTestId('select-org-oss-lab').click();
    await expect(page.getByTestId('org-membership-list')).toContainText('active');
  });

  test('SITE-133: adoption recommendations show rtmx-ai/rtmx and Join CTA', async ({ page }) => {
    let memberships: { id: string; name: string; slug: string; visibility: string }[] = [];
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
    await page.route('**/orgs/rtmx-ai/join', async (route) => {
      memberships = [
        { id: 'p1', name: 'rtmx-ai', slug: 'rtmx-ai', visibility: 'public' },
      ];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'p1',
          name: 'rtmx-ai',
          slug: 'rtmx-ai',
          visibility: 'public',
          role: 'member',
        }),
      });
    });
    await page.route('**/orgs', async (route) => {
      if (route.request().url().includes('/join') || route.request().url().includes('/auth/github')) {
        await route.fallback();
        return;
      }
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ organizations: memberships }),
        });
        return;
      }
      await route.fallback();
    });
    await page.route('**/adoption', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          schema_version: 'adoption-v1',
          entries: [
            {
              external_ref: 'github.com/rtmx-ai/rtmx',
              provider: 'github',
              org_slug: 'rtmx-ai',
              room: 'main',
              visibility: 'public',
              last_seen_at: '2026-10-18T00:00:00Z',
              source: 'seed',
            },
          ],
        }),
      });
    });
    await page.route(/\/auth\/github\/orgs$/, async (route) => {
      if (route.request().url().includes('/affiliate')) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ orgs: [] }),
      });
    });
    await page.route('**/connections', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ connections: [] }),
      });
    });

    await page.addInitScript(() => {
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
    await page.goto('/account');

    await selectAccountTab(page, 'organizations');
    await expect(page.getByTestId('adoption-recommendations')).toBeVisible();
    await expect(page.getByTestId('adoption-list')).toContainText('github.com/rtmx-ai/rtmx');
    await page.getByTestId('adopt-join-rtmx-ai').click();
    await expect(page.locator('#adoption-message')).toContainText(/joined public org rtmx-ai/i);

    await expect(page.getByTestId('org-membership-list')).toContainText('rtmx-ai');
  });

  test('SITE-142/143: Join-first Organizations IA and provenance copy', async ({ page }) => {
    await page.route(/\/orgs$/, async (route) => {
      if (route.request().url().includes('/auth/github')) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ organizations: [] }),
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
          display_name: 'Buyer',
          tier: 'free',
          github_linked: false,
        }),
      });
    });
    await page.route('**/adoption', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          schema_version: 'adoption-v1',
          entries: [
            {
              external_ref: 'github.com/rtmx-ai/rtmx',
              provider: 'github',
              org_slug: 'rtmx-ai',
              room: 'main',
              visibility: 'public',
              last_seen_at: '2026-10-18T00:00:00Z',
              source: 'seed',
            },
          ],
        }),
      });
    });
    await page.route('**/auth/github/orgs', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'GitHub not linked' }),
      });
    });
    await page.addInitScript(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'test-session',
          email: 'buyer@example.com',
          display_name: 'Buyer',
        }),
      );
    });
    await page.goto('/account');

    await expect(page.locator('.account-tab[data-tab="adoption"]')).toHaveCount(0);
    await expect(page.locator('.account-tab[data-tab="github"]')).toHaveCount(0);
    await expect(page.locator('.account-tab[data-tab="organizations"]')).toBeVisible();
    await expect(page.locator('.account-tab[data-tab="connections"]')).toBeVisible();

    await selectAccountTab(page, 'organizations');
    const provenance = page.getByTestId('org-provenance-help');
    await expect(provenance).toContainText(/not necessarily a GitHub/i);
    await expect(provenance).toContainText(/Prove with GitHub/i);
    await expect(page.getByTestId('adoption-recommendations')).toBeVisible();
    await expect(page.getByTestId('adopt-join-rtmx-ai')).toBeVisible();
    await expect(page.getByTestId('link-github')).toBeVisible();
    // Legacy ?tab=github aliases into Organizations
    await page.goto('/account?tab=github');
    await expect(page.locator('#panel-organizations')).toBeVisible();
  });

  test('SITE-144: Connections vault copy without forge adapter CTAs', async ({ page }) => {
    await page.route(/\/orgs$/, async (route) => {
      if (route.request().url().includes('/auth/github')) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ organizations: [] }),
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
          display_name: 'Buyer',
          tier: 'free',
        }),
      });
    });
    await page.route('**/adoption', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ schema_version: 'adoption-v1', entries: [] }),
      });
    });
    await page.route('**/auth/github/orgs', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ orgs: [] }),
      });
    });
    await page.addInitScript(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({
          token: 'test-session',
          email: 'buyer@example.com',
          display_name: 'Buyer',
        }),
      );
    });
    await page.goto('/account');
    await selectAccountTab(page, 'connections');
    const help = page.getByTestId('connections-vault-help');
    await expect(help).toContainText(/Vaulted project-tool/i);
    await expect(help).toContainText(/Asana/i);
    await expect(page.getByTestId('connect-asana')).toBeVisible();
    await expect(page.getByTestId('connect-jira')).toBeVisible();
    await expect(page.getByTestId('connect-monday')).toBeVisible();
    await expect(page.getByTestId('connect-gitlab')).toBeVisible();
    await expect(page.getByTestId('connect-github')).toBeVisible();
    await expect(page.getByRole('button', { name: /Connect GitHub Issues/i })).toBeVisible();
    await expect(help).toContainText(/Jira/i);
    await expect(help).toContainText(/Monday/i);
    await expect(help).toContainText(/GitLab/i);
    await expect(help).toContainText(/GitHub Issues/i);
    // SITE-158 / MONO-046d: vault-backed sync discoverability
    await expect(help).toContainText(/rtmx sync --service github/i);
    await expect(help).toContainText(/GITHUB_TOKEN/i);
    // MONO-049d: shared-org admin discoverability
    await expect(help).toContainText(/org owner\/admin/i);
    await expect(help).toContainText(/shared/i);
  });
});
