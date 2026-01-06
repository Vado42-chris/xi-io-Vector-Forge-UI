/**
 * Empty State Tests
 * Tests for Canvas, Layers, History empty states
 * Based on wireframe specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Empty States - Wireframe Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Canvas empty state shows correct message', async ({ page }) => {
    // Acceptance: Canvas shows "Enter a prompt to start"
    const emptyState = page.locator('text=/enter a prompt to start/i').first();
    await expect(emptyState).toBeVisible();
  });

  test('2. Canvas empty state is helpful', async ({ page }) => {
    // Acceptance: Empty state guides user to next action
    const canvas = page.locator('[data-canvas-area="true"]');
    await expect(canvas).toBeVisible();

    // Should have guidance text
    const guidance = page.locator('text=/start|prompt|create/i').first();
    await expect(guidance).toBeVisible();
  });

  test('3. Empty state does not block AI panel access', async ({ page }) => {
    // Acceptance: User can still access AI panel from empty state
    const aiButton = page.getByRole('button', { name: /generate with ai/i });
    await expect(aiButton).toBeVisible();
    await expect(aiButton).toBeEnabled();
  });
});
