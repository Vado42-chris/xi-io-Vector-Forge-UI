/**
 * Workspace Customizer Component
 * Allows users to customize workspace layout, save/load layouts, and manage panels
 * 
 * #hashtag: workspace-customizer component
 */

import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { layoutPersistenceService, SavedLayout } from '../services/layoutPersistenceService';
import { quadrantService, Quadrant } from '../services/quadrantService';

interface WorkspaceCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onLayoutChange?: (layoutId: string) => void;
}

const WorkspaceCustomizer: React.FC<WorkspaceCustomizerProps> = ({ isOpen, onClose, onLayoutChange }) => {
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<SavedLayout | null>(null);
  const [newLayoutName, setNewLayoutName] = useState('');
  const [newLayoutDescription, setNewLayoutDescription] = useState('');
  const [quadrants, setQuadrants] = useState(quadrantService.getAllQuadrants());

  useEffect(() => {
    if (isOpen) {
      loadLayouts();
    }
  }, [isOpen]);

  const loadLayouts = () => {
    setSavedLayouts(layoutPersistenceService.getAllLayouts());
  };

  const handleSaveLayout = () => {
    if (!newLayoutName.trim()) {
      alert('Please enter a layout name');
      return;
    }

    const layoutId = layoutPersistenceService.saveLayout(
      newLayoutName,
      newLayoutDescription,
      false
    );

    if (layoutId) {
      loadLayouts();
      setNewLayoutName('');
      setNewLayoutDescription('');
      alert('Layout saved successfully!');
    } else {
      alert('Failed to save layout');
    }
  };

  const handleLoadLayout = (layoutId: string) => {
    const layout = layoutPersistenceService.loadLayout(layoutId);
    if (layout && onLayoutChange) {
      onLayoutChange(layoutId);
      setSelectedLayout(layout);
      alert(`Loaded layout: ${layout.name}`);
    }
  };

  const handleDeleteLayout = (layoutId: string) => {
    if (confirm('Are you sure you want to delete this layout?')) {
      if (layoutPersistenceService.deleteLayout(layoutId)) {
        loadLayouts();
        if (selectedLayout?.id === layoutId) {
          setSelectedLayout(null);
        }
      }
    }
  };

  const handleExportLayout = (layoutId: string) => {
    const exported = layoutPersistenceService.exportLayout(layoutId);
    if (exported) {
      const blob = new Blob([exported], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vectorforge-layout-${layoutId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImportLayout = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const layoutId = layoutPersistenceService.importLayout(text);
          if (layoutId) {
            loadLayouts();
            alert('Layout imported successfully!');
          } else {
            alert('Failed to import layout');
          }
        } catch (error) {
          alert('Failed to import layout: Invalid file format');
        }
      }
    };
    input.click();
  };

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal-backdrop flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-customizer-title"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] rounded-lg w-[90vw] max-w-4xl h-[85vh] max-h-[700px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]" aria-hidden="true">
                dashboard
              </span>
              <h2 id="workspace-customizer-title" className="text-xl font-bold text-[var(--xibalba-text-000)]">
                Workspace Customizer
              </h2>
            </div>
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Close workspace customizer"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-100)]">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Save New Layout */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[var(--xibalba-text-000)]">Save Current Layout</h3>
                <div>
                  <label className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                    Layout Name *
                  </label>
                  <input
                    type="text"
                    value={newLayoutName}
                    onChange={(e) => setNewLayoutName(e.target.value)}
                    className="xibalba-input w-full min-h-[44px]"
                    placeholder="My Custom Layout"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                    Description
                  </label>
                  <textarea
                    value={newLayoutDescription}
                    onChange={(e) => setNewLayoutDescription(e.target.value)}
                    className="xibalba-input w-full min-h-[100px]"
                    placeholder="Describe this layout..."
                  />
                </div>
                <button
                  onClick={handleSaveLayout}
                  disabled={!newLayoutName.trim()}
                  className="xibalba-button-primary w-full min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined mr-2" aria-hidden="true">save</span>
                  Save Layout
                </button>
              </div>

              {/* Right: Saved Layouts */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[var(--xibalba-text-000)]">Saved Layouts</h3>
                  <button
                    onClick={handleImportLayout}
                    className="xibalba-button-secondary min-h-[36px] text-sm"
                  >
                    <span className="material-symbols-outlined mr-1 text-sm" aria-hidden="true">upload</span>
                    Import
                  </button>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {savedLayouts.length > 0 ? (
                    savedLayouts.map((layout) => (
                      <div
                        key={layout.id}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          selectedLayout?.id === layout.id
                            ? 'border-[var(--xibalba-accent)] bg-[var(--xibalba-grey-100)]'
                            : 'border-[var(--xibalba-grey-100)] hover:border-[var(--xibalba-accent)]'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-[var(--xibalba-text-000)]">{layout.name}</h4>
                              {layout.isDefault && (
                                <span className="text-xs px-2 py-0.5 bg-[var(--xibalba-accent)] text-black rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            {layout.description && (
                              <p className="text-sm text-[var(--xibalba-text-100)] mt-1">{layout.description}</p>
                            )}
                            <p className="text-xs text-[var(--xibalba-text-100)] mt-1">
                              Updated: {new Date(layout.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => handleLoadLayout(layout.id)}
                            className="xibalba-button-secondary flex-1 min-h-[32px] text-sm"
                          >
                            <span className="material-symbols-outlined mr-1 text-sm" aria-hidden="true">open_in_new</span>
                            Load
                          </button>
                          <button
                            onClick={() => handleExportLayout(layout.id)}
                            className="xibalba-button-secondary min-h-[32px] text-sm"
                            title="Export layout"
                          >
                            <span className="material-symbols-outlined text-sm" aria-label="Export">download</span>
                          </button>
                          <button
                            onClick={() => handleDeleteLayout(layout.id)}
                            className="xibalba-button-secondary min-h-[32px] text-sm text-[var(--vectorforge-accent)]"
                            title="Delete layout"
                          >
                            <span className="material-symbols-outlined text-sm" aria-label="Delete">delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-[var(--xibalba-text-100)]">
                      <p>No saved layouts yet</p>
                      <p className="text-xs mt-2">Save your current layout to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quadrant System Info */}
            <div className="mt-8 pt-6">
              <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-4">Screen Quadrants</h3>
              <div className="grid grid-cols-2 gap-4">
                {quadrants.map((quadrant) => (
                  <div
                    key={quadrant.id}
                    className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg"
                  >
                    <h4 className="font-semibold text-[var(--xibalba-text-000)] mb-1">{quadrant.name}</h4>
                    <p className="text-sm text-[var(--xibalba-text-100)] mb-2">{quadrant.description}</p>
                    <div className="text-xs text-[var(--xibalba-text-100)]">
                      Default panels: {quadrant.defaultPanels.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default WorkspaceCustomizer;
