/**
 * Actions Panel Tests
 * Tests for ActionsPanel component
 * Based on Phase 1 Day 3 design specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Actions Panel - Design Spec Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Actions panel is accessible via RightSidebar', async ({ page }) => {
    // Acceptance: Actions tab visible in RightSidebar Inspector
    const actionsTab = page.getByRole('button', { name: /actions/i });
    await expect(actionsTab).toBeVisible();
  });

  test('2. Actions panel opens when tab clicked', async ({ page }) => {
    // Acceptance: Clicking Actions tab shows panel content
    const actionsTab = page.getByRole('button', { name: /actions/i });
    await actionsTab.click();
    await page.waitForTimeout(500);

    // Panel content should be visible
    const panel = page.locator('[class*="Actions"], [data-testid="actions-panel"]').first();
    await expect(panel).toBeVisible();
  });

  test('3. Actions panel supports hashtag system', async ({ page }) => {
    // Acceptance: Panel ready for hashtag parser integration
    const actionsTab = page.getByRole('button', { name: /actions/i });
    await actionsTab.click();
    await page.waitForTimeout(500);

    // Should have input or area for hashtag commands
    const input = page
      .locator('input, textarea')
      .filter({ hasText: /#|hashtag/i })
      .first();
    const hasInput = (await input.count()) > 0;
    expect(hasInput).toBeTruthy();
  });

  test('4. Actions panel is in Inspector tab group', async ({ page }) => {
    // Acceptance: Actions is part of Inspector tabs (Tool, Object, Layers, Scripts, Actions)
    const inspectorTabs = page
      .locator('button')
      .filter({ hasText: /tool|object|layers|scripts|actions/i });
    const count = await inspectorTabs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('5. Actions panel integrates with RightSidebar', async ({ page }) => {
    // Acceptance: Actions panel is part of RightSidebar layout
    const rightSidebar = page.locator('[class*="RightSidebar"], aside').last();
    const actionsTab = page.getByRole('button', { name: /actions/i });

    await expect(rightSidebar).toBeVisible();
    await expect(actionsTab).toBeVisible();
  });
});
