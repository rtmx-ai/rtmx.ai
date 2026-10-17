import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-121 / REQ-MONO-030a — Marketing must not contradict Terms AS IS.
 */
test.describe('Pricing claims align with Terms (SITE-121)', () => {
  test('Team tier does not claim default E2E or self-serve 99.9% SLA', async ({
    page,
  }) => {
    await page.goto('/pricing');
    const body = await page.locator('[data-testid="pricing-page"]').innerText();
    const enterpriseAt = body.indexOf('Enterprise');
    expect(enterpriseAt).toBeGreaterThan(0);
    const teamBlock = body.slice(0, enterpriseAt);
    expect(teamBlock).not.toMatch(/End-to-end encryption/i);
    expect(body).not.toMatch(/server only sees ciphertext/i);
    expect(body).not.toMatch(/99\.9%\s*SLA guarantee/i);
    expect(body).toMatch(/TLS in transit/i);
    expect(body).toMatch(/Custom availability terms via MSA/i);
    expect(body).toMatch(/Optional client-side end-to-end encryption/i);
  });

  test('SITE-128: public OSS free vs private paid copy', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByTestId('pricing-public-org-faq')).toContainText(/public/i);
    await expect(page.getByTestId('pricing-public-org-faq')).toContainText(/without a subscription/i);
    const body = await page.locator('[data-testid="pricing-page"]').innerText();
    expect(body).toMatch(/Public organizations.*free/i);
    expect(body).toMatch(/Private hosted Sync requires a Team trial or subscription/i);
  });
});
