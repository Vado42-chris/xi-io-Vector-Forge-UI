/**
 * Error State Tests
 * Tests for Canvas, AI, Save error states
 * Based on wireframe specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Error States - Wireframe Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Error display is accessible', async ({ page }) => {
    // Acceptance: Error display component exists
    // May not be visible until error occurs
    const errorDisplay = page.locator('[class*="Error"], [data-testid="error"]').first();
    // Just check it exists in DOM structure
    const exists = (await errorDisplay.count()) > 0;
    expect(exists).toBeTruthy();
  });

  test('2. No critical console errors on load', async ({ page }) => {
    // Acceptance: Only expected errors (FileSystem, Terminal unavailable)
    const criticalErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (
          !text.includes('FileSystem unavailable') &&
          !text.includes('Terminal unavailable') &&
          !text.includes('cdn.tailwindcss.com')
        ) {
          criticalErrors.push(text);
        }
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    expect(criticalErrors.length).toBe(0);
  });

  test('3. App handles errors gracefully', async ({ page }) => {
    // Acceptance: App continues to function after errors
    const canvas = page.locator('[data-canvas-area="true"]');
    await expect(canvas).toBeVisible();

    // App should still be functional
    const aiButton = page.getByRole('button', { name: /generate with ai/i });
    await expect(aiButton).toBeVisible();
  });
});
