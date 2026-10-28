import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-117: Sync explainer is the product thesis; Pricing is plans only.
 * REQ-SITE-141: Homepage Sync-primary hierarchy (trial CTA → /checkout).
 * Open source CLI is positioned as how you access Sync.
 * Header is product-led: Sync · Docs · Blog · Pricing.
 */

test.describe('Sync explainer (SITE-117)', () => {
  test('header is Sync, Docs, Blog, Pricing — Sync ahead of Pricing', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByTestId('header-nav');
    await expect(nav.getByTestId('nav-sync')).toBeVisible();
    await expect(nav.getByTestId('nav-sync')).toHaveAttribute('href', '/sync');
    await expect(nav.getByTestId('nav-docs')).toHaveAttribute('href', '/docs');
    await expect(nav.getByTestId('nav-pricing')).toHaveAttribute('href', '/pricing');

    const links = nav.locator('a.header-nav-link');
    const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    expect(hrefs).toEqual(['/sync', '/docs', '/docs/blog', '/pricing']);
    expect(hrefs.indexOf('/sync')).toBeLessThan(hrefs.indexOf('/pricing'));

    // Demoted links live in the product footer, not the header.
    await expect(nav.getByRole('link', { name: 'aegis' })).toHaveCount(0);
    await expect(nav.getByRole('link', { name: 'About' })).toHaveCount(0);
    await expect(page.getByTestId('product-footer').getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByTestId('product-footer').getByRole('link', { name: 'aegis' })).toBeVisible();
  });

  test('Sync page leads after-Agile thesis without pricing-only framing', async ({ page }) => {
    await page.goto('/sync');
    const root = page.getByTestId('sync-explainer');
    await expect(root).toBeVisible();
    await expect(root.locator('h1')).toHaveText('RTMX Sync');
    const kicker = page.getByTestId('sync-kicker');
    await expect(kicker).toContainText(/What comes after/i);
    await expect(kicker).toContainText(/Agile/i);
    await expect(kicker.locator('.sync-kicker-words')).toContainText(/Kanban|Jira|Asana|Monday/i);
    await expect(root).toContainText(/Git versioned|Git stopped/i);
    await expect(root).toContainText(/open source/i);
    await expect(root).toContainText(/client is open source|no URL pasting/i);
    await expect(root).not.toContainText(/\$9/);
    await expect(page.getByTestId('sync-cta-checkout')).toBeVisible();
    await expect(page.getByTestId('sync-cta-checkout')).toHaveText(/14-day free trial/i);
    const trialNote = page.getByTestId('sync-trial-note');
    await expect(trialNote).toContainText(/Start Sync trial/i);
    await expect(trialNote).toContainText(/install the free client/i);
    const noteText = await trialNote.innerText();
    expect(noteText.toLowerCase().indexOf('trial')).toBeLessThan(
      noteText.toLowerCase().indexOf('install'),
    );
    await expect(page.getByTestId('sync-cta-cli')).toHaveAttribute('href', '/docs/installation');

    const install = page.getByTestId('sync-install');
    await expect(install).toContainText('rtmx login');
    await expect(install).toContainText('rtmx sync');
    await expect(install).not.toContainText('wss://');
    await expect(install).not.toContainText('--sync-url');

    const demo = page.getByTestId('sync-collab-demo');
    await expect(demo).toBeVisible();
    await expect(demo.getByRole('heading', { name: /One backlog\. Any agent stack/i })).toBeVisible();
    await expect(demo).toContainText(/Cursor|Claude|Codex|Gemini|OpenCode/i);
    await expect(demo).toContainText(/horizontal|any agent|different systems/i);
    await expect(demo.locator('[data-pane="you"]')).toBeVisible();
    await expect(demo.locator('[data-pane="cursor"]')).toBeVisible();
    await expect(demo.locator('[data-pane="claude"]')).toBeVisible();
    await expect(demo.locator('[data-panes="3"]')).toBeVisible();
    await expect(demo).toContainText(/demo \/ main/);
    // Not a You↔single-agent pair
    await expect(demo.locator('[data-pane="agent"]')).toHaveCount(0);
    // Primary emerald CTA must use white label (Starlight link styles otherwise wash it out).
    const primaryColor = await page.getByTestId('sync-cta-checkout').evaluate((el) => getComputedStyle(el).color);
    expect(primaryColor.replace(/\s/g, '')).toMatch(/^rgb\(255,255,255\)$|^rgba\(255,255,255/);

    // Feature points are cards inside the shared shell border.
    const cards = page.locator('.sync-point');
    await expect(cards).toHaveCount(4);
    const cardBorder = await cards.first().evaluate((el) => getComputedStyle(el).borderTopWidth);
    expect(parseFloat(cardBorder)).toBeGreaterThan(0);
    await expect(page.locator('.sync-shell')).toBeVisible();
  });

  test('homepage Sync-primary hierarchy (SITE-141)', async ({ page }) => {
    await page.goto('/');
    const card = page.getByTestId('hero-sync-card');
    await expect(card).toHaveAttribute('href', '/sync');
    await expect(card).toContainText(/After Git|Sync/i);
    await expect(card).toContainText(/14-day free trial|product/i);
    await expect(card).not.toContainText(/CRDT/i);

    // Primary = Sync trial; secondary = install client
    const trial = page.getByTestId('hero-cta-sync');
    await expect(trial).toHaveAttribute('href', '/checkout');
    await expect(trial).toHaveText(/Start 14-day free trial/i);
    await expect(trial).toHaveClass(/primary/);

    const install = page.getByTestId('hero-cta-install');
    await expect(install).toHaveAttribute('href', '/docs/installation');
    await expect(install).toHaveText(/Install the open source client/i);
    await expect(install).toHaveClass(/secondary/);

    const funnel = page.getByTestId('hero-funnel-note');
    await expect(funnel).toContainText(/Start Sync trial/i);
    await expect(funnel).toContainText(/install the free client/i);
    // SITE-159 / MONO-058a: trial → install → sign in (not install-first)
    const funnelText = await funnel.innerText();
    expect(funnelText.toLowerCase().indexOf('trial')).toBeLessThan(
      funnelText.toLowerCase().indexOf('install'),
    );
    await expect(page.getByTestId('hero-cta-thesis')).toHaveAttribute('href', '/sync');

    // UCP names Sync as product
    await expect(page.locator('.hero-ucp')).toContainText(/Sync/i);
    await expect(page.locator('.hero-subtitle')).toContainText(/Sync is the live room|RTMX Sync/i);

    // Sync How-it-works elevated on homepage (before client demo)
    const homeDemo = page.getByTestId('home-sync-demo');
    await expect(homeDemo.getByTestId('sync-collab-demo')).toBeVisible();
    await expect(page.getByTestId('product-demo-section')).toContainText(/Client demo/i);
  });

  test('How it works is multi-agent horizontal WIP (SITE-137/138, MONO-035a/b)', async ({ page }) => {
    await page.goto('/sync');
    const demo = page.getByTestId('sync-collab-demo');
    await expect(demo).toBeVisible();
    await expect(demo).toContainText(/Claude Code/i);
    await expect(demo).toContainText(/Cursor/i);
    await expect(demo.getByText('You', { exact: true }).first()).toBeVisible();
    const panes = demo.locator('.sync-demo-pane');
    await expect(panes).toHaveCount(3);
    const cols = await demo.locator('.sync-demo-panes').evaluate((el) => getComputedStyle(el).gridTemplateColumns);
    // Desktop: three tracks (Playwright default viewport is wide enough)
    expect(cols.split(' ').length).toBeGreaterThanOrEqual(3);
  });

  test('stage has no nested VHS; CLI recording is separate (SITE-184/185, MONO-060a)', async ({ page }) => {
    await page.goto('/sync');
    const demo = page.getByTestId('sync-collab-demo');
    await expect(demo.getByTestId('sync-collab-recording')).toHaveCount(0);
    await expect(demo.getByTestId('sync-demo-tape')).toHaveCount(0);

    const rec = page.getByTestId('sync-cli-recording');
    await expect(rec).toBeVisible();
    await expect(rec).toContainText(/Recorded from the CLI|What you type/i);
    await expect(rec.getByTestId('sync-demo-tape')).toBeVisible();

    await page.goto('/');
    await expect(page.getByTestId('home-sync-demo').getByTestId('sync-collab-demo')).toBeVisible();
    await expect(page.getByTestId('sync-cli-recording')).toHaveCount(0);
  });

  test('pricing defers product thesis to /sync', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByTestId('pricing-page')).toContainText(/Plans for RTMX Sync|Sync pricing/i);
    await expect(page.locator('a[href="/sync"]').first()).toBeVisible();
    await expect(page.locator('.pricing-subtitle')).toContainText(/multiplayer/i);
  });
});
