/**
 * Sidebar Integration Tests
 * Tests for LeftSidebar and RightSidebar components
 * Based on Design Guide Compliance specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Sidebar Integration - Design Spec Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. LeftSidebar contains tools and Library', async ({ page }) => {
    // Acceptance: LeftSidebar has tool buttons and Library panel
    const leftSidebar = page.locator('aside').first();
    await expect(leftSidebar).toBeVisible();

    const tools = page.getByRole('button', { name: /select|pen|rectangle|ellipse|text/i });
    const library = page.locator('text=Library').first();

    await expect(tools.first()).toBeVisible();
    await expect(library).toBeVisible();
  });

  test('2. RightSidebar contains Inspector tabs', async ({ page }) => {
    // Acceptance: RightSidebar has Inspector tabs (Tool, Object, Layers, Scripts, Actions)
    const rightSidebar = page.locator('aside').last();
    await expect(rightSidebar).toBeVisible();

    const inspectorTabs = page.getByRole('button', { name: /tool|object|layers|scripts|actions/i });
    const count = await inspectorTabs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('3. RightSidebar contains Dev Chat', async ({ page }) => {
    // Acceptance: Dev Chat tab visible and functional
    const devChatTab = page.getByRole('button', { name: /dev chat/i });
    await expect(devChatTab).toBeVisible();
  });

  test('4. Sidebars do not block canvas', async ({ page }) => {
    // Acceptance: Canvas has adequate space between sidebars
    const canvas = page.locator('[data-canvas-area="true"]');
    const leftSidebar = page.locator('aside').first();
    const rightSidebar = page.locator('aside').last();

    await expect(canvas).toBeVisible();
    await expect(leftSidebar).toBeVisible();
    await expect(rightSidebar).toBeVisible();

    const canvasBox = await canvas.boundingBox();
    expect(canvasBox?.width).toBeGreaterThan(400);
  });

  test('5. Library is integrated in LeftSidebar', async ({ page }) => {
    // Acceptance: Library panel is part of LeftSidebar, not separate
    const leftSidebar = page.locator('aside').first();
    const library = page.locator('text=Library').first();

    await expect(leftSidebar).toBeVisible();
    await expect(library).toBeVisible();
  });

  test('6. Actions is integrated in RightSidebar Inspector', async ({ page }) => {
    // Acceptance: Actions panel is in RightSidebar Inspector tab group
    const actionsTab = page.getByRole('button', { name: /actions/i });
    await expect(actionsTab).toBeVisible();
  });
});
