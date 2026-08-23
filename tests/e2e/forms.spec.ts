import { test, expect } from '@playwright/test';

// Worker request validation lives in infra/workers/form-proxy (node:test).
// The deployed Cloudflare instance is optional smoke, not a deploy gate.

test.describe('Live worker smoke', () => {
  test.skip(
    !process.env.RTMX_WORKER_E2E,
    'set RTMX_WORKER_E2E=1 to hit the deployed Cloudflare worker',
  );

  const liveUrl = process.env.RTMX_WORKER_URL ?? 'https://rtmx-forms.ryan-ff3.workers.dev';

  test('deployed health endpoint is reachable', async ({ request }) => {
    const res = await request.get(`${liveUrl}/api/health`);
    expect(res.ok()).toBe(true);
    expect(await res.json()).toEqual({ status: 'ok' });
  });
});

// ---------------------------------------------------------------------------
// UI Form Tests (browser-based, mocking the worker)
// ---------------------------------------------------------------------------

test.describe('Pricing page waitlist form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('form renders with email input and submit button', async ({ page }) => {
    const form = page.locator('#waitlist-form');
    await expect(form).toBeVisible();
    await expect(page.locator('#waitlist-email')).toBeVisible();
    await expect(page.locator('#waitlist-submit')).toBeVisible();
  });

  test('shows validation error for empty email on submit', async ({ page }) => {
    await page.locator('#waitlist-submit').click();
    const error = page.locator('#email-error');
    await expect(error).not.toBeEmpty();
    const input = page.locator('#waitlist-email');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('shows validation error for invalid email on submit', async ({ page }) => {
    await page.locator('#waitlist-email').fill('not-an-email');
    await page.locator('#waitlist-submit').click();
    const error = page.locator('#email-error');
    await expect(error).not.toBeEmpty();
  });

  test('clears validation error when typing after error', async ({ page }) => {
    await page.locator('#waitlist-submit').click();
    await expect(page.locator('#email-error')).not.toBeEmpty();
    await page.locator('#waitlist-email').fill('valid@example.com');
    await expect(page.locator('#waitlist-email')).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('shows loading state on valid submit', async ({ page }) => {
    // Mock reCAPTCHA and worker to control the flow
    await page.evaluate(() => {
      (window as any).grecaptcha = {
        ready: (cb: () => void) => cb(),
        execute: () => Promise.resolve('mock-token'),
      };
    });

    // Intercept the worker request to hold it
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('form-submit'),
    );

    await page.route('**/api/form-submit', async (route) => {
      // Delay response to observe loading state
      await new Promise((r) => setTimeout(r, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.locator('#waitlist-email').fill('test@example.com');
    await page.locator('#waitlist-submit').click();

    // Should show loading state
    const btn = page.locator('#waitlist-submit');
    await expect(btn).toBeDisabled();

    await responsePromise;
  });

  test('shows success message after successful submit', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).grecaptcha = {
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

    await page.locator('#waitlist-email').fill('test@example.com');
    await page.locator('#waitlist-submit').click();

    const message = page.locator('#form-message');
    await expect(message).toContainText('on the list');
    await expect(message).toHaveClass(/is-success/);
    await expect(page.locator('#waitlist-form')).not.toBeVisible();
  });

  test('shows error message after failed submit', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).grecaptcha = {
        ready: (cb: () => void) => cb(),
        execute: () => Promise.resolve('mock-token'),
      };
    });

    await page.route('**/api/form-submit', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Submission failed' }),
      });
    });

    await page.locator('#waitlist-email').fill('test@example.com');
    await page.locator('#waitlist-submit').click();

    const message = page.locator('#form-message');
    await expect(message).toContainText('went wrong');
    await expect(message).toHaveClass(/is-error/);
    // Form should still be visible for retry
    await expect(page.locator('#waitlist-form')).toBeVisible();
  });
});

test.describe('Landing page newsletter form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('form renders with email input and subscribe button', async ({ page }) => {
    const form = page.locator('#newsletter-form');
    await expect(form).toBeVisible();
    await expect(form.locator('input[type="email"]')).toBeVisible();
    await expect(form.locator('button[type="submit"]')).toBeVisible();
  });

  test('shows error styling for invalid email', async ({ page }) => {
    await page.locator('#newsletter-form button[type="submit"]').click();
    const input = page.locator('#newsletter-form input[type="email"]');
    // Should have red border
    const borderColor = await input.evaluate((el) => el.style.borderColor);
    expect(borderColor).toBeTruthy();
  });

  test('shows success message after mocked successful submit', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).grecaptcha = {
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

    await page.locator('#newsletter-form input[type="email"]').fill('test@example.com');
    await page.locator('#newsletter-form button[type="submit"]').click();

    const status = page.locator('#newsletter-status');
    await expect(status).toContainText('subscribed');
    await expect(page.locator('#newsletter-form')).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Page smoke tests
// ---------------------------------------------------------------------------

test.describe('Page smoke tests', () => {
  test('landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/RTMX/);
    await expect(page.locator('.hero-title')).toBeVisible();
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('.pricing-grid')).toBeVisible();
  });

  test('roadmap page loads', async ({ page }) => {
    await page.goto('/roadmap');
    await expect(page.locator('.phases-grid')).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: 'About RTMX' })).toBeVisible();
  });

  test('reCAPTCHA script is loaded', async ({ page }) => {
    await page.goto('/');
    const scripts = page.locator('script[src*="recaptcha"]');
    expect(await scripts.count()).toBeGreaterThanOrEqual(1);
  });
});
