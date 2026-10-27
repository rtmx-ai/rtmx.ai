import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-149 / REQ-MONO-041: fenced code copy control with checkmark feedback.
 */

test.describe('sitewide code copy (SITE-149)', () => {
  test('docs code fence exposes copy control and checkmark after click', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/docs/installation');

    const copyBtn = page.locator('button[data-code], .expressive-code button.copy, button[title*="Copy" i], .copy button').first();
    // Expressive Code default: button.copy inside .expressive-code
    const ecCopy = page.locator('.expressive-code .copy button, .expressive-code button.copy').first();
    const control = (await ecCopy.count()) > 0 ? ecCopy : copyBtn;
    await expect(control).toBeVisible({ timeout: 15000 });

    await control.click();

    const feedback = page.locator('.expressive-code .copy .feedback.show').first();
    await expect(feedback).toBeVisible();
    await expect(feedback).toContainText(/copied/i);

    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text.length).toBeGreaterThan(5);
    // Multi-line shell snippets should retain newlines when present on the page.
    const fenceText = await page.locator('.expressive-code pre').first().innerText();
    if (fenceText.includes('\n')) {
      expect(text).toContain('\n');
    }
  });
});
