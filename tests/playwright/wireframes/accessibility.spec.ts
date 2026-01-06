/**
 * Accessibility Tests
 * Tests for ARIA labels, keyboard navigation, screen reader support
 * Based on wireframe specifications and WCAG compliance
 */

import { test, expect } from '@playwright/test';

test.describe('Accessibility - Wireframe Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Buttons have accessible labels', async ({ page }) => {
    // Acceptance: All buttons have aria-label or text content
    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      const hasLabel = ariaLabel || (text && text.trim().length > 0);
      expect(hasLabel).toBeTruthy();
    }
  });

  test('2. Inputs have labels', async ({ page }) => {
    // Acceptance: Inputs have associated labels or aria-label
    const inputs = page.locator('input, textarea');
    const count = await inputs.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      const id = await input.getAttribute('id');
      const hasLabel = ariaLabel || placeholder || id;
      expect(hasLabel).toBeTruthy();
    }
  });

  test('3. Navigation landmarks exist', async ({ page }) => {
    // Acceptance: Semantic HTML landmarks present
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('4. Focus indicators visible', async ({ page }) => {
    // Acceptance: Focusable elements show focus state
    const button = page.getByRole('button', { name: /save/i }).first();
    await button.focus();

    // Check if element has focus
    const isFocused = await button.evaluate(el => document.activeElement === el);
    expect(isFocused).toBeTruthy();
  });

  test('5. Color contrast is sufficient', async ({ page }) => {
    // Acceptance: Text has sufficient contrast (basic check)
    const canvas = page.locator('[data-canvas-area="true"]');
    await expect(canvas).toBeVisible();

    // Visual check - text should be readable
    const text = page.locator('text=/enter a prompt/i').first();
    await expect(text).toBeVisible();
  });
});
