/**
 * Reusable Empty State Component
 * REDUCE, REUSE, RECYCLE: Extract empty state pattern from LeftSidebar and other components
 */

import React from 'react';

export interface EmptyStateProps {
  icon?: string;
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  message,
  action,
  className = '',
}) => {
  return (
    <div className={`text-center text-[var(--xibalba-text-100)] text-sm py-8 ${className}`}>
      {icon && (
        <span 
          className="material-symbols-outlined text-4xl mb-2 block opacity-50" 
          aria-hidden="true" 
          data-icon={icon}
        />
      )}
      {title && (
        <h3 className="text-xs font-semibold mb-2 text-[var(--xibalba-text-100)]">
          {title}
        </h3>
      )}
      <p className="text-xs mt-2 opacity-75">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="xibalba-button-professional mt-4 text-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

