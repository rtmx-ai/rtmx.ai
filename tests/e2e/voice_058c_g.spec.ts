import { test, expect } from '@playwright/test';

/**
 * MONO-058c–g / SITE-161–165 — P0 voice consistency.
 */

test.describe('Site voice P0 (SITE-161–165)', () => {
  test('home dogfood uses soft counts and links roadmap (SITE-161)', async ({
    page,
  }) => {
    await page.goto('/');
    const dogfood = page.getByTestId('dogfood-stats');
    await expect(dogfood).toBeVisible();
    await expect(dogfood).not.toContainText('328');
    await expect(dogfood.getByRole('link', { name: /roadmap/i })).toHaveAttribute(
      'href',
      '/roadmap',
    );
    await page.goto('/roadmap');
    await expect(page.getByTestId('roadmap-sot-note')).toContainText(
      /source of truth/i,
    );
  });

  test('enterprise FedRAMP timeline is honest (SITE-162)', async ({ page }) => {
    await page.goto('/enterprise');
    const timeline = page.getByTestId('fedramp-timeline');
    await expect(timeline).toBeVisible();
    await expect(timeline).not.toContainText(/In Progress/i);
    await expect(page.getByTestId('fedramp-honesty-note')).toContainText(
      /not\s+FedRAMP\s+authorized/i,
    );
  });

  test('CMMC and FIPS labeled roadmap (SITE-163)', async ({ page }) => {
    await page.goto('/enterprise');
    await expect(page.getByTestId('cmmc-roadmap')).toContainText(/roadmap/i);
    await page.goto('/security');
    const fips = page.getByTestId('fips-roadmap');
    await expect(fips).toContainText(/FIPS 140-3 \(roadmap\)/i);
    await expect(fips).not.toContainText(/Deploy with confidence/i);
  });

  test('billing success has no eng jargon (SITE-164)', async ({ page }) => {
    await page.goto('/billing/success');
    const copy = page.getByTestId('billing-success-copy');
    await expect(copy).toBeVisible();
    const text = (await copy.innerText()).toLowerCase();
    expect(text).not.toContain('rtmx-sync');
    expect(text).not.toContain('webhook');
    await expect(copy).toContainText(/rtmx login/i);
    await expect(copy).toContainText(/rtmx sync/i);
  });

  test('for-developers allows Sync and uses /docs links (SITE-165)', async ({
    page,
  }) => {
    const resp = await page.goto('/docs/guides/for-developers');
    expect(resp?.status()).toBe(200);
    const main = page.locator('main');
    await expect(main).toContainText(/RTMX Sync/i);
    await expect(main).not.toContainText(/No SaaS dependency/i);
    await expect(main).not.toContainText(/no SaaS logins/i);
    const install = main.getByRole('link', { name: /Installation/i }).first();
    await expect(install).toHaveAttribute('href', /\/docs\/installation/);
  });
});
