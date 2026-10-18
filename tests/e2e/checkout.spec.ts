import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-106 / REQ-SITE-107: hosted Team Checkout chrome on rtmx.ai.
 *
 * Pricing must name license vs hosted. Success must not entitle anyone.
 */

test.describe('pricing hosted vs self-managed CTAs', () => {
  test('Team hosted starts Checkout, self-managed reaches Self-hosted tab', async ({ page }) => {
    await page.goto('/pricing');

    const teamCard = page.locator('.pricing-card', { hasText: 'Team' }).first();
    await expect(teamCard.getByRole('link', { name: /14-day free trial/i })).toHaveAttribute(
      'href',
      '/checkout',
    );
    await expect(teamCard.getByRole('link', { name: 'Self-managed license' })).toHaveAttribute(
      'href',
      '/checkout?tab=self-hosted',
    );

    const enterprise = page.locator('.pricing-card', { hasText: 'Enterprise' }).first();
    await expect(enterprise.locator('.cta-button')).toHaveAttribute(
      'href',
      '/contact?intent=enterprise',
    );
    await expect(enterprise.locator('.cta-button')).not.toHaveAttribute('href', /checkout/);
    await expect(enterprise.locator('.cta-button')).not.toHaveAttribute('href', /mailto:/);

    const onPrem = page.locator('.pricing-card', { hasText: 'On-Prem' }).first();
    await expect(onPrem.locator('.cta-button')).toHaveAttribute(
      'href',
      '/contact?intent=on-prem',
    );
    await expect(onPrem.locator('.cta-button')).not.toHaveAttribute('href', /mailto:/);
  });
});

