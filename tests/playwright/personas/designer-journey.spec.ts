/**
 * Designer Persona User Journey Tests
 * Simulates Sam Designer (Intermediate Vector Illustrator)
 */

import { test, expect } from '@playwright/test';
import { getPersonaById } from './persona-definitions';

const persona = getPersonaById('designer')!;

test.describe(`Persona: ${persona.name} - ${persona.role}`, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Journey: Create symbol from design', async ({ page }) => {
    // Acceptance: Designer can create reusable symbols
    const library = page.locator('text=Library').first();
    await expect(library).toBeVisible();

    const newSymbol = page.getByRole('button', { name: /new symbol/i }).first();
    await expect(newSymbol).toBeVisible();
  });

  test('2. Journey: Use AI to generate variations', async ({ page }) => {
    // Acceptance: Designer can use AI panel without blocking canvas
    const aiButton = page.getByRole('button', { name: /generate with ai/i });
    await expect(aiButton).toBeVisible();

    // Open AI panel
    await aiButton.click();
    await page.waitForTimeout(500);

    // Panel should be floating, not blocking canvas
    const canvas = page.locator('[data-canvas-area="true"]');
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox?.width).toBeGreaterThan(400);
  });

  test('3. Journey: Search library assets', async ({ page }) => {
    // Acceptance: Designer can search library
    const searchInput = page.getByPlaceholder(/search library/i);
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();

    // Can type in search
    await searchInput.fill('test');
  });

  test('4. Journey: Use drawing tools', async ({ page }) => {
    // Acceptance: Designer can access all tools
    const penTool = page.getByRole('button', { name: /pen/i });
    const rectangleTool = page.getByRole('button', { name: /rectangle/i });
    const ellipseTool = page.getByRole('button', { name: /ellipse/i });

    await expect(penTool).toBeVisible();
    await expect(rectangleTool).toBeVisible();
    await expect(ellipseTool).toBeVisible();
  });

  test('5. Journey: Canvas has adequate space', async ({ page }) => {
    // Acceptance: Designer has room to work
    const canvas = page.locator('[data-canvas-area="true"]');
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    expect(box?.height).toBeGreaterThan(400);
    expect(box?.width).toBeGreaterThan(400);
  });
});
