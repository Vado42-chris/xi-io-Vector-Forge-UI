/**
 * Keyboard Shortcuts Panel Component
 * Visual reference for all keyboard shortcuts
 * 
 * Accessibility: Screen reader support, keyboard navigation, practice mode
 * Design: Grouped by category, searchable, customizable
 * 
 * #hashtag: keyboard-shortcuts accessibility
 */

import React, { useState, useMemo, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface KeyboardShortcutsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  id: string;
  label: string;
  keys: string[];
  category: string;
  description?: string;
}

const KeyboardShortcutsPanel: React.FC<KeyboardShortcutsPanelProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [practiceMode, setPracticeMode] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const shortcuts: Shortcut[] = [
    // File
    { id: 'file-new', label: 'New', keys: ['Ctrl', 'N'], category: 'File', description: 'Create new document' },
    { id: 'file-open', label: 'Open', keys: ['Ctrl', 'O'], category: 'File', description: 'Open existing file' },
    { id: 'file-save', label: 'Save', keys: ['Ctrl', 'S'], category: 'File', description: 'Save current document' },
    { id: 'file-save-as', label: 'Save As', keys: ['Ctrl', 'Shift', 'S'], category: 'File', description: 'Save with new name' },
    
    // Edit
    { id: 'edit-undo', label: 'Undo', keys: ['Ctrl', 'Z'], category: 'Edit', description: 'Undo last action' },
    { id: 'edit-redo', label: 'Redo', keys: ['Ctrl', 'Shift', 'Z'], category: 'Edit', description: 'Redo last undone action' },
    { id: 'edit-cut', label: 'Cut', keys: ['Ctrl', 'X'], category: 'Edit', description: 'Cut selection' },
    { id: 'edit-copy', label: 'Copy', keys: ['Ctrl', 'C'], category: 'Edit', description: 'Copy selection' },
    { id: 'edit-paste', label: 'Paste', keys: ['Ctrl', 'V'], category: 'Edit', description: 'Paste from clipboard' },
    { id: 'edit-select-all', label: 'Select All', keys: ['Ctrl', 'A'], category: 'Edit', description: 'Select all objects' },
    
    // View
    { id: 'view-zoom-in', label: 'Zoom In', keys: ['Ctrl', '+'], category: 'View', description: 'Zoom in' },
    { id: 'view-zoom-out', label: 'Zoom Out', keys: ['Ctrl', '-'], category: 'View', description: 'Zoom out' },
    { id: 'view-fit', label: 'Fit to Screen', keys: ['Ctrl', '0'], category: 'View', description: 'Fit canvas to screen' },
    { id: 'view-actual', label: 'Actual Size', keys: ['Ctrl', '1'], category: 'View', description: 'View at 100%' },
    
    // Tools
    { id: 'tool-select', label: 'Select Tool', keys: ['V'], category: 'Tools', description: 'Switch to select tool' },
    { id: 'tool-pen', label: 'Pen Tool', keys: ['P'], category: 'Tools', description: 'Switch to pen tool' },
    { id: 'tool-rectangle', label: 'Rectangle Tool', keys: ['M'], category: 'Tools', description: 'Switch to rectangle tool' },
    { id: 'tool-ellipse', label: 'Ellipse Tool', keys: ['L'], category: 'Tools', description: 'Switch to ellipse tool' },
    { id: 'tool-text', label: 'Text Tool', keys: ['T'], category: 'Tools', description: 'Switch to text tool' },
    
    // Object
    { id: 'object-group', label: 'Group', keys: ['Ctrl', 'G'], category: 'Object', description: 'Group selected objects' },
    { id: 'object-ungroup', label: 'Ungroup', keys: ['Ctrl', 'Shift', 'G'], category: 'Object', description: 'Ungroup selected objects' },
    { id: 'object-lock', label: 'Lock', keys: ['Ctrl', 'L'], category: 'Object', description: 'Lock selected objects' },
    { id: 'object-unlock', label: 'Unlock', keys: ['Ctrl', 'Shift', 'L'], category: 'Object', description: 'Unlock selected objects' },
    
    // UI Automation
    { id: 'open-keyboard-shortcuts', label: 'Keyboard Shortcuts', keys: ['Ctrl', 'K'], category: 'UI', description: 'Open keyboard shortcuts panel' },
    { id: 'open-project-wizard', label: 'Project Wizard', keys: ['Ctrl', 'Shift', 'P'], category: 'UI', description: 'Open project setup wizard' },
    { id: 'open-template-library', label: 'Template Library', keys: ['Ctrl', 'Shift', 'T'], category: 'UI', description: 'Open template library' },
  ];

  const categories = ['all', ...Array.from(new Set(shortcuts.map(s => s.category)))];

  const filteredShortcuts = useMemo(() => {
    return shortcuts.filter(shortcut => {
      const matchesSearch = 
        shortcut.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shortcut.keys.some(key => key.toLowerCase().includes(searchTerm.toLowerCase())) ||
        shortcut.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || shortcut.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const groupedShortcuts = useMemo(() => {
    const groups: Record<string, Shortcut[]> = {};
    filteredShortcuts.forEach(shortcut => {
      if (!groups[shortcut.category]) {
        groups[shortcut.category] = [];
      }
      groups[shortcut.category].push(shortcut);
    });
    return groups;
  }, [filteredShortcuts]);

  useEffect(() => {
    if (practiceMode) {
      const handleKeyPress = (e: KeyboardEvent) => {
        setPressedKey(e.key);
        setTimeout(() => setPressedKey(null), 500);
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [practiceMode]);

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal-backdrop flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg w-[90vw] max-w-4xl h-[85vh] max-h-[700px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]" aria-hidden="true">
                keyboard
              </span>
              <h2 id="shortcuts-title" className="text-xl font-bold text-[var(--xibalba-text-000)]">
                Keyboard Shortcuts
              </h2>
            </div>
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Close keyboard shortcuts"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-100)]">close</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-white/10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--xibalba-text-100)]" aria-hidden="true">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="xibalba-input w-full pl-10 min-h-[44px]"
                  placeholder="Search shortcuts..."
                  aria-label="Search keyboard shortcuts"
                />
              </div>
              <button
                onClick={() => setPracticeMode(!practiceMode)}
                className={`xibalba-button-secondary min-h-[44px] ${practiceMode ? 'bg-[var(--xibalba-accent)] text-white' : ''}`}
                aria-pressed={practiceMode}
              >
                <span className="material-symbols-outlined mr-2" aria-hidden="true">touch_app</span>
                Practice Mode
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] capitalize ${
                    selectedCategory === category
                      ? 'bg-[var(--xibalba-accent)] text-white'
                      : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-grey-200)]'
                  }`}
                  aria-pressed={selectedCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-4">{category}</h3>
                <div className="space-y-3">
                  {categoryShortcuts.map((shortcut) => (
                    <div
                      key={shortcut.id}
                      className="p-4 border border-[var(--xibalba-grey-100)] rounded-lg hover:border-[var(--xibalba-accent)] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-[var(--xibalba-text-000)] mb-1">{shortcut.label}</div>
                          {shortcut.description && (
                            <div className="text-sm text-[var(--xibalba-text-100)]">{shortcut.description}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, index) => (
                            <React.Fragment key={index}>
                              <kbd
                                className={`px-3 py-1 bg-[var(--xibalba-grey-100)] border border-[var(--xibalba-grey-200)] rounded text-sm font-mono min-w-[44px] min-h-[32px] flex items-center justify-center ${
                                  practiceMode && pressedKey === key ? 'bg-[var(--xibalba-accent)] text-white' : ''
                                }`}
                                aria-label={`Key: ${key}`}
                              >
                                {key}
                              </kbd>
                              {index < shortcut.keys.length - 1 && (
                                <span className="text-[var(--xibalba-text-100)] mx-1" aria-hidden="true">+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredShortcuts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[var(--xibalba-text-100)]">No shortcuts found</p>
                <p className="text-sm text-[var(--xibalba-text-100)] mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default KeyboardShortcutsPanel;

