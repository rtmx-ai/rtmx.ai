import { test, expect } from '@playwright/test';

test.describe('Legal pages', () => {
  test('privacy and terms are published and linked from the footer', async ({ page }) => {
    await page.goto('/');
    const legal = page.getByTestId('product-footer-legal');
    await expect(legal.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    await expect(legal.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');

    await page.goto('/privacy');
    await expect(page.getByTestId('privacy-page').locator('.legal-header h1')).toHaveText('Privacy Policy');
    await expect(page.getByTestId('privacy-page').getByRole('link', { name: 'Terms of Service' })).toBeVisible();

    await page.goto('/terms');
    await expect(page.getByTestId('terms-page').locator('.legal-header h1')).toHaveText('Terms of Service');
    await expect(page.getByTestId('terms-page').getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
  });
});

test.describe('Homepage CTAs', () => {
  test('primary hero buttons have readable (non-emerald) label color', async ({ page }) => {
    await page.goto('/');
    const sync = page.getByTestId('hero-cta-sync');
    await expect(sync).toBeVisible();
    await expect(sync).toHaveText(/Explore Sync/i);
    const color = await sync.evaluate((el) => getComputedStyle(el).color);
    // Expect dark label on emerald fill — not emerald-on-emerald.
    // rgb of --rtmx-bg (#0a0a0a) or black family; reject bright green.
    expect(color).toMatch(/rgb\(\s*(\d+)/);
    const m = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    expect(m).toBeTruthy();
    const [, r, g, b] = m!.map(Number);
    // Dark text: low luminance; emerald light is high G
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    expect(luminance).toBeLessThan(80);
  });
});
