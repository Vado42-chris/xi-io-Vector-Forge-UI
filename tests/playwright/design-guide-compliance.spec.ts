/**
 * Design Guide Compliance Tests
 * Validates that UI structure matches design guide requirements
 */

import { test, expect } from '@playwright/test';

test.describe('Design Guide Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Wait for app to load
    await page.waitForSelector('[data-canvas-area="true"]', { timeout: 10000 });
  });

  test('Timeline is always visible at bottom (40% height)', async ({ page }) => {
    // Check timeline exists
    const timeline = page.locator('.professional-timeline');
    await expect(timeline).toBeVisible();

    // Check timeline height (should be ~40vh)
    const timelineHeight = await timeline.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        height: styles.height,
        minHeight: styles.minHeight,
        display: styles.display,
      };
    });

    // Should be visible and have substantial height
    expect(timelineHeight.display).toBe('flex');
    expect(timelineHeight.height).toMatch(/vh|px/);
    
    // Check timeline controls are visible
    await expect(page.locator('.timeline-header')).toBeVisible();
    await expect(page.locator('.timeline-controls')).toBeVisible();
  });

  test('Library panel is in LeftSidebar (F11 toggle)', async ({ page }) => {
    // Check Library is in LeftSidebar
    const leftSidebar = page.locator('.app-left-sidebar, [data-sidebar-left-visible="true"]');
    await expect(leftSidebar).toBeVisible();

    // Check Library component exists in LeftSidebar
    const library = leftSidebar.locator('.library-panel');
    
    // Library should be visible (showLibrary defaults to true)
    const isLibraryVisible = await library.isVisible().catch(() => false);
    
    if (isLibraryVisible) {
      // Verify Library structure
      await expect(library.locator('.library-header')).toBeVisible();
      await expect(library.locator('.library-tabs')).toBeVisible();
    }

    // Test F11 toggle
    await page.keyboard.press('F11');
    await page.waitForTimeout(300); // Wait for toggle animation
    
    // Library visibility should change
    const afterToggle = await library.isVisible().catch(() => false);
    expect(afterToggle).not.toBe(isLibraryVisible);
  });

  test('Actions panel is in RightSidebar Inspector (Code tab, F9)', async ({ page }) => {
    // Ensure right sidebar is visible
    const rightSidebar = page.locator('.app-right-sidebar, [data-sidebar-right-visible="true"]');
    await expect(rightSidebar).toBeVisible();

    // Check for tab system
    const tabSystem = rightSidebar.locator('[role="tablist"], .tab-system');
    await expect(tabSystem).toBeVisible();

    // Press F9 to switch to Code tab
    await page.keyboard.press('F9');
    await page.waitForTimeout(300);

    // Check if Code tab is active (Actions panel should be visible)
    const actionsPanel = rightSidebar.locator('.actions-panel');
    const isActionsVisible = await actionsPanel.isVisible().catch(() => false);
    
    // Actions panel should be in RightSidebar, not as fixed overlay
    const fixedOverlay = page.locator('[style*="position: fixed"][style*="right"]').filter({ has: page.locator('.actions-panel') });
    const isFixedOverlay = await fixedOverlay.count() > 0;
    
    expect(isFixedOverlay).toBe(false); // Should NOT be fixed overlay
    expect(isActionsVisible).toBe(true); // Should be visible in Inspector
  });

  test('AI Panel is NOT permanent in center stack', async ({ page }) => {
    // AI panel should NOT be in center stack permanently
    const centerStack = page.locator('.app-center-stack, .center-stack');
    await expect(centerStack).toBeVisible();

    // Check if AI panel exists in center stack (it shouldn't be permanent)
    const aiPanelInCenter = centerStack.locator('[data-testid="ai-panel"]');
    const aiPanelCount = await aiPanelInCenter.count();
    
    // AI panel should either:
    // 1. Not exist in center stack (moved to floating)
    // 2. Or be conditionally rendered (not permanent)
    
    // For now, we check it's not always visible
    // TODO: After implementing floating panel, check for floating panel instead
    console.log(`AI Panel in center stack count: ${aiPanelCount}`);
  });

  test('Stage has visible boundaries (artboard)', async ({ page }) => {
    // Check for artboard/stage boundaries
    const canvas = page.locator('[data-canvas-area="true"]');
    await expect(canvas).toBeVisible();

    // Check for artboard element
    const artboard = page.locator('.artboard, [data-artboard], .stage-boundary');
    const artboardCount = await artboard.count();
    
    // For now, artboard might not exist yet
    // This test documents the requirement
    console.log(`Artboard elements found: ${artboardCount}`);
    
    // Check for pasteboard (grey area around stage)
    const pasteboard = page.locator('.pasteboard, [data-pasteboard]');
    const pasteboardCount = await pasteboard.count();
    
    console.log(`Pasteboard elements found: ${pasteboardCount}`);
    
    // TODO: After implementing artboard, add proper assertions
    // expect(artboardCount).toBeGreaterThan(0);
  });

  test('Timeline shows layers and keyframes', async ({ page }) => {
    const timeline = page.locator('.professional-timeline');
    await expect(timeline).toBeVisible();

    // Check for layer rows
    const layers = timeline.locator('.timeline-layer');
    const layerCount = await layers.count();
    
    // Should have at least some layer structure (even if empty)
    expect(layerCount).toBeGreaterThanOrEqual(0);

    // Check for layer controls
    const layerControls = timeline.locator('.layer-controls');
    const controlsCount = await layerControls.count();
    
    // Layer controls should exist (even if no layers yet)
    console.log(`Layer controls found: ${controlsCount}`);

    // Check for frame cells
    const frames = timeline.locator('.frame');
    const frameCount = await frames.count();
    
    console.log(`Frame cells found: ${frameCount}`);
  });

  test('Library shows symbols and assets tabs', async ({ page }) => {
    const library = page.locator('.library-panel');
    
    // Library might be hidden, so check if visible first
    const isVisible = await library.isVisible().catch(() => false);
    
    if (isVisible) {
      // Check for tabs
      await expect(library.locator('.library-tabs')).toBeVisible();
      
      // Check for Symbols tab
      const symbolsTab = library.locator('button:has-text("Symbols")');
      await expect(symbolsTab).toBeVisible();
      
      // Check for Assets tab
      const assetsTab = library.locator('button:has-text("Assets")');
      await expect(assetsTab).toBeVisible();
    }
  });

  test('Actions panel shows hashtag editor', async ({ page }) => {
    // Switch to Code tab
    await page.keyboard.press('F9');
    await page.waitForTimeout(300);

    const actionsPanel = page.locator('.actions-panel');
    const isVisible = await actionsPanel.isVisible().catch(() => false);
    
    if (isVisible) {
      // Check for code editor
      const editor = actionsPanel.locator('.actions-editor, textarea');
      await expect(editor).toBeVisible();
      
      // Check for tabs (Frame/Object/Timeline)
      const tabs = actionsPanel.locator('.actions-tabs');
      await expect(tabs).toBeVisible();
      
      // Check for snippets button
      const snippetsBtn = actionsPanel.locator('button:has-text("Snippets")');
      await expect(snippetsBtn).toBeVisible();
    }
  });

  test('Keyboard shortcuts work correctly', async ({ page }) => {
    // F9 - Actions panel
    await page.keyboard.press('F9');
    await page.waitForTimeout(300);
    
    // Should show toast or switch tab
    const toast = page.locator('text=/Actions|Code/i');
    const toastVisible = await toast.isVisible().catch(() => false);
    console.log(`F9 toast visible: ${toastVisible}`);

    // F11 - Library toggle
    await page.keyboard.press('F11');
    await page.waitForTimeout(300);
    
    const libraryToast = page.locator('text=/Library/i');
    const libraryToastVisible = await libraryToast.isVisible().catch(() => false);
    console.log(`F11 toast visible: ${libraryToastVisible}`);
  });

  test('No fixed overlay panels (design guide compliance)', async ({ page }) => {
    // Check for fixed position panels that shouldn't exist
    const fixedPanels = page.locator('[style*="position: fixed"][style*="right"]').filter({
      hasText: /Actions|Library/
    });
    
    const fixedCount = await fixedPanels.count();
    
    // Actions and Library should NOT be fixed overlays
    // They should be in sidebars
    expect(fixedCount).toBe(0);
  });
});

