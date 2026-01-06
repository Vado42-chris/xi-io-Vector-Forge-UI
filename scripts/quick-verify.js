#!/usr/bin/env node
/**
 * Quick verification script - runs in seconds
 * Checks all hotfix files and integration without browser
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Quick Hotfix Verification\n');

let errors = 0;
let checks = 0;

function checkFile(filePath, description) {
  checks++;
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description} - MISSING`);
    errors++;
    return false;
  }
}

function checkImport(filePath, importText, description) {
  checks++;
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(importText)) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description} - NOT FOUND`);
    errors++;
    return false;
  }
}

// Check files
console.log('\n📁 Files:');
checkFile('styles/emergency-canvas-fix.css', 'Emergency CSS file');
checkFile('components/SaveLoadButtons.tsx', 'SaveLoadButtons component');
checkFile('components/ExportButton.tsx', 'ExportButton component');
checkFile('utils/projectStorage.ts', 'projectStorage utility');
checkFile('utils/exportSvg.ts', 'exportSvg utility');

// Check imports
console.log('\n🔗 Integration:');
checkImport('index.tsx', 'emergency-canvas-fix.css', 'CSS imported in index.tsx');
checkImport('App.hardened.tsx', 'SaveLoadButtons', 'SaveLoadButtons imported');
checkImport('App.hardened.tsx', 'ExportButton', 'ExportButton imported');
checkImport('App.hardened.tsx', '<SaveLoadButtons', 'SaveLoadButtons rendered');
checkImport('App.hardened.tsx', '<ExportButton', 'ExportButton rendered');

// Check component code
console.log('\n💻 Component Code:');
const saveLoadContent = fs.readFileSync('components/SaveLoadButtons.tsx', 'utf8');
const exportContent = fs.readFileSync('components/ExportButton.tsx', 'utf8');

checks++;
if (saveLoadContent.includes('saveProject') && saveLoadContent.includes('loadProject')) {
  console.log('✅ SaveLoadButtons uses correct utilities');
} else {
  console.log('❌ SaveLoadButtons missing utility imports');
  errors++;
}

checks++;
if (exportContent.includes('exportSVG')) {
  console.log('✅ ExportButton uses exportSVG utility');
} else {
  console.log('❌ ExportButton missing exportSVG import');
  errors++;
}

// Summary
console.log(`\n📊 Summary: ${checks - errors}/${checks} checks passed`);
if (errors === 0) {
  console.log('✅ All checks passed! Hotfix is ready.');
  process.exit(0);
} else {
  console.log(`❌ ${errors} check(s) failed. Fix issues before testing.`);
  process.exit(1);
}

