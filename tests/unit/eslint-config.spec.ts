/**
 * ESLint Configuration Validation Tests
 * Verifies that ESLint properly handles monorepo packages and config files
 */

import { describe, it, expect } from '@jest/globals';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('ESLint Configuration', () => {
  it('should ignore .lintstagedrc.js in ignorePatterns', () => {
    const eslintrc = readFileSync(join(process.cwd(), '.eslintrc.cjs'), 'utf-8');
    expect(eslintrc).toContain('.lintstagedrc.js');
    expect(eslintrc).toMatch(/ignorePatterns.*\.lintstagedrc\.js/s);
  });

  it('should have packages/* override for monorepo support', () => {
    const eslintrc = readFileSync(join(process.cwd(), '.eslintrc.cjs'), 'utf-8');
    expect(eslintrc).toContain('packages/**/*.ts');
    expect(eslintrc).toContain('packages/**/*.tsx');
    expect(eslintrc).toMatch(/files.*packages.*tsx?/s);
  });

  it('should use root tsconfig.json for packages', () => {
    const eslintrc = readFileSync(join(process.cwd(), '.eslintrc.cjs'), 'utf-8');
    expect(eslintrc).toContain("project: './tsconfig.json'");
    expect(eslintrc).toContain('tsconfigRootDir: __dirname');
  });
});
