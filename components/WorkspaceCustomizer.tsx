/**
 * Workspace Customizer
 * Power user tool for customizing workspace layout
 * Define columns, grids, toolbars, and create custom palettes
 */

import React, { useState } from 'react';
import { LayoutColumn, ToolbarDefinition } from '../hooks/useWorkspaceLayout';
import { CustomPaletteBuilder, CustomPalette } from './CustomPaletteBuilder';

interface WorkspaceCustomizerProps {
  columns: LayoutColumn[];
  toolbars: ToolbarDefinition[];
  customPalettes: CustomPalette[];
  onColumnUpdate: (id: string, updates: Partial<LayoutColumn>) => void;
  onToolbarUpdate: (id: string, updates: Partial<ToolbarDefinition>) => void;
  onCustomPaletteCreate: (palette: CustomPalette) => void;
  onCustomPaletteUpdate: (id: string, palette: Partial<CustomPalette>) => void;
  onCustomPaletteDelete: (id: string) => void;
  onResetLayout: () => void;
}

export const WorkspaceCustomizer: React.FC<WorkspaceCustomizerProps> = ({
  columns,
  toolbars,
  customPalettes,
  onColumnUpdate,
  onToolbarUpdate,
  onCustomPaletteCreate,
  onCustomPaletteUpdate,
  onCustomPaletteDelete,
  onResetLayout
}) => {
  const [activeTab, setActiveTab] = useState<'columns' | 'toolbars' | 'palettes' | 'grids'>('columns');

  return (
    <div className="xibalba-panel-professional space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="xibalba-text-heading">Workspace Customizer</h2>
        <button
          onClick={onResetLayout}
          className="xibalba-button-professional text-sm"
          title="Reset to default layout"
        >
          <span className="material-symbols-outlined text-[16px] mr-2">refresh</span>
          Reset Layout
        </button>
      </div>

      {/* Tabs */}
      <div className="xibalba-tabs-professional">
        {[
          { id: 'columns', label: 'Columns', icon: 'view_column' },
          { id: 'toolbars', label: 'Toolbars', icon: 'toolbar' },
          { id: 'palettes', label: 'Palettes', icon: 'apps' },
          { id: 'grids', label: 'Grids', icon: 'grid_on' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`xibalba-tab-professional ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px] mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'columns' && (
          <div className="space-y-3">
            <h3 className="xibalba-text-subheading">Layout Columns</h3>
            {columns.map(column => (
              <div key={column.id} className="xibalba-panel-professional p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="xibalba-text-subheading">{column.name}</div>
                    <div className="xibalba-text-caption">
                      {column.type} • {column.position} • {column.width}px
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={column.visible}
                        onChange={() => onColumnUpdate(column.id, { visible: !column.visible })}
                        className="xibalba-checkbox-professional"
                      />
                      <span className="xibalba-text-xs">Visible</span>
                    </label>
                  </div>
                </div>
                
                {column.resizable && (
                  <div>
                    <label className="xibalba-label-professional">Width</label>
                    <input
                      type="range"
                      min={column.minWidth || 200}
                      max={column.maxWidth || 600}
                      value={column.width || 320}
                      onChange={(e) => onColumnUpdate(column.id, { width: parseInt(e.target.value) })}
                      className="xibalba-input-professional w-full"
                    />
                    <div className="xibalba-text-caption text-right mt-1">{column.width}px</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'toolbars' && (
          <div className="space-y-3">
            <h3 className="xibalba-text-subheading">Toolbars</h3>
            {toolbars.map(toolbar => (
              <div key={toolbar.id} className="xibalba-panel-professional p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="xibalba-text-subheading">{toolbar.name}</div>
                    <div className="xibalba-text-caption">
                      {toolbar.position} • {toolbar.items.length} items
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={toolbar.visible}
                      onChange={() => onToolbarUpdate(toolbar.id, { visible: !toolbar.visible })}
                      className="xibalba-checkbox-professional"
                    />
                    <span className="xibalba-text-xs">Visible</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'palettes' && (
          <CustomPaletteBuilder
            customPalettes={customPalettes}
            onPaletteCreate={onCustomPaletteCreate}
            onPaletteUpdate={onCustomPaletteUpdate}
            onPaletteDelete={onCustomPaletteDelete}
            availableItems={[]} // Will be populated from context
          />
        )}

        {activeTab === 'grids' && (
          <div className="space-y-3">
            <h3 className="xibalba-text-subheading">Grid Layouts</h3>
            <div className="xibalba-panel-professional p-4 text-center opacity-50">
              <span className="material-symbols-outlined text-4xl mb-2">grid_on</span>
              <p className="xibalba-text-caption">Grid layouts coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

