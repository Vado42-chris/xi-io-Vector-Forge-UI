/**
 * Reusable Tool Button Component
 * REDUCE, REUSE, RECYCLE: Extract tool button pattern from LeftSidebar, DockableToolPalette, FloatingToolbar
 */

import React from 'react';
import { ToolType } from '../../types';
import Tooltip from '../Tooltip';

export interface ToolButtonProps {
  tool: {
    id: ToolType;
    label: string;
    icon: string;
    shortcut?: string;
  };
  activeTool?: ToolType;
  onClick: (tool: ToolType) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact' | 'icon-only';
  showShortcut?: boolean;
  tooltip?: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
}

export const ToolButton: React.FC<ToolButtonProps> = ({
  tool,
  activeTool,
  onClick,
  disabled = false,
  variant = 'default',
  showShortcut = true,
  tooltip,
  position = 'right',
}) => {
  const isActive = activeTool === tool.id;
  
  const defaultTooltip = tooltip || `${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`;
  
  const buttonContent = (
    <div className="xibalba-tool-button-container">
      <button
        onClick={() => !disabled && onClick(tool.id)}
        disabled={disabled}
        className={
          variant === 'icon-only'
            ? `xibalba-toolbar-button-professional w-full h-full flex items-center justify-center ${
                isActive 
                  ? 'bg-[color-mix(in_srgb,var(--xibalba-accent)_25%,var(--xibalba-grey-100))] border-l-[3px] border-[var(--xibalba-accent)] shadow-[0_0_8px_rgba(255,152,0,0.3)]' 
                  : 'hover:bg-[var(--xibalba-grey-150)] border-2 border-transparent'
              }`
            : variant === 'compact'
            ? `xibalba-toolbar-button-professional w-full flex flex-col items-center justify-center gap-1 p-2 transition-all duration-200 ${
                isActive ? 'bg-[color-mix(in_srgb,var(--xibalba-accent)_25%,var(--xibalba-grey-100))] border-l-3 border-[var(--xibalba-accent)] text-[var(--xibalba-text-000)] shadow-[0_0_8px_rgba(255,152,0,0.3)]' : 'hover:bg-[var(--xibalba-grey-150)]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
            : `xibalba-button-professional w-full flex flex-col items-center justify-center gap-1 p-2 transition-all ${
                isActive 
                  ? 'bg-[color-mix(in_srgb,var(--xibalba-accent)_25%,var(--xibalba-grey-100))] border-l-[3px] border-[var(--xibalba-accent)] shadow-[0_0_8px_rgba(255,152,0,0.3)]' 
                  : 'hover:bg-[var(--xibalba-bg-tertiary)]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
        }
        title={defaultTooltip}
      >
      <span 
        className={`material-symbols-outlined ${
          variant === 'icon-only' ? 'text-[20px]' : 'text-[14px]'
        } ${isActive ? 'text-[var(--xibalba-accent)]' : ''}`}
        aria-hidden="true"
        data-icon={tool.icon}
      />
        {variant !== 'icon-only' && (
          <>
            <span className={`xibalba-tool-label ${isActive ? 'font-semibold text-[var(--xibalba-text-000)]' : 'text-[var(--xibalba-text-100)]'}`}>
              {tool.label}
            </span>
            {showShortcut && tool.shortcut && (
              <span className={`xibalba-tool-shortcut ${
                isActive 
                  ? 'text-[var(--xibalba-accent)]' 
                  : 'text-[var(--xibalba-text-200)]'
              }`}>
                ({tool.shortcut})
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );

  if (variant === 'icon-only') {
    return buttonContent;
  }

  return (
    <Tooltip content={defaultTooltip} position={position}>
      {buttonContent}
    </Tooltip>
  );
};

