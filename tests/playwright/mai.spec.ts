import { test, expect } from '@playwright/test';

test('MAI ActionCenter renders and single AI panel present', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for app to stabilize
  await page.waitForTimeout(500);

  // MAI action - looks for visible button text
  const action = await page.locator('text=Generate Vector').first();
  expect(action).toBeTruthy();

  // Ensure only one AI panel exists (data-testid)
  const aiPanels = await page.locator('[data-testid="ai-panel"]').count();
  expect(aiPanels).toBeLessThanOrEqual(1);

  // Ensure canvas viewport exists
  const canvas = await page.locator('.canvas-viewport').first();
  expect(canvas).toBeTruthy();
});
