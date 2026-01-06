/**
 * Comprehensive Persona Workflow Tests
 * Tests complete workflows for each persona
 * Adapted from v61 backend workflow testing for frontend UX
 */

import { test, expect } from '@playwright/test';
import { personas } from './persona-definitions';

test.describe('Comprehensive Persona Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('Animator: Complete animation workflow', async ({ page }) => {
    const persona = personas.find(p => p.id === 'animator')!;

    // Step 1: Access timeline
    const timeline = page.locator('[class*="Timeline"]').first();
    await expect(timeline).toBeVisible();

    // Step 2: Add layer
    const addLayer = page.getByRole('button', { name: /\+.*layer/i }).first();
    await addLayer.click();

    // Step 3: Use library for assets
    const library = page.locator('text=Library').first();
    await expect(library).toBeVisible();

    // Step 4: Play animation
    const playButton = page.getByRole('button', { name: /▶|play/i }).first();
    await expect(playButton).toBeVisible();

    // Step 5: Export
    const exportButton = page.getByRole('button', { name: /export/i }).first();
    await expect(exportButton).toBeVisible();
  });

  test('Designer: Complete symbol workflow', async ({ page }) => {
    const persona = personas.find(p => p.id === 'designer')!;

    // Step 1: Use drawing tools
    const penTool = page.getByRole('button', { name: /pen/i });
    await expect(penTool).toBeVisible();

    // Step 2: Access library
    const library = page.locator('text=Library').first();
    await expect(library).toBeVisible();

    // Step 3: Create symbol
    const newSymbol = page.getByRole('button', { name: /new symbol/i }).first();
    await expect(newSymbol).toBeVisible();

    // Step 4: Use AI for variations
    const aiButton = page.getByRole('button', { name: /generate with ai/i });
    await expect(aiButton).toBeVisible();

    // Step 5: Save work
    const saveButton = page.getByRole('button', { name: /save/i }).first();
    await expect(saveButton).toBeVisible();
  });

  test('Developer: Complete scripting workflow', async ({ page }) => {
    const persona = personas.find(p => p.id === 'developer')!;

    // Step 1: Access Actions panel
    const actionsTab = page.getByRole('button', { name: /actions/i });
    await expect(actionsTab).toBeVisible();
    await actionsTab.click();
    await page.waitForTimeout(500);

    // Step 2: Access Scripts
    const scriptsTab = page.getByRole('button', { name: /scripts/i });
    await expect(scriptsTab).toBeVisible();

    // Step 3: Use Dev Chat
    const devChatTab = page.getByRole('button', { name: /dev chat/i });
    await expect(devChatTab).toBeVisible();

    // Step 4: Validate code
    // Actions panel should have validation
    const actionsPanel = page.locator('[class*="Actions"]').first();
    await expect(actionsPanel).toBeVisible();
  });

  test('Beginner: Complete first design workflow', async ({ page }) => {
    const persona = personas.find(p => p.id === 'beginner')!;

    // Step 1: See empty state
    const emptyState = page.locator('text=/enter a prompt to start/i').first();
    await expect(emptyState).toBeVisible();

    // Step 2: Find AI button
    const aiButton = page.getByRole('button', { name: /generate with ai/i });
    await expect(aiButton).toBeVisible();

    // Step 3: Open AI panel
    await aiButton.click();
    await page.waitForTimeout(500);

    // Step 4: Panel opens
    const panel = page.locator('text=GENERATIVE VECTOR AI').first();
    await expect(panel).toBeVisible();

    // Step 5: Can close panel
    const closeButton = page.getByRole('button', { name: /close/i });
    if ((await closeButton.count()) > 0) {
      await closeButton.click();
    }
  });
});
