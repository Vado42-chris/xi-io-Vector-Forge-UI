/**
 * AI Floating Panel Component
 * Draggable, dismissible floating panel for AI generation
 * Design Guide Compliance: AI Panel should be modal/floating, not permanent in layout
 */

import React, { useState, useRef, useEffect } from 'react';
import AdvancedSection from './design-system/AdvancedSection';

interface AIFloatingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  style: string;
  onStyleChange: (style: string) => void;
  complexity: number;
  onComplexityChange: (complexity: number) => void;
  onGenerate: () => void;
  advancedMode: boolean;
  onAdvancedModeChange: (advanced: boolean) => void;
}

const AIFloatingPanel: React.FC<AIFloatingPanelProps> = ({
  isOpen,
  onClose,
  prompt,
  onPromptChange,
  style,
  onStyleChange,
  complexity,
  onComplexityChange,
  onGenerate,
  advancedMode,
  onAdvancedModeChange,
}) => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-[1000]" onClick={onClose} aria-hidden="true" />

      {/* Floating Panel */}
      <div
        ref={panelRef}
        className="fixed z-[1001] bg-[var(--xibalba-grey-100)] rounded-lg border border-[var(--xibalba-grey-300)] shadow-2xl"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '400px',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        data-testid="ai-panel"
      >
        {/* Draggable Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-[var(--xibalba-grey-300)] cursor-move"
          onMouseDown={handleDragStart}
        >
          <h3 className="text-xs font-bold text-[var(--xibalba-text-000)] uppercase tracking-widest">
            ✨ GENERATIVE VECTOR AI
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--xibalba-text-300)] hover:text-[var(--xibalba-text-000)] transition-colors"
            aria-label="Close AI Panel"
            title="Close AI Panel"
          >
            ✕
          </button>
        </div>

        {/* Panel Content */}
        <div className="p-4 space-y-4">
          {/* PROMPT Section */}
          <div>
            <label className="text-xs font-semibold text-[var(--xibalba-text-100)] uppercase tracking-wide block mb-1">
              PROMPT
            </label>
            <textarea
              value={prompt}
              onChange={e => onPromptChange(e.target.value)}
              placeholder="Describe the vector you want to create..."
              className="w-full bg-[var(--xibalba-grey-200)] border border-[var(--xibalba-grey-300)] rounded text-sm text-[var(--xibalba-text-000)] placeholder:text-[var(--xibalba-text-300)] focus:outline-none focus:border-[var(--vectorforge-accent)] resize-none p-2"
              rows={3}
            />
          </div>

          {/* STYLE Section */}
          <div>
            <label className="text-xs font-semibold text-[var(--xibalba-text-100)] uppercase tracking-wide block mb-1">
              STYLE
            </label>
            <div className="flex flex-wrap gap-2">
              {['Line Art', 'Flat Icon', 'Isometric', 'Abstract'].map(styleLabel => {
                const styleValue = styleLabel.toLowerCase().replace(' ', '-');
                return (
                  <button
                    key={styleLabel}
                    onClick={() => onStyleChange(styleValue)}
                    className={`text-xs rounded border transition-colors px-3 py-1 ${
                      style === styleValue
                        ? 'bg-[var(--vectorforge-accent)] text-white border-[var(--vectorforge-accent)]'
                        : 'bg-[var(--xibalba-grey-200)] text-[var(--xibalba-text-100)] border-[var(--xibalba-grey-300)] hover:border-[var(--vectorforge-accent)]'
                    }`}
                    aria-label={`${styleLabel} Style`}
                    title={`${styleLabel} Style`}
                  >
                    {styleLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={onGenerate}
            className="w-full bg-[var(--vectorforge-accent)] text-white rounded text-sm font-semibold hover:opacity-90 transition-opacity py-2"
            aria-label="Generate Vector"
            title="Generate Vector"
          >
            Generate Vector
          </button>

          {/* Advanced Options */}
          <AdvancedSection
            collapsed={!advancedMode}
            summary={<strong>Advanced options</strong>}
            id="ai-advanced"
            onToggle={collapsed => {
              if (!collapsed && !advancedMode) {
                onAdvancedModeChange(true);
              }
            }}
          >
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-[var(--xibalba-text-100)] uppercase tracking-wide block mb-1">
                  COMPLEXITY
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={complexity}
                  onChange={e => onComplexityChange(parseInt(e.target.value))}
                  className="w-full"
                  aria-label="Complexity"
                />
                <div className="text-xs text-[var(--xibalba-text-200)] mt-1">
                  {complexity}% complexity
                </div>
              </div>
            </div>
          </AdvancedSection>
        </div>
      </div>
    </>
  );
};

export default AIFloatingPanel;
