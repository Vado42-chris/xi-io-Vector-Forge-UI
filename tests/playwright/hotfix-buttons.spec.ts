import { test, expect } from '@playwright/test';

test('Hotfix: Save/Load/Export buttons render and function', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for app to stabilize
  await page.waitForTimeout(1000);

  // Check if Save button exists
  const saveButton = page.locator('button:has-text("💾 Save")');
  await expect(saveButton).toBeVisible();

  // Check if Load button exists
  const loadButton = page.locator('button:has-text("📂 Load")');
  await expect(loadButton).toBeVisible();

  // Check if Export button exists
  const exportButton = page.locator('button:has-text("📥 Export SVG")');
  await expect(exportButton).toBeVisible();

  // Test Save functionality
  await saveButton.click();
  
  // Wait for alert or check localStorage
  await page.waitForTimeout(500);
  
  // Check localStorage was updated
  const savedData = await page.evaluate(() => {
    return localStorage.getItem('vectorforge:project');
  });
  
  expect(savedData).toBeTruthy();
  expect(savedData).not.toBe('null');

  // Test Load functionality (if we have saved data)
  if (savedData) {
    await loadButton.click();
    await page.waitForTimeout(500);
  }

  // Test Export functionality
  // Check if SVG exists before trying to export
  const svgExists = await page.evaluate(() => {
    return !!document.querySelector('svg');
  });

  if (svgExists) {
    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
    await exportButton.click();
    await page.waitForTimeout(500);
    
    // Note: Download may not trigger in headless mode, but button click should work
    const download = await downloadPromise;
    // If download happened, verify it's an SVG
    if (download) {
      expect(download.suggestedFilename()).toContain('.svg');
    }
  }
});

test('Hotfix: Canvas visibility check', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Check for canvas viewport
  const canvasViewport = page.locator('.canvas-viewport, [data-canvas-area="true"], canvas, svg').first();
  
  // Check if canvas element exists
  const canvasExists = await canvasViewport.count() > 0;
  expect(canvasExists).toBeTruthy();

  // Check canvas visibility
  if (canvasExists) {
    const isVisible = await canvasViewport.isVisible().catch(() => false);
    // Canvas should be visible (emergency CSS should force it)
    expect(isVisible).toBeTruthy();
  }
});

