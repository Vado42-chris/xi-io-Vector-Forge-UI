/**
 * Test Generator Panel Component
 * Visual interface to generate test files
 * 
 * Accessibility: Screen reader support, keyboard navigation, clear labels
 * Design: File browser with checkboxes, test options, preview
 * 
 * #hashtag: test-generation automation accessibility
 */

import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { useFileSystem } from '../hooks/useFileSystem';
import { FileSystemEntry } from '../services/fileSystemClient';
import { testGeneratorService } from '../services/testGeneratorService';
import type { TestType, TestOptions } from '../services/testGeneratorService';

interface TestGeneratorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestGeneratorPanel: React.FC<TestGeneratorPanelProps> = ({ isOpen, onClose }) => {
  const [currentPath, setCurrentPath] = useState<string>('.');
  const [entries, setEntries] = useState<FileSystemEntry[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [testType, setTestType] = useState<TestType>('unit');
  const [options, setOptions] = useState<TestOptions>({
    includeMocks: true,
    includeSnapshots: false,
    includeSetup: true,
    includeTeardown: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  const fileSystem = useFileSystem();

  React.useEffect(() => {
    if (isOpen) {
      loadDirectory(currentPath);
    }
  }, [isOpen, currentPath]);

  const loadDirectory = async (path: string) => {
    try {
      const dirEntries = await fileSystem.listDirectory(path);
      // Filter to show only TypeScript/JavaScript files
      const codeFiles = dirEntries.filter(
        entry => entry.type === 'file' && 
        (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.jsx'))
      );
      setEntries(codeFiles);
    } catch (err) {
      console.error('Failed to load directory:', err);
    }
  };

  const toggleFileSelection = (path: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(path)) {
      newSelection.delete(path);
    } else {
      newSelection.add(path);
    }
    setSelectedFiles(newSelection);
  };

  const toggleOption = (option: keyof TestOptions) => {
    setOptions({ ...options, [option]: !options[option] });
  };

  const generateTestPreview = (fileName: string): string => {
    const baseName = fileName.replace(/\.(ts|tsx|js|jsx)$/, '');
    const testFileName = `${baseName}.test.${fileName.split('.').pop()}`;
    
    let preview = `import { describe, it, expect${options.includeSetup ? ', beforeEach' : ''}${options.includeTeardown ? ', afterEach' : ''} } from '@jest/globals';\n\n`;
    
    if (options.includeMocks) {
      preview += `// Mock imports\n`;
    }
    
    preview += `describe('${baseName}', () => {\n`;
    
    if (options.includeSetup) {
      preview += `  beforeEach(() => {\n`;
      preview += `    // Setup\n`;
      preview += `  });\n\n`;
    }
    
    if (options.includeTeardown) {
      preview += `  afterEach(() => {\n`;
      preview += `    // Teardown\n`;
      preview += `  });\n\n`;
    }
    
    preview += `  it('should work correctly', () => {\n`;
    preview += `    expect(true).toBe(true);\n`;
    preview += `  });\n`;
    preview += `});\n`;
    
    return preview;
  };

  const handleGenerate = async () => {
    if (selectedFiles.size === 0) {
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const files = Array.from(selectedFiles);
      
      // Generate test files
      const results = await testGeneratorService.generateTestFiles(
        files,
        testType,
        options,
        (progressValue, currentFile) => {
          setProgress(progressValue);
        }
      );

      // Check for errors
      const errors = results.filter(r => !r.success);
      if (errors.length > 0) {
        console.error('Some test files failed to generate:', errors);
        // Could show error toast here
      }

      // Clear selection after successful generation
      if (errors.length === 0) {
        setSelectedFiles(new Set());
      }
    } catch (err) {
      console.error('Failed to generate tests:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal-backdrop flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="test-generator-title"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] rounded-lg w-[90vw] max-w-5xl h-[85vh] max-h-[700px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]" aria-hidden="true">
                science
              </span>
              <h2 id="test-generator-title" className="text-xl font-bold text-[var(--xibalba-text-000)]">
                Test Generator
              </h2>
            </div>
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Close test generator"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-100)]" aria-hidden="true" data-icon="close"></span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left Panel - File Browser */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={currentPath}
                    onChange={(e) => setCurrentPath(e.target.value)}
                    className="xibalba-input flex-1 min-h-[44px]"
                    placeholder="Path..."
                    aria-label="Current directory path"
                  />
                  <button
                    onClick={() => loadDirectory(currentPath)}
                    className="xibalba-button-secondary min-w-[100px] min-h-[44px]"
                    aria-label="Refresh directory"
                  >
                    <span className="material-symbols-outlined mr-2" aria-hidden="true" data-icon="refresh"></span>
                    Refresh
                  </button>
                </div>
                <p className="text-sm text-[var(--xibalba-text-100)]" aria-live="polite">
                  {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
                </p>
              </div>

              <div className="space-y-2">
                {entries.map((entry) => {
                  const isSelected = selectedFiles.has(entry.path);
                  return (
                    <div
                      key={entry.path}
                      className={`p-3 border-2 rounded-lg transition-all flex items-center gap-3 min-h-[60px] cursor-pointer ${
                        isSelected
                          ? 'border-[var(--xibalba-accent)] bg-[var(--xibalba-grey-100)]'
                          : 'border-[var(--xibalba-grey-100)] hover:border-[var(--xibalba-accent)]'
                      }`}
                      onClick={() => toggleFileSelection(entry.path)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleFileSelection(entry.path)}
                        className="w-5 h-5 cursor-pointer"
                        aria-label={`Select ${entry.name}`}
                      />
                      <span className="material-symbols-outlined text-[var(--xibalba-text-100)]" aria-hidden="true">
                        description
                      </span>
                      <span className="text-[var(--xibalba-text-000)] flex-1">{entry.name}</span>
                    </div>
                  );
                })}
              </div>

              {entries.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[var(--xibalba-text-100)]">No code files found</p>
                  <p className="text-sm text-[var(--xibalba-text-100)] mt-2">Try navigating to a different directory</p>
                </div>
              )}
            </div>

            {/* Right Panel - Options & Preview */}
            <div className="w-1/2 p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-4">Test Type</h3>
                <div className="space-y-3">
                  {(['unit', 'integration', 'e2e'] as TestType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTestType(type)}
                      className={`w-full p-3 border-2 rounded-lg transition-all text-left min-h-[60px] flex items-center gap-3 ${
                        testType === type
                          ? 'border-[var(--xibalba-accent)] bg-[var(--xibalba-grey-100)]'
                          : 'border-[var(--xibalba-grey-100)] hover:border-[var(--xibalba-accent)]'
                      }`}
                      aria-pressed={testType === type}
                    >
                      <span className="material-symbols-outlined text-[var(--xibalba-accent)]">
                        {type === 'unit' ? 'science' : type === 'integration' ? 'integration_instructions' : 'play_arrow'}
                      </span>
                      <div>
                        <div className="font-semibold text-[var(--xibalba-text-000)] capitalize">{type} Test</div>
                        <div className="text-sm text-[var(--xibalba-text-100)]">
                          {type === 'unit' && 'Test individual functions'}
                          {type === 'integration' && 'Test component integration'}
                          {type === 'e2e' && 'Test end-to-end flows'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-4">Options</h3>
                <div className="space-y-3">
                  {Object.entries(options).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3 p-3 bg-[var(--xibalba-grey-100)] rounded-lg min-h-[60px]">
                      <input
                        type="checkbox"
                        id={`option-${key}`}
                        checked={value}
                        onChange={() => toggleOption(key as keyof TestOptions)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <label htmlFor={`option-${key}`} className="flex-1 cursor-pointer">
                        <div className="font-semibold text-[var(--xibalba-text-000)]">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                        <div className="text-sm text-[var(--xibalba-text-100)]">
                          {key === 'includeMocks' && 'Include mock setup'}
                          {key === 'includeSnapshots' && 'Include snapshot tests'}
                          {key === 'includeSetup' && 'Include beforeEach setup'}
                          {key === 'includeTeardown' && 'Include afterEach teardown'}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {showPreview && selectedFiles.size > 0 && (
                <div>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="w-full flex items-center justify-between p-3 bg-[var(--xibalba-grey-100)] rounded-lg hover:bg-[var(--xibalba-grey-200)] transition-colors min-h-[44px] mb-4"
                    aria-expanded={showPreview}
                  >
                    <span className="font-semibold text-[var(--xibalba-text-000)]">Test Preview</span>
                    <span className="material-symbols-outlined">
                      {showPreview ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {showPreview && (
                    <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                      <pre className="text-sm font-mono text-[var(--xibalba-text-000)] overflow-x-auto">
                        <code>
                          {generateTestPreview(Array.from(selectedFiles)[0]?.split('/').pop() || 'example.ts')}
                        </code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Progress */}
              {isGenerating && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[var(--xibalba-text-000)]">Generating Tests</span>
                    <span className="text-sm text-[var(--xibalba-text-100)]">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-[var(--xibalba-grey-100)] rounded-full h-2">
                    <div
                      className="test-progress-fill"
                      style={{ '--test-progress': `${progress}%` } as React.CSSProperties}
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={selectedFiles.size === 0 || isGenerating}
                className="xibalba-button-primary w-full min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Generate test files"
              >
                <span className="material-symbols-outlined mr-2" aria-hidden="true" data-icon="science"></span>
                Generate Tests
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TestGeneratorPanel;

