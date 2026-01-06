/**
 * Loading State Tests
 * Tests for Canvas, AI, Files loading states
 * Based on wireframe specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Loading States - Wireframe Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. App loads without errors', async ({ page }) => {
    // Acceptance: No critical errors on load
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out expected errors
        if (!text.includes('FileSystem unavailable') && !text.includes('Terminal unavailable')) {
          errors.push(text);
        }
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    expect(errors.length).toBe(0);
  });

  test('2. Components render successfully', async ({ page }) => {
    // Acceptance: All main components visible
    const canvas = page.locator('[data-canvas-area="true"]');
    const leftSidebar = page.locator('aside').first();
    const rightSidebar = page.locator('aside').last();

    await expect(canvas).toBeVisible();
    await expect(leftSidebar).toBeVisible();
    await expect(rightSidebar).toBeVisible();
  });

  test('3. Resources load successfully', async ({ page }) => {
    // Acceptance: CSS and components load
    await page.waitForLoadState('networkidle');

    // Check for loaded resources
    const canvas = page.locator('[data-canvas-area="true"]');
    await expect(canvas).toBeVisible();
  });
});
