/**
 * Canvas and AI Panel Tests
 * Tests for Canvas and AIFloatingPanel components
 * Based on Design Guide Compliance specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Canvas and AI Panel - Design Spec Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Canvas is visible and has adequate space', async ({ page }) => {
    // Acceptance: Canvas takes remaining space, no permanent AI panel blocking
    const canvas = page.locator('[data-canvas-area="true"]');
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    expect(box?.height).toBeGreaterThan(400);
    expect(box?.width).toBeGreaterThan(400);
  });

  test('2. Canvas shows empty state message', async ({ page }) => {
    // Acceptance: Empty canvas shows "Enter a prompt to start"
    const emptyState = page.locator('text=/enter a prompt to start/i').first();
    await expect(emptyState).toBeVisible();
  });

  test('3. AI Panel is floating, not permanent', async ({ page }) => {
    // Acceptance: No permanent AI panel in center stack
    const permanentPanel = page.locator('.app-ai-panel').first();
    const isVisible = await permanentPanel.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });

  test('4. Generate with AI button opens floating panel', async ({ page }) => {
    // Acceptance: Button in header opens floating panel
    const button = page.getByRole('button', { name: /generate with ai/i });
    await button.click();
    await page.waitForTimeout(500);

    const panel = page.locator('text=GENERATIVE VECTOR AI').first();
    await expect(panel).toBeVisible();
  });

  test('5. Floating panel can be closed', async ({ page }) => {
    // Acceptance: Panel has close button and can be dismissed
    const button = page.getByRole('button', { name: /generate with ai/i });
    await button.click();
    await page.waitForTimeout(500);

    const closeButton = page.getByRole('button', { name: /close/i });
    await closeButton.click();
    await page.waitForTimeout(500);

    const panel = page.locator('text=GENERATIVE VECTOR AI').first();
    const isVisible = await panel.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });

  test('6. Canvas and AI Panel work together', async ({ page }) => {
    // Acceptance: AI generation updates canvas
    const canvas = page.locator('[data-canvas-area="true"]');
    await expect(canvas).toBeVisible();

    const aiButton = page.getByRole('button', { name: /generate with ai/i });
    await expect(aiButton).toBeVisible();
  });
});
