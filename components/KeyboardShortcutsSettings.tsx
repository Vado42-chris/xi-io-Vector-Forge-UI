/**
 * Keyboard Shortcuts Settings Component
 * #hashtag: #keyboard-shortcuts #settings #customization
 * 
 * UI for viewing and customizing keyboard shortcuts
 */

import React, { useState, useEffect } from 'react';
import { keyboardShortcutsService, DEFAULT_SHORTCUTS, KeyboardShortcut } from '../services/keyboardShortcuts';

interface KeyboardShortcutsSettingsProps {
  onClose?: () => void;
}

const KeyboardShortcutsSettings: React.FC<KeyboardShortcutsSettingsProps> = ({ onClose }) => {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>(DEFAULT_SHORTCUTS);
  const [selectedCategory, setSelectedCategory] = useState<KeyboardShortcut['category'] | 'all'>('all');
  const [editingShortcut, setEditingShortcut] = useState<string | null>(null);
  const [newKeys, setNewKeys] = useState<string>('');

  useEffect(() => {
    // Load shortcuts
    const categories: KeyboardShortcut['category'][] = ['file', 'edit', 'view', 'object', 'tool', 'custom'];
    const allShortcuts = categories.flatMap(cat => 
      keyboardShortcutsService.getShortcutsByCategory(cat)
    );
    setShortcuts(allShortcuts.length > 0 ? allShortcuts : DEFAULT_SHORTCUTS);
  }, []);

  const filteredShortcuts = selectedCategory === 'all' 
    ? shortcuts 
    : shortcuts.filter(s => s.category === selectedCategory);

  const categories: Array<{ id: KeyboardShortcut['category'] | 'all'; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'file', label: 'File' },
    { id: 'edit', label: 'Edit' },
    { id: 'view', label: 'View' },
    { id: 'object', label: 'Object' },
    { id: 'tool', label: 'Tools' },
    { id: 'custom', label: 'Custom' }
  ];

  const handleStartEdit = (shortcut: KeyboardShortcut) => {
    setEditingShortcut(shortcut.id);
    setNewKeys(shortcut.keys.join(', '));
  };

  const handleSaveEdit = (shortcut: KeyboardShortcut) => {
    if (editingShortcut === shortcut.id && newKeys.trim()) {
      const keys = newKeys.split(',').map(k => k.trim()).filter(k => k);
      keyboardShortcutsService.setCustomShortcut(shortcut.action, keys);
      setShortcuts(prev => prev.map(s => 
        s.id === shortcut.id ? { ...s, keys } : s
      ));
      setEditingShortcut(null);
      setNewKeys('');
    }
  };

  const handleReset = (shortcut: KeyboardShortcut) => {
    keyboardShortcutsService.resetShortcut(shortcut.action);
    setShortcuts(prev => prev.map(s => 
      s.id === shortcut.id ? { ...s, keys: shortcut.defaultKeys } : s
    ));
  };

  const handleKeyCapture = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const parts: string[] = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.metaKey) parts.push('Cmd');
    if (e.shiftKey) parts.push('Shift');
    if (e.altKey) parts.push('Alt');
    if (e.key && e.key !== 'Control' && e.key !== 'Meta' && e.key !== 'Shift' && e.key !== 'Alt') {
      parts.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
    }
    
    if (parts.length > 0) {
      setNewKeys(parts.join('+'));
    }
  };

  return (
    <div className="xibalba-panel-elevated-professional w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="xibalba-text-heading">Keyboard Shortcuts</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="xibalba-button-professional"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`xibalba-tab-professional ${selectedCategory === cat.id ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Shortcuts List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto xibalba-scrollbar">
        {filteredShortcuts.map(shortcut => (
          <div
            key={shortcut.id}
            className="xibalba-list-item-professional flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="xibalba-text-body font-medium">{shortcut.description}</div>
              <div className="xibalba-text-caption text-xs mt-1">
                Action: {shortcut.action}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {editingShortcut === shortcut.id ? (
                <>
                  <input
                    type="text"
                    value={newKeys}
                    onChange={(e) => setNewKeys(e.target.value)}
                    onKeyDown={handleKeyCapture}
                    onBlur={() => handleSaveEdit(shortcut)}
                    className="xibalba-input-professional w-48"
                    placeholder="Press keys..."
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(shortcut)}
                    className="xibalba-button-professional"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingShortcut(null);
                      setNewKeys('');
                    }}
                    className="xibalba-button-professional"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    {shortcut.keys.map((key, i) => (
                      <kbd
                        key={i}
                        className="px-2 py-1 bg-[var(--xibalba-grey-200)] border border-white/10 rounded text-xs font-mono"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                  <button
                    onClick={() => handleStartEdit(shortcut)}
                    className="xibalba-button-professional"
                    title="Edit shortcut"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  {shortcut.keys.join(',') !== shortcut.defaultKeys.join(',') && (
                    <button
                      onClick={() => handleReset(shortcut)}
                      className="xibalba-button-professional"
                      title="Reset to default"
                    >
                      <span className="material-symbols-outlined text-[16px]">refresh</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-[var(--xibalba-grey-100)] border border-white/10 rounded">
        <p className="xibalba-text-caption text-xs">
          <strong>Tip:</strong> Click &quot;Edit&quot; and press the keys you want to use. Press Spacebar while dragging to temporarily use the Hand tool (panning).
        </p>
      </div>
    </div>
  );
};

export default KeyboardShortcutsSettings;

