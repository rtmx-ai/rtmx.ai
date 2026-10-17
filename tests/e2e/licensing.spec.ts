import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-105 / REQ-SITE-126: self-managed license acquisition.
 *
 * SITE-126 moved issue/download onto /checkout?tab=self-hosted; /license
 * redirects there. Pricing secondary CTA reaches the hub tab directly.
 */

const SELF_HOSTED = '/checkout?tab=self-hosted';

async function openSelfHosted(page: import('@playwright/test').Page, via = SELF_HOSTED) {
  await page.goto(via);
  await expect(page.getByTestId('checkout-panel-self-hosted')).toBeVisible();
  await expect(page.getByTestId('checkout-tab-self-hosted')).toHaveAttribute(
    'aria-selected',
    'true',
  );
}

test.describe('pricing entitlement CTA', () => {
  test('Team CTA leads to acquisition, not the waitlist', async ({ page }) => {
    await page.goto('/pricing');

    const teamCard = page.locator('.pricing-card', { hasText: 'Team' }).first();
    await expect(teamCard.getByRole('link', { name: /14-day free trial/i })).toHaveAttribute(
      'href',
      '/checkout',
    );
    await expect(teamCard.getByRole('link', { name: 'Self-managed license' })).toHaveAttribute(
      'href',
      SELF_HOSTED,
    );
    await expect(teamCard.getByRole('link', { name: /14-day free trial/i })).not.toHaveText(
      /waitlist/i,
    );
    await expect(teamCard.getByRole('link', { name: 'Self-managed license' })).not.toHaveText(
      /waitlist/i,
    );
  });

  test('the free CLI claim stays on the page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('.oss-clarification')).toContainText('Apache 2.0');
  });

  test('negotiated tiers route to the sales contact form', async ({ page }) => {
    await page.goto('/pricing');
    const onPrem = page.locator('.pricing-card', { hasText: 'On-Prem' }).first();
    await expect(onPrem.locator('.cta-button')).toHaveAttribute(
      'href',
      '/contact?intent=on-prem',
    );
  });
});

test.describe('license acquisition via Self-hosted hub (SITE-105 / SITE-126)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/login/**', async (route) => {
      await route.fulfill({ status: 503, body: 'OAuth provider not configured' });
    });
  });

  test('SITE-126: /license redirects to Self-hosted tab', async ({ page }) => {
    await page.goto('/license');
    await expect(page).toHaveURL(/\/checkout\?tab=self-hosted/);
    await expect(page.getByTestId('checkout-panel-self-hosted')).toBeVisible();
    await expect(page.getByTestId('checkout-cta')).toContainText(/license/i);
  });

  test('collects what the license API needs', async ({ page }) => {
    await openSelfHosted(page);

    await expect(page.locator('#license-server-url')).toBeVisible();
    await expect(page.locator('#license-server-url')).toHaveAttribute('type', 'url');
    await expect(page.locator('#license-org-ref')).toBeVisible();
    await expect(page.locator('#license-api-key')).toHaveAttribute('type', 'password');
    await expect(page.locator('#license-tier')).toBeVisible();
  });

  test('keeps an editable sync server for self-managed (REQ-MONO-020d AC6)', async ({ page }) => {
    await openSelfHosted(page);
    const server = page.locator('#license-server-url');
    await expect(server).toBeVisible();
    await expect(server).not.toHaveAttribute('type', 'hidden');
    await expect(server).toBeEditable();
  });

  test('requires every field before calling a server', async ({ page }) => {
    let called = false;
    await page.route('**/licenses/**', async (route) => {
      called = true;
      await route.abort();
    });

    await openSelfHosted(page);
    await page.locator('#license-server-url').fill('https://sync.example.com');
    await page.getByTestId('checkout-cta').click();

    await expect(page.locator('#checkout-message')).toContainText('required');
    expect(called).toBe(false);
  });

  test('issues then downloads a license file', async ({ page }) => {
    await page.route('**/licenses/acme', async (route) => {
      expect(route.request().method()).toBe('POST');
      expect(route.request().headers()['authorization']).toBe('Bearer rtmx_ad_testkey');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ org_id: 'acme', tier: 'team', state: 'active' }),
      });
    });
    await page.route('**/licenses/acme/download', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ payload: 'cGF5bG9hZA', signature: 'c2ln', key_id: 'k1' }),
      });
    });

    await openSelfHosted(page);
    await page.locator('#license-server-url').fill('https://sync.example.com');
    await page.locator('#license-org-ref').fill('acme');
    await page.locator('#license-api-key').fill('rtmx_ad_testkey');

    const download = page.waitForEvent('download');
    await page.getByTestId('checkout-cta').click();

    expect((await download).suggestedFilename()).toBe('license.json');
    await expect(page.locator('#checkout-message')).toContainText('License downloaded');
  });

  test('explains a rejected credential instead of failing silently', async ({ page }) => {
    await page.route('**/licenses/acme', async (route) => {
      await route.fulfill({ status: 403, body: 'Forbidden' });
    });

    await openSelfHosted(page);
    await page.locator('#license-server-url').fill('https://sync.example.com');
    await page.locator('#license-org-ref').fill('acme');
    await page.locator('#license-api-key').fill('rtmx_wr_readonly');
    await page.getByTestId('checkout-cta').click();

    await expect(page.locator('#checkout-message')).toContainText('admin credential');
  });

  test('tells the operator when the server is unreachable', async ({ page }) => {
    await page.route('**/licenses/**', (route) => route.abort('failed'));

    await openSelfHosted(page);
    await page.locator('#license-server-url').fill('https://sync.example.com');
    await page.locator('#license-org-ref').fill('acme');
    await page.locator('#license-api-key').fill('rtmx_ad_testkey');
    await page.getByTestId('checkout-cta').click();

    await expect(page.locator('#checkout-message')).toContainText('RTMX_ALLOWED_ORIGINS');
  });
});
