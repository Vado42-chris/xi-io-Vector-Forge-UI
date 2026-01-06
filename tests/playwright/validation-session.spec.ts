/**
 * Session Validation Tests
 * Validates all fixes and features from this session
 */

import { test, expect } from '@playwright/test';

test.describe('Session Validation - All Fixes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('1. No duplicate ActionCenter modals', async ({ page }) => {
    // Should not have multiple "Enter a prompt to start" modals
    const modals = page.locator('text=/enter a prompt/i');
    const count = await modals.count();
    expect(count).toBeLessThanOrEqual(1);
  });

  test('2. Canvas empty state shows correct message', async ({ page }) => {
    // Canvas should show "Enter a prompt to start"
    const canvas = page.locator('[data-canvas-area="true"]');
    await expect(canvas).toBeVisible();

    const emptyState = page.locator('text=/enter a prompt to start/i');
    await expect(emptyState).toBeVisible();
  });

  test('3. AI Panel is floating, not permanent', async ({ page }) => {
    // Permanent panel should not be visible
    const permanentPanel = page.locator('.app-ai-panel');
    const isVisible = await permanentPanel.isVisible().catch(() => false);
    expect(isVisible).toBe(false);

    // Generate button should exist
    const generateButton = page.getByRole('button', { name: /generate with ai/i });
    await expect(generateButton).toBeVisible();
  });

  test('4. AI Floating Panel opens on button click', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /generate with ai/i });
    await generateButton.click();
    await page.waitForTimeout(500);

    // Panel should appear
    const panel = page.locator('text=GENERATIVE VECTOR AI').locator('..');
    await expect(panel).toBeVisible();
  });

  test('5. Canvas has more space without permanent AI panel', async ({ page }) => {
    const canvas = page.locator('[data-canvas-area="true"]');
    const box = await canvas.boundingBox();
    expect(box?.height).toBeGreaterThan(400); // Should have significant height
  });
});
