import { test, expect } from '@playwright/test';

/**
 * REQ-SITE-147/148 / REQ-MONO-039: Project Management adapter docs hub.
 */

test.describe('PM adapter docs hub (SITE-147/148)', () => {
  test('sidebar lists Project Management and MCP, not standalone GitHub/Jira', async ({
    page,
  }) => {
    await page.goto('/docs/adapters');
    const sidebar = page.locator('nav.sidebar, .sidebar-content, starlight-menu').first();
    await expect(sidebar.getByText('Project Management', { exact: true }).first()).toBeVisible();
    await expect(sidebar.getByText('MCP Server', { exact: true }).first()).toBeVisible();
    // Standalone nav entries removed (hub tabs cover providers)
    await expect(sidebar.getByRole('link', { name: 'GitHub', exact: true })).toHaveCount(0);
    await expect(sidebar.getByRole('link', { name: 'Jira', exact: true })).toHaveCount(0);
  });

  test('PM hub tabs cover five providers with yaml examples', async ({ page }) => {
    await page.goto('/docs/adapters/project-management');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Project Management/i);
    for (const label of ['GitHub', 'Jira', 'Asana', 'Monday', 'GitLab']) {
      await expect(page.getByRole('tab', { name: label })).toBeVisible();
    }
    await page.getByRole('tab', { name: 'Asana' }).click();
    await expect(page.locator('[role="tabpanel"]').filter({ hasText: /workspace_gid/ })).toBeVisible();
    await page.getByRole('tab', { name: 'Monday' }).click();
    await expect(page.locator('[role="tabpanel"]').filter({ hasText: /board_id/ })).toBeVisible();
    await page.getByRole('tab', { name: 'GitLab' }).click();
    await expect(page.locator('[role="tabpanel"]').filter({ hasText: /gitlab/i })).toBeVisible();
  });

  test('legacy /docs/adapters/github redirects to PM hub', async ({ page }) => {
    await page.goto('/docs/adapters/github');
    await expect(page).toHaveURL(/\/docs\/adapters\/project-management\/?$/);
  });
});
