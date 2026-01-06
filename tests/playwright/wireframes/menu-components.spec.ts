/**
 * Menu Components Tests
 * Tests for ProfessionalFileMenu, submenus, keyboard navigation
 * Based on wireframe specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Menu Components - Wireframe Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. File menu is accessible', async ({ page }) => {
    // Acceptance: File menu button visible
    const fileMenu = page.getByRole('button', { name: /file/i }).first();
    await expect(fileMenu).toBeVisible();
  });

  test('2. Menu items are accessible', async ({ page }) => {
    // Acceptance: All main menu items visible
    const menuItems = [
      'File',
      'Edit',
      'Object',
      'Type',
      'Select',
      'Effect',
      'View',
      'Window',
      'Help',
    ];
    for (const item of menuItems) {
      const button = page.getByRole('button', { name: new RegExp(item, 'i') }).first();
      await expect(button).toBeVisible();
    }
  });

  test('3. Menu opens on hover', async ({ page }) => {
    // Acceptance: Menu dropdown appears on hover
    const fileMenu = page.getByRole('button', { name: /file/i }).first();
    await fileMenu.hover();
    await page.waitForTimeout(300);

    // Menu items should be visible
    const newButton = page.getByRole('button', { name: /new/i });
    await expect(newButton).toBeVisible();
  });

  test('4. Submenus are accessible', async ({ page }) => {
    // Acceptance: Submenus open correctly
    const fileMenu = page.getByRole('button', { name: /file/i }).first();
    await fileMenu.hover();
    await page.waitForTimeout(300);

    // Check for submenu items
    const exportButton = page.getByRole('button', { name: /export/i });
    await expect(exportButton).toBeVisible();
  });

  test('5. Keyboard navigation works', async ({ page }) => {
    // Acceptance: Can navigate menus with keyboard
    const fileMenu = page.getByRole('button', { name: /file/i }).first();
    await fileMenu.focus();
    await fileMenu.press('Enter');
    await page.waitForTimeout(300);

    // Menu should be open
    const newButton = page.getByRole('button', { name: /new/i });
    await expect(newButton).toBeVisible();
  });
});
