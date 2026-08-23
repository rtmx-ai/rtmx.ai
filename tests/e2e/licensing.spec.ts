import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-105: the pricing CTA starts entitlement acquisition.
 *
 * rtmx-sync can refuse an unlicensed write with 4402 and can issue a signed
 * license. Until this page existed, the site offered no way to obtain one, so
 * the product was enforceable but unbuyable.
 */
test.describe('pricing entitlement CTA', () => {
  test('Team CTA leads to acquisition, not the waitlist', async ({ page }) => {
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
    await expect(teamCard.getByRole('link', { name: 'Start hosted Team' })).not.toHaveText(/waitlist/i);
    await expect(teamCard.getByRole('link', { name: 'Self-managed license' })).not.toHaveText(/waitlist/i);
  });

  test('the free CLI claim stays on the page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('.oss-clarification')).toContainText('Apache 2.0');
  });

  test('negotiated tiers may still contact sales', async ({ page }) => {
    await page.goto('/pricing');
    const onPrem = page.locator('.pricing-card', { hasText: 'On-Prem' }).first();
    await expect(onPrem.locator('.cta-button')).toHaveAttribute('href', /mailto:sales@rtmx\.ai/);
  });
});

test.describe('license acquisition page', () => {
  test('collects what the license API needs', async ({ page }) => {
    await page.goto('/license');

    await expect(page.locator('#server-url')).toBeVisible();
    await expect(page.locator('#org-ref')).toBeVisible();
    await expect(page.locator('#api-key')).toHaveAttribute('type', 'password');
    await expect(page.locator('#tier')).toBeVisible();
  });

  test('requires every field before calling a server', async ({ page }) => {
    let called = false;
    await page.route('**/licenses/**', async (route) => {
      called = true;
      await route.abort();
    });

    await page.goto('/license');
    await page.locator('#server-url').fill('https://sync.example.com');
    await page.locator('#license-submit').click();

    await expect(page.locator('#license-message')).toContainText('required');
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

    await page.goto('/license');
    await page.locator('#server-url').fill('https://sync.example.com');
    await page.locator('#org-ref').fill('acme');
    await page.locator('#api-key').fill('rtmx_ad_testkey');

    const download = page.waitForEvent('download');
    await page.locator('#license-submit').click();

    expect((await download).suggestedFilename()).toBe('license.json');
    await expect(page.locator('#license-message')).toContainText('License downloaded');
  });

  test('explains a rejected credential instead of failing silently', async ({ page }) => {
    await page.route('**/licenses/acme', async (route) => {
      await route.fulfill({ status: 403, body: 'Forbidden' });
    });

    await page.goto('/license');
    await page.locator('#server-url').fill('https://sync.example.com');
    await page.locator('#org-ref').fill('acme');
    await page.locator('#api-key').fill('rtmx_wr_readonly');
    await page.locator('#license-submit').click();

    await expect(page.locator('#license-message')).toContainText('admin credential');
  });

  test('tells the operator when the server is unreachable', async ({ page }) => {
    await page.route('**/licenses/**', (route) => route.abort('failed'));

    await page.goto('/license');
    await page.locator('#server-url').fill('https://sync.example.com');
    await page.locator('#org-ref').fill('acme');
    await page.locator('#api-key').fill('rtmx_ad_testkey');
    await page.locator('#license-submit').click();

    await expect(page.locator('#license-message')).toContainText('RTMX_ALLOWED_ORIGINS');
  });
});
