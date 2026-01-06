/**
 * Phase 1 Verification Script
 * Tests Canvas visibility, Timeline rendering, Library, and Actions panels
 */

console.log('🔍 Phase 1 Verification Starting...\n');

// Wait for DOM to be ready
setTimeout(() => {
  const results = {
    canvas: false,
    timeline: false,
    library: false,
    actions: false,
    errors: []
  };

  // 1. Canvas Visibility Check
  console.log('1️⃣ Checking Canvas Visibility...');
  const canvasSelectors = [
    'svg',
    '.canvas-container',
    '.canvas-area',
    '[data-canvas-area="true"]',
    'canvas'
  ];

  let canvasFound = false;
  let canvasElement = null;

  for (const selector of canvasSelectors) {
    const el = document.querySelector(selector);
    if (el) {
      canvasElement = el;
      canvasFound = true;
      const styles = getComputedStyle(el);
      console.log(`   ✅ Found: ${selector}`);
      console.log(`      Display: ${styles.display}`);
      console.log(`      Visibility: ${styles.visibility}`);
      console.log(`      Opacity: ${styles.opacity}`);
      console.log(`      Width: ${styles.width}`);
      console.log(`      Height: ${styles.height}`);
      break;
    }
  }

  if (!canvasFound) {
    results.errors.push('Canvas element not found');
    console.log('   ❌ Canvas not found');
  } else {
    results.canvas = true;
    console.log('   ✅ Canvas is visible\n');
  }

  // 2. Timeline Check
  console.log('2️⃣ Checking Timeline...');
  const timelineSelectors = [
    '.professional-timeline',
    '.timeline',
    '[class*="timeline"]'
  ];

  let timelineFound = false;
  for (const selector of timelineSelectors) {
    const el = document.querySelector(selector);
    if (el) {
      timelineFound = true;
      const styles = getComputedStyle(el);
      console.log(`   ✅ Found: ${selector}`);
      console.log(`      Display: ${styles.display}`);
      console.log(`      Height: ${styles.height}`);
      console.log(`      Visibility: ${styles.visibility}`);
      
      // Check for timeline controls
      const controls = el.querySelector('.timeline-controls, .timeline-header');
      if (controls) {
        console.log('   ✅ Timeline controls found');
      }
      
      // Check for layers
      const layers = el.querySelectorAll('.timeline-layer, .layer-controls');
      console.log(`   ✅ Timeline layers: ${layers.length}`);
      break;
    }
  }

  if (!timelineFound) {
    results.errors.push('Timeline component not found');
    console.log('   ❌ Timeline not found');
  } else {
    results.timeline = true;
    console.log('   ✅ Timeline is visible\n');
  }

  // 3. Library Panel Check
  console.log('3️⃣ Checking Library Panel...');
  const librarySelectors = [
    '.library-panel',
    '.library',
    '[class*="library"]'
  ];

  let libraryFound = false;
  for (const selector of librarySelectors) {
    const el = document.querySelector(selector);
    if (el) {
      libraryFound = true;
      const styles = getComputedStyle(el);
      console.log(`   ✅ Found: ${selector}`);
      console.log(`      Display: ${styles.display}`);
      console.log(`      Visibility: ${styles.visibility}`);
      break;
    }
  }

  if (!libraryFound) {
    console.log('   ⚠️  Library panel not visible (may be hidden by default - press F11)');
  } else {
    results.library = true;
    console.log('   ✅ Library panel is visible\n');
  }

  // 4. Actions Panel Check
  console.log('4️⃣ Checking Actions Panel...');
  const actionsSelectors = [
    '.actions-panel',
    '.actions-editor',
    '[class*="actions"]'
  ];

  let actionsFound = false;
  for (const selector of actionsSelectors) {
    const el = document.querySelector(selector);
    if (el) {
      actionsFound = true;
      const styles = getComputedStyle(el);
      console.log(`   ✅ Found: ${selector}`);
      console.log(`      Display: ${styles.display}`);
      console.log(`      Visibility: ${styles.visibility}`);
      break;
    }
  }

  if (!actionsFound) {
    console.log('   ⚠️  Actions panel not visible (may be hidden by default - press F9)');
  } else {
    results.actions = true;
    console.log('   ✅ Actions panel is visible\n');
  }

  // 5. Console Errors Check
  console.log('5️⃣ Checking for Console Errors...');
  const originalError = console.error;
  const errors = [];
  console.error = (...args) => {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };

  // Check for React errors
  const reactErrors = errors.filter(e => 
    e.includes('React') || 
    e.includes('Error') || 
    e.includes('Warning') ||
    e.includes('Failed')
  );

  if (reactErrors.length > 0) {
    console.log(`   ⚠️  Found ${reactErrors.length} potential errors:`);
    reactErrors.slice(0, 5).forEach((err, i) => {
      console.log(`      ${i + 1}. ${err.substring(0, 100)}...`);
    });
    results.errors.push(...reactErrors);
  } else {
    console.log('   ✅ No critical errors detected\n');
  }

  // Summary
  console.log('\n📊 VERIFICATION SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`Canvas:        ${results.canvas ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Timeline:      ${results.timeline ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Library:       ${results.library ? '✅ PASS' : '⚠️  HIDDEN (F11)'}`);
  console.log(`Actions:       ${results.actions ? '✅ PASS' : '⚠️  HIDDEN (F9)'}`);
  console.log(`Errors:        ${results.errors.length === 0 ? '✅ NONE' : `❌ ${results.errors.length}`}`);
  console.log('═══════════════════════════════════════\n');

  // Return results for programmatic access
  window.__phase1VerificationResults = results;
  
  return results;
}, 2000);

