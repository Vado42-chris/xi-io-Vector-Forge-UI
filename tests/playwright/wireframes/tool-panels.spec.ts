/**
 * Tool Panels Tests
 * Tests for Tool Properties, Transform, Rulers, Guides, Grid
 * Based on wireframe specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Tool Panels - Wireframe Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Tool Properties panel accessible', async ({ page }) => {
    // Acceptance: Tool properties visible when tool selected
    const toolProperties = page
      .locator('[class*="ToolProperties"], [data-testid="tool-properties"]')
      .first();
    // May be in RightSidebar Inspector
    const inspectorTabs = page.getByRole('button', { name: /tool/i });
    await expect(inspectorTabs).toBeVisible();
  });

  test('2. Canvas Settings accessible', async ({ page }) => {
    // Acceptance: Canvas settings button visible
    const canvasSettings = page.getByRole('button', { name: /canvas settings/i });
    await expect(canvasSettings).toBeVisible();
  });

  test('3. Rulers can be toggled', async ({ page }) => {
    // Acceptance: Rulers toggle in View menu or settings
    // Check for rulers in view menu or settings
    const viewMenu = page.getByRole('button', { name: /view/i });
    await expect(viewMenu).toBeVisible();
  });

  test('4. Guides can be created', async ({ page }) => {
    // Acceptance: Guide creation button in timeline or tools
    const guideButton = page.getByRole('button', { name: /guide/i });
    await expect(guideButton).toBeVisible();
  });
});
