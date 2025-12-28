#!/usr/bin/env node
/**
 * Custom Inline Style Checker
 * Enforces "no inline styles" best practice
 * 
 * #hashtag: enforcement inline-styles best-practices
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const INLINE_STYLE_PATTERNS = [
  /style\s*=\s*\{\{/g,           // style={{...}}
  /style\s*=\s*["']/g,           // style="..." or style='...'
  /style:\s*\{/g,                 // style: { in object literals (less common)
];

const EXCLUDE_PATTERNS = [
  /node_modules/,
  /dist/,
  /\.git/,
  /\.next/,
  /build/,
  /coverage/,
];

const FILE_EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js'];

function shouldCheckFile(filePath) {
  // Check if file should be excluded
  if (EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath))) {
    return false;
  }
  
  // Check if file extension matches
  const ext = extname(filePath);
  return FILE_EXTENSIONS.includes(ext);
}

function findInlineStyles(content, filePath) {
  const violations = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    INLINE_STYLE_PATTERNS.forEach((pattern, patternIndex) => {
      const matches = [...line.matchAll(pattern)];
      matches.forEach(match => {
        // Check if it's a false positive (CSS-in-JS libraries, type definitions, etc.)
        if (
          line.includes('@types') ||
          line.includes('declare') ||
          line.includes('interface') ||
          line.includes('type ') ||
          line.trim().startsWith('//') ||
          line.trim().startsWith('*')
        ) {
          return; // Skip type definitions and comments
        }
        
        violations.push({
          file: filePath,
          line: index + 1,
          column: match.index + 1,
          content: line.trim(),
          pattern: patternIndex,
        });
      });
    });
  });
  
  return violations;
}

function scanDirectory(dir, violations = []) {
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      
      try {
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!EXCLUDE_PATTERNS.some(pattern => pattern.test(fullPath))) {
            scanDirectory(fullPath, violations);
          }
        } else if (stat.isFile() && shouldCheckFile(fullPath)) {
          const content = readFileSync(fullPath, 'utf-8');
          const fileViolations = findInlineStyles(content, fullPath);
          violations.push(...fileViolations);
        }
      } catch (error) {
        // Skip files we can't read
        continue;
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
  
  return violations;
}

function scanFile(filePath) {
  if (!shouldCheckFile(filePath)) {
    return [];
  }
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    return findInlineStyles(content, filePath);
  } catch (error) {
    // Skip files we can't read
    return [];
  }
}

function main() {
  console.log('🔍 Checking for inline styles...\n');
  
  const violations = [];
  
  // Scan components directory
  scanDirectory(join(projectRoot, 'components'), violations);
  
  // Scan specific files
  const filesToCheck = [
    'App.hardened.tsx',
    'App.tsx',
    'App.working.tsx',
    'App.staged.tsx',
    'App.minimal.tsx',
  ];
  
  filesToCheck.forEach(file => {
    const filePath = join(projectRoot, file);
    try {
      const stat = statSync(filePath);
      if (stat.isFile()) {
        const fileViolations = scanFile(filePath);
        violations.push(...fileViolations);
      }
    } catch (error) {
      // File doesn't exist, skip
    }
  });
  
  if (violations.length === 0) {
    console.log('✅ No inline styles found. All good!');
    process.exit(0);
  }
  
  console.error(`❌ Found ${violations.length} inline style violation(s):\n`);
  
  violations.forEach((violation, index) => {
    const relativePath = violation.file.replace(projectRoot + '/', '');
    console.error(`${index + 1}. ${relativePath}:${violation.line}:${violation.column}`);
    console.error(`   ${violation.content}`);
    console.error('');
  });
  
  console.error('\n💡 Fix: Use CSS classes from Xibalba design system instead of inline styles.');
  console.error('   See docs/BEST_PRACTICES.md for details.\n');
  
  process.exit(1);
}

main();

