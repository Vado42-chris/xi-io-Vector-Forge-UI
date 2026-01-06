import { test, expect } from '@playwright/test';

test('Diagnostic: Check what is actually rendering', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(5000); // Wait longer for app to load

  // Check if root element exists
  const root = await page.locator('#root').count();
  console.log('Root element count:', root);

  // Check if any buttons exist
  const allButtons = await page.locator('button').count();
  console.log('Total buttons found:', allButtons);

  // Get all button text
  const buttonTexts = await page.locator('button').allTextContents();
  console.log('Button texts:', buttonTexts.slice(0, 20));

  // Check for SaveLoadButtons component
  const saveLoadDiv = await page.locator('div:has-text("💾 Save")').count();
  console.log('Save button divs found:', saveLoadDiv);

  // Check for canvas area
  const canvasArea = await page.locator('[data-canvas-area="true"]').count();
  console.log('Canvas areas found:', canvasArea);

  // Check for canvas viewport
  const viewport = await page.locator('.canvas-viewport').count();
  console.log('Canvas viewports found:', viewport);

  // Take screenshot
  await page.screenshot({ path: 'test-results/diagnostic-screenshot.png', fullPage: true });

  // Get page HTML (first 5000 chars)
  const html = await page.content();
  console.log('Page HTML (first 5000 chars):', html.substring(0, 5000));
});

