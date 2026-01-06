/**
 * Interaction State Tests
 * Tests for button states, tool states, input states
 * Based on wireframe specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Interaction States - Wireframe Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Buttons are enabled and clickable', async ({ page }) => {
    // Acceptance: All header buttons are functional
    const saveButton = page.getByRole('button', { name: /save/i }).first();
    const loadButton = page.getByRole('button', { name: /load/i }).first();
    const exportButton = page.getByRole('button', { name: /export/i }).first();

    await expect(saveButton).toBeEnabled();
    await expect(loadButton).toBeEnabled();
    await expect(exportButton).toBeEnabled();
  });

  test('2. Tool buttons are selectable', async ({ page }) => {
    // Acceptance: Tool buttons can be clicked
    const selectTool = page.getByRole('button', { name: /select/i }).first();
    const penTool = page.getByRole('button', { name: /pen/i });
    const rectangleTool = page.getByRole('button', { name: /rectangle/i });

    await expect(selectTool).toBeEnabled();
    await expect(penTool).toBeEnabled();
    await expect(rectangleTool).toBeEnabled();
  });

  test('3. Inputs are editable', async ({ page }) => {
    // Acceptance: Text inputs can be typed in
    const searchInput = page.getByPlaceholder(/search library/i);
    await expect(searchInput).toBeEnabled();

    // Can type
    await searchInput.fill('test');
    const value = await searchInput.inputValue();
    expect(value).toBe('test');
  });

  test('4. AI panel inputs are functional', async ({ page }) => {
    // Acceptance: AI panel inputs work
    const aiButton = page.getByRole('button', { name: /generate with ai/i });
    await aiButton.click();
    await page.waitForTimeout(500);

    const promptInput = page.getByPlaceholder(/describe.*vector/i);
    await expect(promptInput).toBeVisible();
    await expect(promptInput).toBeEnabled();
  });
});
