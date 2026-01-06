/**
 * RightSidebar Panels Tests
 * Tests for all RightSidebar tabs and panels
 * Based on wireframe specifications
 */

import { test, expect } from '@playwright/test';

test.describe('RightSidebar Panels - Wireframe Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Dev Chat tab is visible and accessible', async ({ page }) => {
    // Acceptance: Dev Chat tab visible
    const devChatTab = page.getByRole('button', { name: /dev chat/i });
    await expect(devChatTab).toBeVisible();

    // Click to open
    await devChatTab.click();
    await page.waitForTimeout(500);

    // Chat interface should be visible
    const chatInput = page.getByPlaceholder(/ask me/i);
    await expect(chatInput).toBeVisible();
  });

  test('2. Files tab is accessible', async ({ page }) => {
    // Acceptance: Files tab visible
    const filesTab = page.getByRole('button', { name: /files/i });
    await expect(filesTab).toBeVisible();
  });

  test('3. Terminal tab is accessible', async ({ page }) => {
    // Acceptance: Terminal tab visible
    const terminalTab = page.getByRole('button', { name: /terminal/i });
    await expect(terminalTab).toBeVisible();
  });

  test('4. Inspector tabs are accessible', async ({ page }) => {
    // Acceptance: All Inspector tabs visible (Tool, Object, Layers, Scripts, Actions)
    const inspectorTabs = ['Tool', 'Object', 'Layers', 'Scripts', 'Actions'];
    for (const tab of inspectorTabs) {
      const button = page.getByRole('button', { name: new RegExp(tab, 'i') });
      await expect(button).toBeVisible();
    }
  });

  test('5. Actions panel opens from Inspector', async ({ page }) => {
    // Acceptance: Actions tab opens panel
    const actionsTab = page.getByRole('button', { name: /actions/i });
    await actionsTab.click();
    await page.waitForTimeout(500);

    // Panel should be visible
    const panel = page.locator('[class*="Actions"]').first();
    await expect(panel).toBeVisible();
  });

  test('6. RightSidebar does not block canvas', async ({ page }) => {
    // Acceptance: Canvas has adequate space
    const canvas = page.locator('[data-canvas-area="true"]');
    const rightSidebar = page.locator('aside').last();

    await expect(canvas).toBeVisible();
    await expect(rightSidebar).toBeVisible();

    const canvasBox = await canvas.boundingBox();
    expect(canvasBox?.width).toBeGreaterThan(400);
  });
});
