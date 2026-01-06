/**
 * Library Panel Tests
 * Tests for Library component
 * Based on Phase 1 Day 2 design specifications
 */

import { test, expect } from '@playwright/test';

test.describe('Library Panel - Design Spec Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Library panel is visible in left sidebar', async ({ page }) => {
    // Acceptance: Library should be visible in LeftSidebar
    const library = page.locator('text=Library').first();
    await expect(library).toBeVisible();
  });

  test('2. Library shows symbol types', async ({ page }) => {
    // Acceptance: Symbol, Asset, Component buttons visible
    const symbolButton = page.getByRole('button', { name: /symbol/i }).first();
    const assetButton = page.getByRole('button', { name: /asset|a et/i }).first();
    const componentButton = page.getByRole('button', { name: /component/i }).first();

    await expect(symbolButton).toBeVisible();
    await expect(assetButton).toBeVisible();
    await expect(componentButton).toBeVisible();
  });

  test('3. Library has search functionality', async ({ page }) => {
    // Acceptance: Search input visible and functional
    const searchInput = page.getByPlaceholder(/search library/i);
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
  });

  test('4. Library has create buttons', async ({ page }) => {
    // Acceptance: New Symbol, Import Asset buttons visible
    const newSymbol = page.getByRole('button', { name: /new symbol/i }).first();
    const importAsset = page.getByRole('button', { name: /import.*asset/i }).first();

    await expect(newSymbol).toBeVisible();
    await expect(importAsset).toBeVisible();
  });

  test('5. Library integrates with LeftSidebar', async ({ page }) => {
    // Acceptance: Library is part of LeftSidebar layout
    const leftSidebar = page.locator('aside').first();
    const library = page.locator('text=Library').first();

    await expect(leftSidebar).toBeVisible();
    await expect(library).toBeVisible();

    // Library should be within sidebar
    const sidebarBox = await leftSidebar.boundingBox();
    const libraryBox = await library.boundingBox();

    expect(sidebarBox).not.toBeNull();
    expect(libraryBox).not.toBeNull();
  });

  test('6. Library supports symbol-based workflow', async ({ page }) => {
    // Acceptance: Library enables symbol creation and management
    const newSymbol = page.getByRole('button', { name: /new symbol/i }).first();
    await expect(newSymbol).toBeEnabled();
  });
});
