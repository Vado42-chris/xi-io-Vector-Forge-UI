/**
 * Progressive Disclosure Component
 * 
 * Reusable pattern for hiding advanced features by default.
 * This fixes the "High Cognitive Load" UX issue.
 * 
 * Usage:
 * ```tsx
 * <ProgressiveDisclosure
 *   label="Advanced Settings"
 *   defaultCollapsed={true}
 * >
 *   <AdvancedSettings />
 * </ProgressiveDisclosure>
 * ```
 */

import React, { useState } from 'react';
import './ProgressiveDisclosure.css';

export interface ProgressiveDisclosureProps {
  label: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  icon?: string;
  className?: string;
  onToggle?: (collapsed: boolean) => void;
}

const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({
  label,
  children,
  defaultCollapsed = true,
  icon,
  className = '',
  onToggle,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className={`progressive-disclosure ${className}`}>
      <button
        className="progressive-disclosure-toggle"
        onClick={handleToggle}
        aria-expanded={!isCollapsed}
        aria-label={`${isCollapsed ? 'Show' : 'Hide'} ${label}`}
      >
        {icon && (
          <span className="material-symbols-outlined progressive-disclosure-icon">
            {icon}
          </span>
        )}
        <span className="progressive-disclosure-label">{label}</span>
        <span className="material-symbols-outlined progressive-disclosure-chevron">
          {isCollapsed ? 'expand_more' : 'expand_less'}
        </span>
      </button>
      
      {!isCollapsed && (
        <div className="progressive-disclosure-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProgressiveDisclosure;