test.describe('hosted checkout page', () => {
  test.beforeEach(async ({ page }) => {
    // Default: OAuth unconfigured so private-beta key-paste e2e still works.
    await page.route('**/auth/login/**', async (route) => {
      await route.fulfill({ status: 503, body: 'OAuth provider not configured' });
    });
  });

  test('pins the managed sync host and explains the admin key path', async ({ page }) => {
    await page.goto('/checkout');

    const server = page.locator('#server-url');
    await expect(server).toHaveAttribute('type', 'hidden');
    await expect(server).not.toHaveValue('');
    await expect(page.getByRole('link', { name: /sales-assisted/i })).toHaveAttribute(
      'href',
      '/contact',
    );
    await expect(page.getByText('RTMX Sync server')).toHaveCount(0);
  });

  test('SITE-127: org create defaults to Private and posts visibility', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({ token: 'test-session-token', email: 'buyer@example.com' }),
      );
    });

    let postedVisibility: string | undefined;
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
        const body = route.request().postDataJSON() as { name?: string; visibility?: string };
        postedVisibility = body.visibility;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'n1',
            name: body.name || 'New Org',
            slug: 'new-org',
            visibility: body.visibility || 'private',
          }),
        });
        return;
      }
      await route.continue();
    });
    await page.route('**/auth/login/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ authorization_url: 'https://example.com/oauth', state: 'x' }),
      });
    });

    await page.goto('/checkout');
    await expect(page.getByTestId('org-create-wrap')).toBeVisible();
    await expect(page.getByTestId('org-visibility')).toBeVisible();
    await expect(page.getByTestId('org-visibility-private')).toBeChecked();
    await expect(page.getByTestId('org-visibility')).toContainText(/open-source/i);
    await expect(page.getByTestId('org-visibility')).toContainText(/Team trial/i);
    await expect(page.getByTestId('org-visibility')).toContainText(/subscription/i);

    await page.getByTestId('org-create-name').fill('Acme Lab');
    await page.getByTestId('org-create').click();
    await expect.poll(() => postedVisibility).toBe('private');

    await page.getByTestId('org-visibility-public').check();
    await page.getByTestId('org-create-name').fill('OSS Lab');
    await page.getByTestId('org-create').click();
    await expect.poll(() => postedVisibility).toBe('public');
  });

  test('SITE-124: zero orgs shows create-only; memberships show select+create option', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({ token: 'test-session-token', email: 'buyer@example.com' }),
      );
    });

    await page.route('**/orgs', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ organizations: [] }),
        });
        return;
      }
      await route.continue();
    });
    await page.route('**/auth/login/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ authorization_url: 'https://example.com/oauth', state: 'x' }),
      });
    });

    await page.goto('/checkout');
    await expect(page.getByTestId('org-session-panel')).toBeVisible();
    await expect(page.getByTestId('org-select-wrap')).toBeHidden();
    await expect(page.getByTestId('org-create-wrap')).toBeVisible();
    await expect(page.getByTestId('org-help-empty')).toBeVisible();
    await expect(page.getByTestId('org-create')).toHaveText(/Create organization/i);

    // Remount with memberships
    await page.unroute('**/orgs');
    await page.route('**/orgs', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            organizations: [{ id: 'o1', name: 'Acme', slug: 'acme' }],
          }),
        });
        return;
      }
      await route.continue();
    });
    await page.reload();
    await expect(page.getByTestId('org-select-wrap')).toBeVisible();
    await expect(page.getByTestId('org-create-wrap')).toBeHidden();
    const select = page.getByTestId('org-select');
    await expect(select.locator('option[value="__create__"]')).toHaveCount(1);
    await select.selectOption('__create__');
    await expect(page.getByTestId('org-create-wrap')).toBeVisible();
  });

  test('SITE-129: Individual copy is account-first without seat chrome', async ({ page }) => {
    await page.goto('/checkout?tab=individual');
    await expect(page.getByTestId('checkout-panel-individual')).toBeVisible();
    await expect(page.getByTestId('individual-lede')).toContainText(/RTMX account/i);
    await expect(page.getByTestId('individual-lede')).toContainText(/public/i);
    await expect(page.getByTestId('individual-account-note')).toContainText(/not a seat/i);
    await expect(page.getByTestId('checkout-panel-individual')).not.toContainText(/Seats locked/i);
    await expect(page.getByTestId('checkout-panel-individual')).not.toContainText(/quantity 1/i);
    await expect(page.getByTestId('checkout-cta')).toContainText(/RTMX account/i);
    await expect(page.getByTestId('checkout-cta')).not.toContainText(/1 seat/i);
  });

  test('SITE-130: Individual does not mint a personal org or Team×1 Checkout', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem(
        'rtmx.session',
        JSON.stringify({ token: 'test-session-token', email: 'buyer@example.com' }),
      );
    });

    let orgPosts = 0;
    let checkoutCalled = false;
    await page.route('**/orgs', async (route) => {
      if (route.request().method() === 'POST') {
        orgPosts += 1;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'x', name: 'Should Not Create', slug: 'x' }),
        });
        return;
      }
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ organizations: [] }),
        });
        return;
      }
      await route.continue();
    });
    await page.route('**/billing/checkout', async (route) => {
      checkoutCalled = true;
      await route.abort();
    });

    await page.goto('/checkout?tab=individual');
    await expect(page.getByTestId('checkout-panel-individual')).toBeVisible();
    await expect(page.getByTestId('checkout-hosted-shared')).toBeHidden();
    await expect(page.getByTestId('personal-org-status')).toContainText(/buyer@example.com|Signed in/i);
    expect(orgPosts).toBe(0);

    await page.getByTestId('checkout-cta').click();
    await expect(page.locator('#checkout-message')).toContainText(/signed in|Team|public/i);
    expect(checkoutCalled).toBe(false);
    expect(orgPosts).toBe(0);
  });

  test('SITE-126: Self-hosted tab has download chrome; /license redirects', async ({ page }) => {
    await page.goto('/checkout?tab=self-hosted');
    await expect(page.getByTestId('checkout-panel-self-hosted')).toBeVisible();
    await expect(page.locator('#license-server-url')).toBeVisible();
    await expect(page.locator('#license-org-ref')).toBeVisible();
    await expect(page.locator('#license-api-key')).toBeVisible();
    await expect(page.getByTestId('checkout-cta')).toContainText(/Issue and download license/i);

    await page.goto('/license');
    await expect(page).toHaveURL(/\/checkout\?tab=self-hosted/);
    await expect(page.getByTestId('checkout-panel-self-hosted')).toBeVisible();
  });

  test('SITE-123: three tabs and one CTA that follows the active tab', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.getByTestId('checkout-hub')).toBeVisible();
    await expect(page.getByTestId('checkout-tab-individual')).toBeVisible();
    await expect(page.getByTestId('checkout-tab-team')).toBeVisible();
    await expect(page.getByTestId('checkout-tab-self-hosted')).toBeVisible();
    await expect(page.getByTestId('checkout-cta')).toHaveCount(1);

    await expect(page.getByTestId('checkout-tab-team')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('checkout-cta')).toContainText(/Stripe/i);

    await page.getByTestId('checkout-tab-individual').click();
    await expect(page.getByTestId('checkout-tab-individual')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByTestId('checkout-panel-individual')).toBeVisible();
    await expect(page.getByTestId('checkout-cta')).toContainText(/RTMX account/i);

    await page.getByTestId('checkout-tab-self-hosted').click();
    await expect(page.getByTestId('checkout-panel-self-hosted')).toBeVisible();
    await expect(page.getByTestId('checkout-hosted-shared')).toBeHidden();
    await expect(page.getByTestId('checkout-cta')).toContainText(/license/i);
    await expect(page).toHaveURL(/tab=self-hosted/);
  });

  test('does not call the server until the org credential is present', async ({ page }) => {
    let called = false;
    await page.route('**/billing/checkout', async (route) => {
      called = true;
      await route.abort();
    });

    await page.goto('/checkout');
    await page.locator('#checkout-submit').click();
    await expect(page.locator('#checkout-message')).toContainText('required');
    expect(called).toBe(false);
  });

  test('asks an unauthenticated caller to create an organization', async ({ page }) => {
    await page.route('**/billing/checkout', async (route) => {
      await route.fulfill({ status: 401, body: 'Authentication required' });
    });

    await page.goto('/checkout');
    await page.locator('#org-ref').fill('acme');
    await page.locator('#api-key').fill('rtmx_ad_testkey');
    await page.locator('#checkout-submit').click();
    await expect(page.locator('#checkout-message')).toContainText('organization');
  });

  test('redirects to the Stripe Session URL the server returned', async ({ page }) => {
    await page.route('**/billing/checkout', async (route) => {
      expect(route.request().method()).toBe('POST');
      const body = route.request().postDataJSON();
      expect(body.offering).toBe('managed_sync');
      expect(body.tier).toBe('team');
      expect(body.org_id).toBe('acme');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: '/billing/success?session_id=cs_test_playwright',
          session_id: 'cs_test_playwright',
          metadata: { org_id: 'acme', offering: 'managed_sync', tier: 'team', quantity: '1' },
        }),
      });
    });

    await page.goto('/checkout');
    await page.locator('#org-ref').fill('acme');
    await page.locator('#api-key').fill('rtmx_ad_testkey');
    await page.locator('#checkout-submit').click();
    await page.waitForURL('**/billing/success?session_id=cs_test_playwright');
  });
});

