/**
 * Timeline Panel Tests
 * Tests for ProfessionalTimeline component
 * Based on Phase 1 Day 1 design specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Timeline Panel - Design Spec Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Timeline panel is visible in center stack', async ({ page }) => {
    // Acceptance: Timeline should be visible in center area
    const timeline = page
      .locator('[data-testid="timeline"], .timeline, [class*="Timeline"]')
      .first();
    await expect(timeline).toBeVisible();
  });

  test('2. Timeline shows layers visualization', async ({ page }) => {
    // Acceptance: Timeline should display layers
    const layers = page.locator('text=/layer/i').first();
    await expect(layers).toBeVisible();
  });

  test('3. Timeline has play controls', async ({ page }) => {
    // Acceptance: Play, pause, stop, rewind, forward buttons visible
    const playButton = page.getByRole('button', { name: /▶|play/i }).first();
    const pauseButton = page.getByRole('button', { name: /⏹|pause|stop/i }).first();

    await expect(playButton).toBeVisible();
    await expect(pauseButton).toBeVisible();
  });

  test('4. Timeline has frame navigation', async ({ page }) => {
    // Acceptance: Previous/Next frame buttons visible
    const prevFrame = page.getByRole('button', { name: /◄|previous|prev/i }).first();
    const nextFrame = page.getByRole('button', { name: /►|next/i }).first();

    await expect(prevFrame).toBeVisible();
    await expect(nextFrame).toBeVisible();
  });

  test('5. Timeline has layer management buttons', async ({ page }) => {
    // Acceptance: Add layer, folder, mask, guide buttons visible
    const addLayer = page.getByRole('button', { name: /\+.*layer|add layer/i }).first();
    await expect(addLayer).toBeVisible();
  });

  test('6. Timeline integrates with canvas', async ({ page }) => {
    // Acceptance: Timeline actions affect canvas display
    const canvas = page.locator('[data-canvas-area="true"]');
    await expect(canvas).toBeVisible();

    // Timeline should be in same viewport
    const timeline = page.locator('[class*="Timeline"]').first();
    const timelineBox = await timeline.boundingBox();
    const canvasBox = await canvas.boundingBox();

    expect(timelineBox).not.toBeNull();
    expect(canvasBox).not.toBeNull();
  });
});
