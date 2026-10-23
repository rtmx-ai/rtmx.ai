import { defineConfig } from '@playwright/test';

// Cap parallelism when CI=1 (Deploy Website + scripts/ci-local.sh) so a single
// Astro webServer is not overloaded — that caused page.goto timeouts and races.
const inCi = !!process.env.CI;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: inCi ? 1 : 0,
  workers: inCi ? 2 : undefined,
  use: {
    baseURL: 'http://localhost:4321',
    headless: true,
  },
  webServer: {
    command: 'npm run dev',
    port: 4321,
    reuseExistingServer: !inCi,
    timeout: 60_000,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
