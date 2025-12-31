/**
 * #hashtag: file-browser
 * #purpose: Visual file browser for VectorForge
 * #provides: Browse, read, edit, create, delete files without terminal
 * #usage: Add to RightSidebar or as standalone panel
 * #related: fileSystemClient, fileSystemService
 * 
 * File Browser Component
 * Follows Xibalba standards: Error boundaries, loading states, TypeScript strict
 */

import React, { useState, useEffect } from 'react';
import { FileSystemEntry } from '../services/fileSystemClient';
import { useFileSystem } from '../hooks/useFileSystem';
import ErrorBoundary from './ErrorBoundary';

interface FileBrowserProps {
  initialPath?: string;
  onFileSelect?: (path: string) => void;
}

const FileBrowser: React.FC<FileBrowserProps> = ({ initialPath = '.', onFileSelect }) => {
  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [entries, setEntries] = useState<FileSystemEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fileSystem = useFileSystem();

  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath]);

  const loadDirectory = async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const dirEntries = await fileSystem.listDirectory(path);
      setEntries(dirEntries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load directory');
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = async (entry: FileSystemEntry) => {
    if (entry.type === 'directory') {
      setCurrentPath(entry.path);
    } else {
      setSelectedFile(entry.path);
      setLoading(true);
      try {
        const content = await fileSystem.readFile(entry.path);
        setFileContent(content);
        onFileSelect?.(entry.path);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to read file');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    try {
      await fileSystem.writeFile(selectedFile, fileContent);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save file');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    
    setLoading(true);
    try {
      const results = await fileSystem.searchFiles(searchTerm, currentPath);
      // Convert results to entries for display
      const searchEntries: FileSystemEntry[] = results.map(path => ({
        name: path.split('/').pop() || path,
        path,
        type: 'file'
      }));
      setEntries(searchEntries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="file-browser-container component-container z-component-group h-full flex flex-col bg-[var(--xibalba-bg-primary,#1a1a1a)] text-[var(--xibalba-text-primary,#ffffff)]">
        {/* Header */}
        <div className="p-3 border-b border-[var(--xibalba-bg-tertiary)]">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setCurrentPath('.')}
              className="px-2 py-1 text-xs bg-[var(--xibalba-bg-secondary)] hover:bg-[var(--xibalba-bg-hover)] rounded"
            >
              🏠 Root
            </button>
            <input
              type="text"
              value={currentPath}
              onChange={(e) => setCurrentPath(e.target.value)}
              className="flex-1 px-2 py-1 text-xs bg-[var(--xibalba-bg-secondary)] border border-[var(--xibalba-bg-tertiary)] rounded"
              placeholder="Path..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-2 py-1 text-xs bg-[var(--xibalba-bg-secondary)] border border-[var(--xibalba-bg-tertiary)] rounded"
              placeholder="Search files..."
            />
            <button
              onClick={handleSearch}
              className="px-2 py-1 text-xs bg-[var(--xibalba-bg-secondary)] hover:bg-[var(--xibalba-bg-hover)] rounded"
            >
              🔍
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* File List */}
          <div className="w-1/3 border-r border-[var(--xibalba-bg-tertiary)] overflow-y-auto">
            {loading && <div className="p-3 text-xs">Loading...</div>}
            {error && <div className="p-3 text-xs text-[var(--vectorforge-accent)]">{error}</div>}
            {!loading && !error && (
              <div className="p-2">
                {entries.map((entry) => (
                  <div
                    key={entry.path}
                    onClick={() => handleFileClick(entry)}
                    className={`p-2 mb-1 rounded cursor-pointer hover:bg-[var(--xibalba-bg-hover)] ${
                      selectedFile === entry.path ? 'bg-[var(--xibalba-bg-hover)]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{entry.type === 'directory' ? '📁' : '📄'}</span>
                      <span className="text-xs">{entry.name}</span>
                    </div>
                    {entry.size && (
                      <div className="text-sm text-[var(--xibalba-text-100)] ml-6">
                        {(entry.size / 1024).toFixed(1)} KB
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Editor */}
          <div className="flex-1 flex flex-col">
            {selectedFile && (
              <>
                <div className="p-2 border-b border-[var(--xibalba-bg-tertiary)] flex items-center justify-between">
                  <span className="text-xs">{selectedFile}</span>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 text-xs bg-[var(--xibalba-bg-secondary)] hover:bg-[var(--xibalba-bg-hover)] rounded"
                  >
                    💾 Save
                  </button>
                </div>
                <textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="flex-1 p-3 text-xs font-mono bg-[var(--xibalba-bg-primary)] text-[var(--xibalba-text-primary)] border-0 resize-none focus:outline-none"
                  spellCheck={false}
                />
              </>
            )}
            {!selectedFile && (
              <div className="flex-1 flex items-center justify-center text-[var(--xibalba-text-100)] text-sm">
                Select a file to view/edit
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default FileBrowser;

