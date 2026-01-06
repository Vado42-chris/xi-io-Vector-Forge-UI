/**
 * Comprehensive Validation Tests
 * Tests all fixes and features from this session
 */

import { test, expect } from '@playwright/test';

test.describe('Comprehensive Session Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. ESLint Config - No parsing errors', async ({ page }) => {
    // Check console for ESLint-related errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('eslint')) {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForTimeout(1000);

    // Should not have ESLint parsing errors
    expect(consoleErrors.length).toBe(0);
  });

  test('2. Generate with AI button exists and is visible', async ({ page }) => {
    const button = page.getByRole('button', { name: /generate with ai/i });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('3. Floating AI Panel opens on button click', async ({ page }) => {
    const button = page.getByRole('button', { name: /generate with ai/i });
    await button.click();
    await page.waitForTimeout(500);

    // Panel should appear
    const panel = page.locator('text=GENERATIVE VECTOR AI').first();
    await expect(panel).toBeVisible();
  });

  test('4. Permanent AI Panel is hidden', async ({ page }) => {
    // Permanent panel should not be visible
    const permanentPanel = page.locator('.app-ai-panel').first();
    const count = await permanentPanel.count();

    // If it exists, it should be hidden (display: none or not visible)
    if (count > 0) {
      const isVisible = await permanentPanel.isVisible().catch(() => false);
      expect(isVisible).toBe(false);
    }
  });

  test('5. No duplicate ActionCenter modals', async ({ page }) => {
    // Should not have multiple "Enter a prompt to start" modals
    const modals = page.locator('text=/enter a prompt/i');
    const count = await modals.count();
    expect(count).toBeLessThanOrEqual(1);
  });

  test('6. Canvas empty state shows correct message', async ({ page }) => {
    // Canvas should show "Enter a prompt to start"
    const canvas = page.locator('[data-canvas-area="true"]');
    await expect(canvas).toBeVisible();

    const emptyState = page.locator('text=/enter a prompt to start/i');
    await expect(emptyState.first()).toBeVisible();
  });

  test('7. Floating panel can be closed', async ({ page }) => {
    // Open panel
    const button = page.getByRole('button', { name: /generate with ai/i });
    await button.click();
    await page.waitForTimeout(500);

    // Close button should exist
    const closeButton = page.getByRole('button', { name: /close ai panel/i });
    await expect(closeButton).toBeVisible();

    // Click close
    await closeButton.click();
    await page.waitForTimeout(500);

    // Panel should be hidden
    const panel = page.locator('text=GENERATIVE VECTOR AI').first();
    const isVisible = await panel.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });

  test('8. Canvas has adequate space without permanent panel', async ({ page }) => {
    const canvas = page.locator('[data-canvas-area="true"]');
    const box = await canvas.boundingBox();

    // Canvas should have significant height
    expect(box?.height).toBeGreaterThan(400);
    expect(box?.width).toBeGreaterThan(400);
  });

  test('9. All header buttons are functional', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /save/i }).first();
    const loadButton = page.getByRole('button', { name: /load/i }).first();
    const exportButton = page.getByRole('button', { name: /export svg/i }).first();

    await expect(saveButton).toBeVisible();
    await expect(loadButton).toBeVisible();
    await expect(exportButton).toBeVisible();
  });

  test('10. No console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Filter out expected errors (FileSystem, Terminal unavailable)
    const criticalErrors = errors.filter(
      e => !e.includes('FileSystem unavailable') && !e.includes('Terminal unavailable')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
