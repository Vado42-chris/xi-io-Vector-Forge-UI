import { test, expect } from '@playwright/test';

test('Hotfix: Save/Load/Export buttons render and function', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Check if Save button exists
  const saveButton = page.locator('button:has-text("💾 Save"), button:has-text("Save")').first();
  await expect(saveButton).toBeVisible({ timeout: 5000 });

  // Check if Load button exists
  const loadButton = page.locator('button:has-text("📂 Load"), button:has-text("Load")').first();
  await expect(loadButton).toBeVisible({ timeout: 5000 });

  // Check if Export button exists
  const exportButton = page.locator('button:has-text("📥 Export SVG"), button:has-text("Export")').first();
  await expect(exportButton).toBeVisible({ timeout: 5000 });

  // Test Save functionality
  await saveButton.click();
  await page.waitForTimeout(500);
  
  // Check localStorage was updated
  const savedData = await page.evaluate(() => {
    return localStorage.getItem('vectorforge:project');
  });
  
  expect(savedData).toBeTruthy();
  expect(savedData).not.toBe('null');
});

test('Hotfix: Canvas visibility check', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Check for canvas elements
  const svgExists = await page.evaluate(() => {
    return !!document.querySelector('svg');
  });
  
  const canvasViewport = page.locator('.canvas-viewport, [data-canvas-area="true"]').first();
  const canvasCount = await canvasViewport.count();
  
  // At least one canvas element should exist
  expect(svgExists || canvasCount > 0).toBeTruthy();
});
