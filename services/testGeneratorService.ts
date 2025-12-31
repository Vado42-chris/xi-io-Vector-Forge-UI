/**
 * Test Generator Service
 * Backend service for generating test files
 * 
 * #hashtag: test-generation service
 */

import { FileSystemClient } from './fileSystemClient';

export type TestType = 'unit' | 'integration' | 'e2e';

export interface TestOptions {
  includeMocks: boolean;
  includeSnapshots: boolean;
  includeSetup: boolean;
  includeTeardown: boolean;
}

export interface TestGenerationResult {
  success: boolean;
  file: string;
  testFile: string;
  error?: string;
}

class TestGeneratorService {
  private fileSystem: FileSystemClient;

  constructor() {
    this.fileSystem = new FileSystemClient();
  }

  /**
   * Generate test file content
   */
  private generateTestContent(
    sourceFile: string,
    sourceContent: string,
    testType: TestType,
    options: TestOptions
  ): string {
    const baseName = sourceFile.replace(/\.(ts|tsx|js|jsx)$/, '');
    const ext = sourceFile.split('.').pop() || 'ts';
    
    let content = '';
    
    // Imports based on test type
    if (testType === 'unit' || testType === 'integration') {
      content += `import { describe, it, expect`;
      if (options.includeSetup) content += ', beforeEach';
      if (options.includeTeardown) content += ', afterEach';
      content += ` } from '@jest/globals';\n\n`;
    } else if (testType === 'e2e') {
      content += `import { test, expect } from '@playwright/test';\n\n`;
    }
    
    // Import the source file (only if not e2e)
    const importPath = sourceFile.replace(/\.(ts|tsx|js|jsx)$/, '');
    if (testType !== 'e2e') {
      const exports = this.extractExports(sourceContent);
      if (exports && exports !== '*') {
        content += `import { ${exports} } from './${importPath}';\n\n`;
      } else {
        content += `import * from './${importPath}';\n\n`;
      }
    }
    
    // Mocks
    if (options.includeMocks && (testType === 'unit' || testType === 'integration')) {
      content += `// Mock setup\n`;
      content += `jest.mock('./${importPath}');\n\n`;
    }
    
    // Test suite
    if (testType === 'e2e') {
      content += `test.describe('${baseName} E2E', () => {\n`;
    } else {
      content += `describe('${baseName}', () => {\n`;
    }
    
    // Setup
    if (options.includeSetup && testType !== 'e2e') {
      content += `  beforeEach(() => {\n`;
      content += `    // Setup before each test\n`;
      content += `  });\n\n`;
    }
    
    // Teardown
    if (options.includeTeardown && testType !== 'e2e') {
      content += `  afterEach(() => {\n`;
      content += `    // Cleanup after each test\n`;
      content += `  });\n\n`;
    }
    
    // Test cases
    if (testType === 'e2e') {
      content += `  test('should work correctly', async ({ page }) => {\n`;
      content += `    // E2E test implementation\n`;
      content += `    await expect(page).toBeTruthy();\n`;
      content += `  });\n`;
    } else {
      content += `  it('should work correctly', () => {\n`;
      content += `    // Test implementation\n`;
      content += `    expect(true).toBe(true);\n`;
      content += `  });\n`;
    }
    
    // Snapshots
    if (options.includeSnapshots && testType === 'unit') {
      content += `\n  it('should match snapshot', () => {\n`;
      content += `    const result = {}; // Replace with actual result\n`;
      content += `    expect(result).toMatchSnapshot();\n`;
      content += `  });\n`;
    }
    
    content += `});\n`;
    
    return content;
  }

  /**
   * Extract exported names from source file
   */
  private extractExports(sourceContent: string): string {
    // Simple extraction - look for export statements
    const exportMatches = sourceContent.match(/export\s+(?:default\s+)?(?:function|class|const|let|var)\s+(\w+)/g);
    if (exportMatches && exportMatches.length > 0) {
      const names = exportMatches.map(m => {
        const match = m.match(/(\w+)\s*[;=({]/);
        return match ? match[1] : '';
      }).filter(Boolean);
      return names.join(', ') || '*';
    }
    
    // Fallback to default export
    if (sourceContent.includes('export default')) {
      return 'default';
    }
    
    return '*';
  }

  /**
   * Generate test file name
   */
  private getTestFileName(sourceFile: string, testType: TestType): string {
    const baseName = sourceFile.replace(/\.(ts|tsx|js|jsx)$/, '');
    const ext = sourceFile.split('.').pop() || 'ts';
    
    if (testType === 'e2e') {
      return `${baseName}.e2e.${ext}`;
    } else if (testType === 'integration') {
      return `${baseName}.integration.${ext}`;
    } else {
      return `${baseName}.test.${ext}`;
    }
  }

  /**
   * Generate test file for a source file
   */
  async generateTestFile(
    sourceFile: string,
    testType: TestType,
    options: TestOptions,
    onProgress?: (progress: number, message: string) => void
  ): Promise<TestGenerationResult> {
    try {
      onProgress?.(10, `Reading source file: ${sourceFile}`);
      
      // Read source file
      const sourceContent = await this.fileSystem.readFile(sourceFile);
      
      onProgress?.(30, `Analyzing source file...`);
      
      // Generate test content
      const testContent = this.generateTestContent(sourceFile, sourceContent, testType, options);
      
      onProgress?.(60, `Generating test file...`);
      
      // Determine test file path
      const sourceDir = sourceFile.split('/').slice(0, -1).join('/');
      const testFileName = this.getTestFileName(sourceFile.split('/').pop() || '', testType);
      const testFilePath = `${sourceDir}/${testFileName}`;
      
      // Write test file
      await this.fileSystem.writeFile(testFilePath, testContent);
      
      onProgress?.(100, `Test file created: ${testFilePath}`);
      
      return {
        success: true,
        file: sourceFile,
        testFile: testFilePath,
      };
    } catch (error) {
      return {
        success: false,
        file: sourceFile,
        testFile: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate test files for multiple source files
   */
  async generateTestFiles(
    sourceFiles: string[],
    testType: TestType,
    options: TestOptions,
    onProgress?: (progress: number, currentFile: string) => void
  ): Promise<TestGenerationResult[]> {
    const results: TestGenerationResult[] = [];
    const total = sourceFiles.length;
    
    for (let i = 0; i < sourceFiles.length; i++) {
      const file = sourceFiles[i];
      const fileProgress = (i / total) * 100;
      
      const result = await this.generateTestFile(
        file,
        testType,
        options,
        (progress, message) => {
          const overallProgress = fileProgress + (progress / total);
          onProgress?.(overallProgress, message);
        }
      );
      
      results.push(result);
    }
    
    return results;
  }
}

export const testGeneratorService = new TestGeneratorService();

