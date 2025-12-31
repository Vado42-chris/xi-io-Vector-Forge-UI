#!/usr/bin/env node
/**
 * Custom Inline Style Checker
 * Enforces "no inline styles" best practice
 * 
 * Allows CSS custom properties (CSS variables) for dynamic values:
 * - style={{ '--progress-value': `${progress}%`, width: 'var(--progress-value)' } as React.CSSProperties}
 * 
 * This is acceptable per design system audit because:
 * 1. CSS custom properties are the recommended way to handle dynamic values
 * 2. They maintain separation of concerns (CSS handles styling)
 * 3. They're more performant than inline styles with computed values
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
        
        // For multi-line style objects, check surrounding lines for CSS custom properties
        let styleBlock = line;
        if (line.includes('style={{') && !line.includes('}}') && !line.includes('} as React.CSSProperties')) {
          // Multi-line style object - collect the block (up to 15 lines to catch the full object)
          let blockEnd = index;
          let braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
          for (let i = index + 1; i < Math.min(index + 15, lines.length); i++) {
            braceCount += (lines[i].match(/\{/g) || []).length - (lines[i].match(/\}/g) || []).length;
            if (braceCount <= 0 || lines[i].includes('} as React.CSSProperties')) {
              blockEnd = i;
              break;
            }
          }
          styleBlock = lines.slice(index, blockEnd + 1).join('\n');
        }
        
        // Allow CSS custom properties (CSS variables) for dynamic values
        // This is acceptable per design system audit
        const hasCSSProperty = /--[\w-]+/.test(styleBlock) && (
          styleBlock.includes('as React.CSSProperties') || 
          styleBlock.includes('CSSProperties') ||
          styleBlock.includes('var(--') // Uses CSS variable reference
        );
        
        if (hasCSSProperty) {
          return; // Skip CSS custom properties with type assertion or variable usage
        }
        
        // Allow minimal inline styles for dynamic values that can't be CSS classes
        // Only if they use CSS custom properties
        if (styleBlock.includes('var(--') && styleBlock.includes('style={{')) {
          return; // Skip styles that use CSS variables
        }
        
        // Skip if it's just a type assertion with CSS properties
        if (styleBlock.includes('as React.CSSProperties') && /--[\w-]+/.test(styleBlock)) {
          return;
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
  
  // Group violations by file for better reporting
  const violationsByFile = {};
  violations.forEach(violation => {
    const relativePath = violation.file.replace(projectRoot + '/', '');
    if (!violationsByFile[relativePath]) {
      violationsByFile[relativePath] = [];
    }
    violationsByFile[relativePath].push(violation);
  });
  
  console.error(`❌ Found ${violations.length} inline style violation(s) in ${Object.keys(violationsByFile).length} file(s):\n`);
  
  // Report by file
  Object.entries(violationsByFile).forEach(([file, fileViolations]) => {
    console.error(`${file} (${fileViolations.length} violation${fileViolations.length > 1 ? 's' : ''}):`);
    fileViolations.forEach((violation, index) => {
      console.error(`  ${index + 1}. Line ${violation.line}:${violation.column}`);
      console.error(`     ${violation.content.substring(0, 80)}${violation.content.length > 80 ? '...' : ''}`);
    });
    console.error('');
  });
  
  console.error('💡 Fix: Use CSS classes from Xibalba design system instead of inline styles.');
  console.error('   For dynamic values, use CSS custom properties:');
  console.error('   style={{ \'--progress-value\': `${progress}%`, width: \'var(--progress-value)\' } as React.CSSProperties}');
  console.error('   See docs/BEST_PRACTICES.md for details.\n');
  
  process.exit(1);
}

main();

