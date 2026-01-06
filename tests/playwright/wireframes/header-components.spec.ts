/**
 * Header Components Tests
 * Tests for FileMenu, SaveLoad, Export, Sign buttons
 * Based on wireframe specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Header Components - Wireframe Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. FileMenu is visible and functional', async ({ page }) => {
    // Acceptance: File menu button visible
    const fileMenu = page.getByRole('button', { name: /file/i }).first();
    await expect(fileMenu).toBeVisible();
    await expect(fileMenu).toBeEnabled();
  });

  test('2. Save button is visible and functional', async ({ page }) => {
    // Acceptance: Save button in header
    const saveButton = page.getByRole('button', { name: /save/i }).first();
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
  });

  test('3. Load button is visible and functional', async ({ page }) => {
    // Acceptance: Load button in header
    const loadButton = page.getByRole('button', { name: /load/i }).first();
    await expect(loadButton).toBeVisible();
    await expect(loadButton).toBeEnabled();
  });

  test('4. Export SVG button is visible', async ({ page }) => {
    // Acceptance: Export button in header
    const exportButton = page.getByRole('button', { name: /export svg/i });
    await expect(exportButton).toBeVisible();
  });

  test('5. Sign & Create Proof button is visible', async ({ page }) => {
    // Acceptance: Sign button in header
    const signButton = page.getByRole('button', { name: /sign.*proof/i });
    await expect(signButton).toBeVisible();
  });

  test('6. Generate with AI button is visible', async ({ page }) => {
    // Acceptance: AI button in header
    const aiButton = page.getByRole('button', { name: /generate with ai/i });
    await expect(aiButton).toBeVisible();
  });

  test('7. Header menu items are accessible', async ({ page }) => {
    // Acceptance: All menu items (File, Edit, Object, Type, etc.) visible
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
});
