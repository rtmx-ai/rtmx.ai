import { test, expect } from '@playwright/test';

/**
 * MONO-058o–w / SITE-173–181 — P2 voice polish.
 */

test.describe('Site voice P2 (SITE-173–181)', () => {
  test('home has one Sync lede (SITE-173)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hero-lede')).toContainText(/RTMX Sync/i);
    await expect(page.locator('.hero-ucp')).toHaveCount(0);
  });

  test('sync close CTA is plain language (SITE-174)', async ({ page }) => {
    await page.goto('/sync');
    await expect(page.locator('.sync-close')).toContainText(
      /Start a trial or pick a plan/i,
    );
    await expect(page.locator('.sync-close')).not.toContainText(/thesis does not wait/i);
  });

  test('login names RTMX Sync (SITE-175)', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByTestId('login-heading')).toHaveText(
      /Sign in to RTMX Sync/i,
    );
  });

  test('footer Contact sales goes to /contact (SITE-176)', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByTestId('footer-contact-sales')).toHaveAttribute(
      'href',
      '/contact',
    );
  });

  test('security Sigstore claim is soft (SITE-177)', async ({ page }) => {
    await page.goto('/security');
    const body = await page.getByTestId('security-page').innerText();
    expect(body).not.toMatch(/All releases are signed with Sigstore/i);
    expect(body).toMatch(/Sigstore/i);
  });
});
