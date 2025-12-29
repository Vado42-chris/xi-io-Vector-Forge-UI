/**
 * Unified Panel Template Component
 * Phase 2: Component Templates & Reusability
 * 
 * NO INLINE STYLES - All styling via CSS classes
 * XIBALBA DESIGN SYSTEM COMPLIANT
 * 
 * Replaces all panel patterns across the application
 */

import React from 'react';

export interface PanelProps {
  /** Panel title */
  title?: string;
  /** Panel header content */
  header?: React.ReactNode;
  /** Panel footer content */
  footer?: React.ReactNode;
  /** Panel variant */
  variant?: 'default' | 'elevated' | 'flat';
  /** Collapsible state */
  collapsible?: boolean;
  /** Collapsed state */
  collapsed?: boolean;
  /** Collapse toggle handler */
  onCollapseToggle?: () => void;
  /** Panel content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Panel ID */
  id?: string;
}

/**
 * Unified Panel Component
 * 
 * Features:
 * - All panel variants
 * - Collapsible support
 * - Smooth transitions
 * - Xibalba design system compliance
 * - No inline styles
 */
export const Panel: React.FC<PanelProps> = ({
  title,
  header,
  footer,
  variant = 'default',
  collapsible = false,
  collapsed = false,
  onCollapseToggle,
  children,
  className = '',
  id,
}) => {
  // Build CSS classes
  const baseClasses = 'xibalba-panel-professional';
  const variantClasses = {
    default: 'xibalba-panel-default',
    elevated: 'xibalba-panel-elevated-professional',
    flat: 'xibalba-panel-flat',
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    collapsible && 'xibalba-panel-collapsible',
    collapsed && 'xibalba-panel-collapsed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div id={id} className={classes}>
      {(title || header || collapsible) && (
        <div className="xibalba-panel-header">
          {collapsible && (
            <button
              type="button"
              onClick={onCollapseToggle}
              className="xibalba-panel-collapse-button"
              aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
              aria-expanded={!collapsed}
            >
              <span className="material-symbols-outlined">
                {collapsed ? 'chevron_right' : 'chevron_down'}
              </span>
            </button>
          )}
          {title && <h3 className="xibalba-panel-title">{title}</h3>}
          {header && <div className="xibalba-panel-header-content">{header}</div>}
        </div>
      )}
      {!collapsed && (
        <div className="xibalba-panel-content">
          {children}
        </div>
      )}
      {footer && !collapsed && (
        <div className="xibalba-panel-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Panel;

