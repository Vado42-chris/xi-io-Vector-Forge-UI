/**
 * Floating Components Tests
 * Tests for ActionCenter, XP Display, Toast notifications
 * Based on wireframe specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Floating Components - Wireframe Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. XP Display is visible', async ({ page }) => {
    // Acceptance: XP progress bar visible
    const xpDisplay = page.locator('[role="progressbar"]').first();
    await expect(xpDisplay).toBeVisible();
  });

  test('2. Toast notifications can appear', async ({ page }) => {
    // Acceptance: Toast system exists (may not be visible until triggered)
    // Check for toast container
    const toastContainer = page.locator('[class*="toast"], [class*="Toast"]').first();
    // May not be visible until toast is shown, so just check it exists in DOM
    const exists = (await toastContainer.count()) > 0;
    expect(exists).toBeTruthy();
  });

  test('3. Advanced Mode button is visible', async ({ page }) => {
    // Acceptance: Advanced Mode toggle visible
    const advancedButton = page.getByRole('button', { name: /advanced mode/i });
    await expect(advancedButton).toBeVisible();
  });

  test('4. No duplicate ActionCenter modals', async ({ page }) => {
    // Acceptance: Only one ActionCenter or none (removed)
    const actionCenters = page.locator('text=/enter a prompt/i');
    const count = await actionCenters.count();
    expect(count).toBeLessThanOrEqual(1);
  });
});
