/**
 * Responsive Layout Tests
 * Tests for layout behavior at different viewport sizes
 * Based on wireframe specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Responsive Layout - Wireframe Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Layout works at desktop size', async ({ page }) => {
    // Acceptance: All panels visible at desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    const leftSidebar = page.locator('aside').first();
    const rightSidebar = page.locator('aside').last();
    const canvas = page.locator('[data-canvas-area="true"]');

    await expect(leftSidebar).toBeVisible();
    await expect(rightSidebar).toBeVisible();
    await expect(canvas).toBeVisible();
  });

  test('2. Layout adapts to tablet size', async ({ page }) => {
    // Acceptance: Layout remains functional at tablet size
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500);

    const canvas = page.locator('[data-canvas-area="true"]');
    await expect(canvas).toBeVisible();
  });

  test('3. Canvas has minimum width', async ({ page }) => {
    // Acceptance: Canvas maintains minimum usable width
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    const canvas = page.locator('[data-canvas-area="true"]');
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(400);
  });

  test('4. Sidebars remain accessible', async ({ page }) => {
    // Acceptance: Sidebars can be toggled or remain visible
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    const leftSidebar = page.locator('aside').first();
    await expect(leftSidebar).toBeVisible();
  });
});
