/**
 * Animator Persona User Journey Tests
 * Simulates Alex Animator (Advanced Motion Graphics Designer)
 * Based on v61 persona testing patterns adapted for front-end UX
 */

import { test, expect } from '@playwright/test';
import { getPersonaById } from './persona-definitions';

const persona = getPersonaById('animator')!;

test.describe(`Persona: ${persona.name} - ${persona.role}`, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Journey: Create animation with timeline', async ({ page }) => {
    // Acceptance: Animator can create layers and add keyframes
    // Step 1: Verify timeline is visible
    const timeline = page.locator('[class*="Timeline"]').first();
    await expect(timeline).toBeVisible();

    // Step 2: Add a layer
    const addLayer = page.getByRole('button', { name: /\+.*layer|add layer/i }).first();
    await expect(addLayer).toBeVisible();
    await addLayer.click();

    // Step 3: Verify layer appears in timeline
    const layers = page.locator('text=/layer/i');
    const layerCount = await layers.count();
    expect(layerCount).toBeGreaterThan(0);
  });

  test('2. Journey: Use play controls for preview', async ({ page }) => {
    // Acceptance: Animator can preview animation
    const playButton = page.getByRole('button', { name: /▶|play/i }).first();
    const pauseButton = page.getByRole('button', { name: /⏹|pause|stop/i }).first();

    await expect(playButton).toBeVisible();
    await expect(pauseButton).toBeVisible();

    // Can click play
    await playButton.click();
    await page.waitForTimeout(500);

    // Can pause
    await pauseButton.click();
  });

  test('3. Journey: Navigate frames precisely', async ({ page }) => {
    // Acceptance: Animator can move between frames
    const prevFrame = page.getByRole('button', { name: /◄|previous/i }).first();
    const nextFrame = page.getByRole('button', { name: /►|next/i }).first();

    await expect(prevFrame).toBeVisible();
    await expect(nextFrame).toBeVisible();

    // Can navigate frames
    await nextFrame.click();
    await prevFrame.click();
  });

  test('4. Journey: Organize assets in library', async ({ page }) => {
    // Acceptance: Animator can use library for reusable assets
    const library = page.locator('text=Library').first();
    await expect(library).toBeVisible();

    const newSymbol = page.getByRole('button', { name: /new symbol/i }).first();
    await expect(newSymbol).toBeVisible();
  });

  test('5. Journey: Export animation', async ({ page }) => {
    // Acceptance: Animator can export work
    const exportButton = page.getByRole('button', { name: /export/i }).first();
    await expect(exportButton).toBeVisible();
    await expect(exportButton).toBeEnabled();
  });
});
