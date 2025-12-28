/**
 * Layout Switcher Component
 * Allows users to switch between workflow layouts
 */

import React, { useState, useEffect } from 'react';
import { workflowLayoutService } from '../services/workflowLayoutService';
import type { WorkflowLayout } from '../types/workflow';

interface LayoutSwitcherProps {
  onLayoutChange?: (layout: WorkflowLayout) => void;
}

const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({ onLayoutChange }) => {
  const [layouts, setLayouts] = useState<WorkflowLayout[]>([]);
  const [currentLayout, setCurrentLayout] = useState<WorkflowLayout | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadLayouts = async () => {
      await workflowLayoutService.initialize();
      const allLayouts = workflowLayoutService.getAllLayouts();
      setLayouts(allLayouts);
      
      const current = workflowLayoutService.getCurrentLayout();
      setCurrentLayout(current);
    };

    loadLayouts();
  }, []);

  const handleLayoutSelect = (layout: WorkflowLayout) => {
    try {
      workflowLayoutService.setCurrentLayout(layout.id);
      setCurrentLayout(layout);
      setIsOpen(false);
      if (onLayoutChange) {
        onLayoutChange(layout);
      }
    } catch (error: any) {
      console.error('Failed to switch layout:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[var(--xibalba-bg-tertiary)] border border-white/10 hover:border-[var(--xibalba-accent)] text-[10px] font-black uppercase tracking-widest text-[var(--xibalba-text-primary)] hover:text-[var(--xibalba-text-primary)] transition-colors"
        title="Switch Workflow Layout"
      >
        <span className="material-symbols-outlined text-[14px]">view_quilt</span>
        <span>{currentLayout?.name || 'Layout'}</span>
        <span className="material-symbols-outlined text-[12px]">arrow_drop_down</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-64 xibalba-card z-[100] border border-white/10 shadow-lg">
            <div className="p-2 space-y-1">
              {layouts.map(layout => (
                <button
                  key={layout.id}
                  onClick={() => handleLayoutSelect(layout)}
                  className={`w-full text-left px-4 py-2.5 text-[10px] font-medium transition-colors ${
                    currentLayout?.id === layout.id
                      ? 'bg-[var(--xibalba-bg-hover)] text-[var(--xibalba-text-primary)]'
                      : 'text-[var(--xibalba-text-secondary)] hover:text-[var(--xibalba-text-primary)] hover:bg-[var(--xibalba-bg-hover)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-black uppercase tracking-widest mb-0.5">
                        {layout.name}
                      </div>
                      <div className="text-[9px] text-[var(--xibalba-text-200)]">
                        {layout.description}
                      </div>
                    </div>
                    {layout.category === 'default' && (
                      <span className="text-[8px] px-1.5 py-0.5 bg-[var(--xibalba-accent)]/20 text-[var(--xibalba-accent)] uppercase">
                        Default
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LayoutSwitcher;

