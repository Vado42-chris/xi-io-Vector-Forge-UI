/**
 * @module ContextualHelpPanel
 * @description
 * Contextual help panel that surfaces relevant help based on current context.
 * Implements MAI framework for help content surfacing.
 * 
 * Server Timestamp: 1737955680000
 * Date: December 27, 2025
 * Patent Tracking ID: VF-UI-HELP-2025-12-27-001
 * Work Tracking ID: WT-UI-HELP-1737955680000
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 */

import React from 'react';
import { useContextualUI } from '../hooks/useContextualUI';
import { UIContextState } from '../services/contextualUIService';

interface ContextualHelpPanelProps {
  context?: Partial<UIContextState>;
  maxPriority?: 'P0' | 'P1' | 'P2' | 'P3';
  onHelpClick?: (elementId: string) => void;
}

export default function ContextualHelpPanel({
  context,
  maxPriority = 'P1',
  onHelpClick,
}: ContextualHelpPanelProps) {
  const { contextualHelp, updateContext } = useContextualUI(context, maxPriority);

  // Update context when prop changes
  React.useEffect(() => {
    if (context) {
      updateContext(context);
    }
  }, [context, updateContext]);

  if (contextualHelp.length === 0) {
    return null;
  }

  return (
    <div className="xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg p-4">
      <div className="xibalba-section-header-professional mb-4">
        <span className="material-symbols-outlined text-sm mr-2">help</span>
        <span>Contextual Help</span>
      </div>
      
      <div className="space-y-3">
        {contextualHelp.map(({ element, helpText }) => (
          <button
            key={element.id}
            onClick={() => onHelpClick?.(element.id)}
            className="w-full text-left p-3 xibalba-interactive hover:bg-[var(--xibalba-grey-100)] rounded transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[var(--xibalba-grey-100)] rounded group-hover:bg-[var(--xibalba-accent)] transition-colors">
                <span className="material-symbols-outlined text-sm text-[var(--xibalba-text-100)] group-hover:text-white">
                  {element.location === 'toolbar' ? 'construction' :
                   element.location === 'sidebar-left' ? 'view_sidebar' :
                   element.location === 'sidebar-right' ? 'view_sidebar' :
                   element.location === 'menu' ? 'menu' :
                   element.location === 'dialog' ? 'open_in_new' :
                   'info'}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-[var(--xibalba-text-000)]">
                    {element.name}
                  </span>
                  {element.keyboardShortcut && (
                    <span className="text-xs text-[var(--xibalba-text-100)] font-mono bg-[var(--xibalba-grey-100)] px-2 py-0.5 rounded">
                      {element.keyboardShortcut}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--xibalba-text-100)] leading-relaxed">
                  {helpText}
                </p>
                {element.helpLink && (
                  <a
                    href={element.helpLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--xibalba-accent)] hover:underline mt-1 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Learn more →
                  </a>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

