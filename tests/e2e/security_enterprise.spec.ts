import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-136 / WEB-009 — Security + Enterprise pages live after Sync launch.
 * Claim hygiene aligns with SITE-121 / MONO-030a.
 */
test.describe('Security and Enterprise pages (SITE-136)', () => {
  test('security page is live with shipped capabilities', async ({ page }) => {
    await page.goto('/security');
    await expect(page.getByTestId('security-page')).toBeVisible();
    await expect(page.getByTestId('security-shipped')).toContainText(/TLS 1\.3/i);
    await expect(page.getByTestId('security-shipped')).toContainText(/Optional client/i);
    const body = await page.getByTestId('security-page').innerText();
    expect(body).not.toMatch(/server only sees ciphertext/i);
    expect(body).not.toMatch(/99\.9%\s*SLA/i);
  });

  test('enterprise page is live and routes sales to contact', async ({ page }) => {
    await page.goto('/enterprise');
    await expect(page.getByTestId('enterprise-page')).toBeVisible();
    const body = await page.getByTestId('enterprise-page').innerText();
    expect(body).not.toMatch(/IL4\/IL5 Ready/i);
    expect(body).not.toMatch(/FedRAMP In Progress/i);
    expect(body).toMatch(/Contact/i);
    await expect(
      page.locator('a[href="/contact?intent=enterprise"]').first(),
    ).toBeVisible();
  });

  test('product footer links to security and enterprise', async ({ page }) => {
    await page.goto('/pricing');
    const footer = page.getByTestId('product-footer');
    await expect(footer.getByTestId('footer-security')).toHaveAttribute('href', '/security');
    await expect(footer.getByTestId('footer-enterprise')).toHaveAttribute(
      'href',
      '/enterprise',
    );
  });
});
