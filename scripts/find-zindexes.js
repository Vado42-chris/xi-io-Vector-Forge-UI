#!/usr/bin/env node
/**
 * Z-Index Detection Script
 * Finds raw z-index values that should use z-stack tokens
 * 
 * #hashtag: enforcement z-index detection
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const Z_INDEX_PATTERNS = [
  /z-index:\s*(\d+)/g,           // z-index: 100
  /z-index:\s*var\([^)]+\)/g,    // z-index: var(--z-*) (allowed)
  /z-\[(\d+)\]/g,                 // Tailwind z-[100]
  /z-(\d+)/g,                     // Tailwind z-100
];

const EXCLUDE_PATTERNS = [
  /node_modules/,
  /dist/,
  /\.git/,
  /archive/,
  /z-index-layers\.css/,  // Legacy file
  /z-stack\.css/,          // Token definitions (allowed)
];

const FILE_EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js', '.css'];

function shouldCheckFile(filePath) {
  if (EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath))) {
    return false;
  }
  const ext = extname(filePath);
  return FILE_EXTENSIONS.includes(ext);
}

function findZIndexes(content, filePath) {
  const violations = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check for raw z-index numbers
    const rawZIndexMatch = line.match(/z-index:\s*(\d+)/);
    if (rawZIndexMatch) {
      const value = rawZIndexMatch[1];
      // Allow z-index: 0 (base layer)
      if (value !== '0') {
        violations.push({
          filePath,
          line: index + 1,
          column: rawZIndexMatch.index + 1,
          value,
          snippet: line.trim(),
          type: 'raw-z-index'
        });
      }
    }

    // Check for Tailwind arbitrary z-index
    const tailwindZMatch = line.match(/z-\[(\d+)\]/);
    if (tailwindZMatch) {
      violations.push({
        filePath,
        line: index + 1,
        column: tailwindZMatch.index + 1,
        value: tailwindZMatch[1],
        snippet: line.trim(),
        type: 'tailwind-arbitrary'
      });
    }
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
          const fileViolations = findZIndexes(content, fullPath);
          violations.push(...fileViolations);
        }
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }

  return violations;
}

function main() {
  console.log('🔍 Scanning for raw z-index values...\n');
  const violations = scanDirectory(projectRoot);

  if (violations.length > 0) {
    console.error(`❌ Found ${violations.length} raw z-index violation(s):\n`);
    
    // Group by file
    const byFile = {};
    violations.forEach(v => {
      if (!byFile[v.filePath]) {
        byFile[v.filePath] = [];
      }
      byFile[v.filePath].push(v);
    });

    Object.entries(byFile).forEach(([file, fileViolations]) => {
      console.error(`\n📄 ${file}:`);
      fileViolations.forEach((v, i) => {
        console.error(`  ${i + 1}. Line ${v.line}:${v.column} - ${v.type}`);
        console.error(`     Value: ${v.value}`);
        console.error(`     ${v.snippet.substring(0, 60)}...`);
      });
    });

    console.error('\n💡 Fix: Use z-stack tokens from styles/z-stack.css');
    console.error('   Example: z-index: var(--z-surface) or className="zstack-surface"');
    console.error('   See docs/ENTIRE_APP_REALITY_CHECK.md for migration guide');
    
    process.exit(1);
  } else {
    console.log('✅ No raw z-index values found. All using z-stack tokens!');
    process.exit(0);
  }
}

main();

