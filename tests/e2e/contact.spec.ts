import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-113: sales-assisted CTAs use /contact, not mailto:sales@.
 */

test.describe('sales contact form', () => {
  test('page renders fields and honors ?intent=', async ({ page }) => {
    await page.goto('/contact?intent=on-prem');

    await expect(page.locator('#sales-form')).toBeVisible();
    await expect(page.locator('#sales-email')).toBeVisible();
    await expect(page.locator('#sales-name')).toBeVisible();
    await expect(page.locator('#sales-company')).toBeVisible();
    await expect(page.locator('#sales-intent')).toHaveValue('on-prem');
    await expect(page.locator('#sales-message')).toBeVisible();
    await expect(page.locator('#sales-submit')).toBeVisible();
  });

  test('validates email before submit', async ({ page }) => {
    await page.goto('/contact');
    await page.locator('#sales-submit').click();
    await expect(page.locator('#sales-email')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#sales-email-error')).not.toBeEmpty();
  });

  test('mocked submit succeeds when form id is present', async ({ page }) => {
    await page.goto('/contact?intent=enterprise');

    await page.locator('#sales-form').evaluate((el) => {
      (el as HTMLFormElement).dataset.formId = 'test-sales-form-id';
    });
    await page.evaluate(() => {
      (window as unknown as { grecaptcha: object }).grecaptcha = {
        ready: (cb: () => void) => cb(),
        execute: () => Promise.resolve('mock-token'),
      };
    });

    await page.route('**/api/form-submit', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.locator('#sales-email').fill('buyer@example.com');
    await page.locator('#sales-name').fill('Buyer');
    await page.locator('#sales-company').fill('Acme');
    await page.locator('#sales-message').fill('Need SSO');

    const submitPromise = page.waitForRequest(
      (req) => req.url().includes('form-submit') && req.method() === 'POST',
    );
    await page.locator('#sales-submit').click();
    const req = await submitPromise;
    const body = req.postDataJSON() as { email: string; intent: string; formId: string };
    expect(body.email).toBe('buyer@example.com');
    expect(body.intent).toBe('enterprise');
    expect(body.formId).toBe('test-sales-form-id');

    await expect(page.locator('#sales-message-status')).toContainText(/follow up/i);
    await expect(page.locator('#sales-form')).toBeHidden();
  });

  test('checkout sales-assisted link points at /contact', async ({ page }) => {
    await page.route('**/auth/login/**', async (route) => {
      await route.fulfill({ status: 503, body: 'OAuth provider not configured' });
    });
    await page.goto('/checkout');
    await expect(page.getByRole('link', { name: /sales-assisted/i })).toHaveAttribute(
      'href',
      '/contact',
    );
  });

  test('about enterprise contact is the form', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('link', { name: /Contact sales/i })).toHaveAttribute(
      'href',
      '/contact?intent=enterprise',
    );
  });
});