test.describe('checkout success and cancel', () => {
  test('success does not mark the org paid itself', async ({ page }) => {
    let entitled = false;
    await page.route('**/billing/webhooks/**', async (route) => {
      entitled = true;
      await route.abort();
    });
    await page.route('**/billing/checkout', async (route) => {
      entitled = true;
      await route.abort();
    });
    await page.route('**/billing/fulfillment**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sync_url: 'wss://sync.example.test/sync/acme/mvp',
          org_slug: 'acme',
          state: 'active',
        }),
      });
    });

    await page.addInitScript(() => {
      sessionStorage.setItem(
        'rtmx.checkout',
        JSON.stringify({ server: 'https://sync.example.test', org: 'acme', apiKey: 'rtmx_ad_testkey' }),
      );
    });

    await page.goto('/billing/success?session_id=cs_test_playwright');
    await expect(page.locator('#credentials')).toContainText('wss://sync.example.test/sync/acme/mvp');
    expect(entitled).toBe(false);
    await expect(page.locator('body')).not.toContainText(/\b(?:4[0-9]{3}|card number|PAN)\b/i);
  });

  test('cancel explains nothing was charged', async ({ page }) => {
    await page.goto('/billing/cancel');
    await expect(page.locator('body')).toContainText('Nothing was charged');
    await expect(page.getByRole('link', { name: /hosted Team Checkout/ })).toHaveAttribute(
      'href',
      '/checkout',
    );
  });
});

test.describe('customer billing portal', () => {
  test('unauthenticated visitors cannot open a portal session', async ({ page }) => {
    let called = false;
    await page.route('**/billing/portal', async (route) => {
      called = true;
      await route.fulfill({ status: 401, body: 'Authentication required' });
    });

    await page.goto('/billing/manage');
    await expect(page.locator('body')).toContainText('period end');
    await page.locator('#portal-submit').click();
    await expect(page.locator('#portal-message')).toContainText('required');
    expect(called).toBe(false);
  });

  test('redirects to the Stripe portal URL the server returned', async ({ page }) => {
    await page.route('**/billing/portal', async (route) => {
      expect(route.request().method()).toBe('POST');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: '/billing/success?from=portal',
          session_id: 'bps_test_playwright',
          note: 'Cancel takes effect at period end',
        }),
      });
    });

    await page.goto('/billing/manage');
    await page.locator('#org-ref').fill('acme');
    await page.locator('#api-key').fill('rtmx_ad_testkey');
    await page.locator('#portal-submit').click();
    await page.waitForURL('**/billing/success?from=portal');
  });
});
