/**
 * Developer Persona User Journey Tests
 * Simulates Dev Developer (Expert Interactive Developer)
 */

import { test, expect } from '@playwright/test';
import { getPersonaById } from './persona-definitions';

const persona = getPersonaById('developer')!;

test.describe(`Persona: ${persona.name} - ${persona.role}`, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('1. Journey: Access Actions panel quickly', async ({ page }) => {
    // Acceptance: Developer can access Actions panel via Inspector
    const actionsTab = page.getByRole('button', { name: /actions/i });
    await expect(actionsTab).toBeVisible();

    // Click to open
    await actionsTab.click();
    await page.waitForTimeout(500);

    // Panel should be visible
    const panel = page.locator('[class*="Actions"], [data-testid="actions-panel"]').first();
    await expect(panel).toBeVisible();
  });

  test('2. Journey: Use hashtag system', async ({ page }) => {
    // Acceptance: Developer can use hashtag commands
    const actionsTab = page.getByRole('button', { name: /actions/i });
    await actionsTab.click();
    await page.waitForTimeout(500);

    // Should have input for hashtag commands
    const input = page.locator('textarea, input').filter({ hasText: /#/ }).first();
    const hasInput = (await input.count()) > 0;
    expect(hasInput).toBeTruthy();
  });

  test('3. Journey: Access Dev Chat for help', async ({ page }) => {
    // Acceptance: Developer can use Dev Chat
    const devChatTab = page.getByRole('button', { name: /dev chat/i });
    await expect(devChatTab).toBeVisible();

    await devChatTab.click();
    await page.waitForTimeout(500);

    // Chat interface should be visible
    const chatInput = page.getByPlaceholder(/ask me/i);
    await expect(chatInput).toBeVisible();
  });

  test('4. Journey: Access Scripts tab', async ({ page }) => {
    // Acceptance: Developer can access Scripts
    const scriptsTab = page.getByRole('button', { name: /scripts/i });
    await expect(scriptsTab).toBeVisible();
  });

  test('5. Journey: Actions panel in Inspector group', async ({ page }) => {
    // Acceptance: Actions is part of Inspector workflow
    const inspectorTabs = page
      .locator('button')
      .filter({ hasText: /tool|object|layers|scripts|actions/i });
    const count = await inspectorTabs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
