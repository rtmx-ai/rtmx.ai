import { test, expect } from '@playwright/test';

test.describe('Legal pages', () => {
  test('privacy and terms are published and always linked at the bottom', async ({ page }) => {
    for (const path of ['/', '/sync', '/pricing', '/login', '/checkout']) {
      await page.goto(path);
      const bar = page.getByTestId('site-legal-bar');
      await expect(bar, `legal bar on ${path}`).toBeVisible();
      await expect(bar.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
      await expect(bar.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
    }

    await page.goto('/privacy');
    await expect(page.getByTestId('privacy-page').locator('.legal-header h1')).toHaveText('Privacy Policy');
    await expect(page.getByTestId('privacy-page').getByRole('link', { name: 'Terms of Service' })).toBeVisible();
    const privacy = await page.getByTestId('privacy-page').innerText();
    for (const phrase of [
      'Limited Liability Company (LLC)',
      'Requirements Traceability Matrix',
      'command-line interface (CLI)',
      'Open Authorization (OAuth)',
      'identity providers (IdPs)',
      'Application Programming Interface (API)',
      'Software as a Service (SaaS)',
      'Transport Layer Security (TLS)',
    ]) {
      expect(privacy, `privacy expands ${phrase}`).toContain(phrase);
    }

    await page.goto('/terms');
    await expect(page.getByTestId('terms-page').locator('.legal-header h1')).toHaveText('Terms of Service');
    await expect(page.getByTestId('terms-page').getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    const terms = await page.getByTestId('terms-page').innerText();
    for (const phrase of [
      'Limited Liability Company (LLC)',
      'Requirements Traceability Matrix',
      'command-line interface (CLI)',
      'Application Programming Interface (API)',
      'identity providers (IdPs)',
    ]) {
      expect(terms, `terms expands ${phrase}`).toContain(phrase);
    }
  });
});

test.describe('Homepage CTAs', () => {
  test('primary hero buttons have readable (non-emerald) label color', async ({ page }) => {
    await page.goto('/');
    const install = page.getByTestId('hero-cta-install');
    await expect(install).toBeVisible();
    await expect(install).toHaveText(/Install the client/i);
    const color = await install.evaluate((el) => getComputedStyle(el).color);
    expect(color).toMatch(/rgb\(\s*(\d+)/);
    const m = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    expect(m).toBeTruthy();
    const [, r, g, b] = m!.map(Number);
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    expect(luminance).toBeLessThan(80);
  });
});
