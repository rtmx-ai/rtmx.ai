import { test, expect } from '@playwright/test';

/**
 * Docs callouts must stay readable on the dark-only site — including when the
 * OS prefers a light color scheme (Starlight ThemeProvider used to flip tokens).
 */

function luminance(rgb: string): number {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return -1;
  const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

test.describe('docs aside contrast', () => {
  test.use({ colorScheme: 'light' });

  test('Note/Tip asides keep dark panels and light text under light OS preference', async ({
    page,
  }) => {
    await page.goto('/docs/guides/for-defense');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const note = page.locator('.starlight-aside--note').first();
    await expect(note).toBeVisible();
    const noteBg = await note.evaluate((el) => getComputedStyle(el).backgroundColor);
    const noteColor = await note
      .locator('.starlight-aside__content')
      .evaluate((el) => getComputedStyle(el).color);
    expect(luminance(noteBg), `note bg ${noteBg}`).toBeLessThan(0.25);
    expect(luminance(noteColor), `note text ${noteColor}`).toBeGreaterThan(0.35);

    await page.goto('/docs/guides/for-developers');
    const tip = page.locator('.starlight-aside--tip').first();
    await expect(tip).toBeVisible();
    const tipBg = await tip.evaluate((el) => getComputedStyle(el).backgroundColor);
    const tipColor = await tip
      .locator('.starlight-aside__content')
      .evaluate((el) => getComputedStyle(el).color);
    const tipLink = tip.locator('a').first();
    await expect(tipLink).toBeVisible();
    const tipLinkColor = await tipLink.evaluate((el) => getComputedStyle(el).color);
    expect(luminance(tipBg), `tip bg ${tipBg}`).toBeLessThan(0.25);
    expect(luminance(tipColor), `tip text ${tipColor}`).toBeGreaterThan(0.35);
    expect(luminance(tipLinkColor), `tip link ${tipLinkColor}`).toBeGreaterThan(0.35);
  });
});
