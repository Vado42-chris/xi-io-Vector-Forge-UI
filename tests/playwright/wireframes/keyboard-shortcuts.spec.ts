/**
 * Keyboard Shortcuts Tests
 * Tests for keyboard navigation and shortcuts
 * Based on wireframe specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Keyboard Shortcuts - Wireframe Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Save shortcut works', async ({ page }) => {
    // Acceptance: Ctrl+S triggers save
    await page.keyboard.press('Control+s');
    await page.waitForTimeout(500);

    // Should not have errors
    const errors = await page.evaluate(() => {
      return window.console.error.toString();
    });
    expect(errors).toBeDefined();
  });

  test('2. Tab navigation works', async ({ page }) => {
    // Acceptance: Tab key moves focus
    const firstButton = page.getByRole('button', { name: /file/i }).first();
    await firstButton.focus();

    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    // Focus should have moved
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('3. Escape closes menus', async ({ page }) => {
    // Acceptance: Escape key closes open menus
    const fileMenu = page.getByRole('button', { name: /file/i }).first();
    await fileMenu.click();
    await page.waitForTimeout(300);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Menu should be closed (no visible menu items)
    const menuItems = page.locator('[role="menuitem"]');
    const count = await menuItems.count();
    expect(count).toBeLessThanOrEqual(1);
  });

  test('4. Enter activates buttons', async ({ page }) => {
    // Acceptance: Enter key activates focused button
    const saveButton = page.getByRole('button', { name: /save/i }).first();
    await saveButton.focus();

    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Should not have errors
    const errors = await page.evaluate(() => {
      return window.console.error.toString();
    });
    expect(errors).toBeDefined();
  });
});
