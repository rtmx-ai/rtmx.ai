import { test, expect } from '@playwright/test';

/**
 * MONO-058x/y / SITE-182–183 — HIGH voice consistency.
 */

test.describe('Site voice HIGH (SITE-182–183)', () => {
  test('CLI reference documents Sync rooms and adapters (SITE-182)', async ({
    page,
  }) => {
    const resp = await page.goto('/docs/guides/cli-reference');
    expect(resp?.status()).toBe(200);
    const main = page.locator('main');
    await expect(main).toContainText(/Sync room/i);
    await expect(main).toContainText('rtmx sync github');
    await expect(main).toContainText('rtmx sync jira');
  });

  test('cancel recovery mentions 14-day trial (SITE-183)', async ({ page }) => {
    await page.goto('/billing/cancel');
    await expect(page.getByTestId('billing-cancel-copy')).toContainText(
      /14-day/i,
    );
    await expect(page.getByTestId('cancel-checkout-cta')).toHaveAttribute(
      'href',
      '/checkout',
    );
    await expect(page.getByTestId('cancel-checkout-cta')).toContainText(
      /14-day free trial/i,
    );
  });

  test('account checkout CTA mentions trial (SITE-183)', async ({ page }) => {
    await page.goto('/account');
    await expect(page.getByTestId('account-checkout-cta')).toContainText(
      /14-day free trial/i,
    );
  });
});
