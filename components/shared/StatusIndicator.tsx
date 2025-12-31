/**
 * Reusable Status Indicator Component
 * REDUCE, REUSE, RECYCLE: Extract status display pattern from LeftSidebar
 */

import React from 'react';

export interface StatusIndicatorProps {
  status: 'ready' | 'processing' | 'error' | 'warning';
  message: string;
  secondary?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  secondary,
  className = '',
}) => {
  const statusColors = {
    ready: 'bg-[var(--vectorforge-accent)]',
    processing: 'bg-[var(--xibalba-bg-tertiary)] animate-pulse',
    error: 'bg-[var(--vectorforge-accent)] opacity-50',
    warning: 'bg-[var(--vectorforge-accent)] opacity-75',
  };

  return (
    <div className={`flex items-center justify-between text-xs font-bold text-[var(--xibalba-text-100)] uppercase tracking-widest ${className}`}>
      <div className="flex items-center gap-2">
        <div className={`size-2 ${statusColors[status]}`} />
        <span>{message}</span>
      </div>
      {secondary && <span>{secondary}</span>}
    </div>
  );
};

