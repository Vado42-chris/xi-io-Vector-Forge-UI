#!/usr/bin/env node
/**
 * Fast verification - no browser, just file/import checks
 * Runs in <1 second
 */

const fs = require('fs');
const { ProgressTracker } = require('./test-progress');

const tracker = new ProgressTracker(10);

function checkFile(path, name) {
  tracker.update(`Checking ${name}...`, 'working');
  const exists = fs.existsSync(path);
  if (!exists) {
    tracker.update(`${name} MISSING`, 'error');
    return false;
  }
  tracker.update(`${name} found`, 'success');
  return true;
}

function checkImport(file, search, name) {
  tracker.update(`Checking ${name}...`, 'working');
  const content = fs.readFileSync(file, 'utf8');
  const found = content.includes(search);
  if (!found) {
    tracker.update(`${name} NOT FOUND`, 'error');
    return false;
  }
  tracker.update(`${name} found`, 'success');
  return true;
}

console.log('\n🔍 Fast Hotfix Verification\n');

let passed = 0;
let failed = 0;

// Files
if (checkFile('styles/emergency-canvas-fix.css', 'CSS file')) passed++; else failed++;
if (checkFile('components/SaveLoadButtons.tsx', 'SaveLoadButtons')) passed++; else failed++;
if (checkFile('components/ExportButton.tsx', 'ExportButton')) passed++; else failed++;
if (checkFile('utils/projectStorage.ts', 'projectStorage')) passed++; else failed++;
if (checkFile('utils/exportSvg.ts', 'exportSvg')) passed++; else failed++;

// Integration
if (checkImport('index.tsx', 'emergency-canvas-fix', 'CSS import')) passed++; else failed++;
if (checkImport('App.hardened.tsx', 'import SaveLoadButtons', 'SaveLoadButtons import')) passed++; else failed++;
if (checkImport('App.hardened.tsx', 'import ExportButton', 'ExportButton import')) passed++; else failed++;
if (checkImport('App.hardened.tsx', '<SaveLoadButtons', 'SaveLoadButtons render')) passed++; else failed++;
if (checkImport('App.hardened.tsx', '<ExportButton', 'ExportButton render')) passed++; else failed++;

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);

