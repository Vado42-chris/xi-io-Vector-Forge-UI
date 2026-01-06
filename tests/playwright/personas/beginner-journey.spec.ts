/**
 * Beginner Persona User Journey Tests
 * Simulates New User (First-time User)
 */

import { test, expect } from '@playwright/test';
import { getPersonaById } from './persona-definitions';

const persona = getPersonaById('beginner')!;

test.describe(`Persona: ${persona.name} - ${persona.role}`, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Journey: See clear empty state', async ({ page }) => {
    // Acceptance: Beginner sees helpful empty state
    const emptyState = page.locator('text=/enter a prompt to start/i').first();
    await expect(emptyState).toBeVisible();
  });

  test('2. Journey: Find AI generation easily', async ({ page }) => {
    // Acceptance: Beginner can find AI button
    const aiButton = page.getByRole('button', { name: /generate with ai/i });
    await expect(aiButton).toBeVisible();

    // Button should be clear and accessible
    const buttonText = await aiButton.textContent();
    expect(buttonText?.toLowerCase()).toContain('ai');
  });

  test('3. Journey: Use AI to create first design', async ({ page }) => {
    // Acceptance: Beginner can generate first design
    const aiButton = page.getByRole('button', { name: /generate with ai/i });
    await aiButton.click();
    await page.waitForTimeout(500);

    // Panel should open
    const panel = page.locator('text=GENERATIVE VECTOR AI').first();
    await expect(panel).toBeVisible();

    // Should have prompt input
    const promptInput = page.getByPlaceholder(/describe.*vector/i);
    await expect(promptInput).toBeVisible();
  });

  test('4. Journey: Access help when needed', async ({ page }) => {
    // Acceptance: Beginner can find help
    const helpButton = page.getByRole('button', { name: /help/i });
    await expect(helpButton).toBeVisible();
  });

  test('5. Journey: Interface not overwhelming', async ({ page }) => {
    // Acceptance: Interface is organized and not cluttered
    const canvas = page.locator('[data-canvas-area="true"]');
    await expect(canvas).toBeVisible();

    // Should have clear structure
    const leftSidebar = page.locator('aside').first();
    const rightSidebar = page.locator('aside').last();

    await expect(leftSidebar).toBeVisible();
    await expect(rightSidebar).toBeVisible();
  });
});
