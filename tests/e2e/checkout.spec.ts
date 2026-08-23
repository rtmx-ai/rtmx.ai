import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-106 / REQ-SITE-107: hosted Team Checkout chrome on rtmx.ai.
 *
 * Pricing must name license vs hosted. Success must not entitle anyone.
 */

test.describe('pricing hosted vs self-managed CTAs', () => {
  test('Team hosted starts Checkout, self-managed still reaches /license', async ({ page }) => {
    await page.goto('/pricing');

    const teamCard = page.locator('.pricing-card', { hasText: 'Team' }).first();
    await expect(teamCard.getByRole('link', { name: 'Start hosted Team' })).toHaveAttribute(
      'href',
      '/checkout',
    );
    await expect(teamCard.getByRole('link', { name: 'Self-managed license' })).toHaveAttribute(
      'href',
      '/license',
    );

    const enterprise = page.locator('.pricing-card', { hasText: 'Enterprise' }).first();
    await expect(enterprise.locator('.cta-button')).not.toHaveAttribute('href', /checkout/);
    await expect(enterprise.locator('.cta-button')).not.toHaveAttribute('href', /license/);

    const onPrem = page.locator('.pricing-card', { hasText: 'On-Prem' }).first();
    await expect(onPrem.locator('.cta-button')).toHaveAttribute('href', /mailto:sales@rtmx\.ai/);
  });
});

test.describe('hosted checkout page', () => {
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
