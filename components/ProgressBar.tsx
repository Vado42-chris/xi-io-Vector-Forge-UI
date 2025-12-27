/**
 * #hashtag: progress-bar
 * #purpose: Reusable progress bar component for VectorForge
 * #provides: Animated progress indicators with percentage, indeterminate mode, and status text
 * #usage: Import and use for loading states, file operations, AI generation, etc.
 * #related: Footer, AIChatbot, ScriptEditor
 * 
 * Progress Bar Component
 * Follows Xibalba standards: NO inline styles, component-based, accessible
 */

import React from 'react';

export interface ProgressBarProps {
  progress?: number;              // 0-100, undefined = indeterminate
  label?: string;                 // Status label
  showPercentage?: boolean;      // Show percentage text
  size?: 'sm' | 'md' | 'lg';     // Size variant
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  animated?: boolean;             // Animate progress
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = false,
  size = 'md',
  variant = 'default',
  animated = true,
  className = ''
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  // Variant colors
  const variantClasses = {
    default: 'bg-[var(--xibalba-grey-200)]',
    accent: 'bg-[var(--xibalba-accent)]',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  const progressBarClasses = {
    default: 'bg-[var(--xibalba-accent)]',
    accent: 'bg-[var(--xibalba-accent)]',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  const isIndeterminate = progress === undefined;
  const displayProgress = Math.min(100, Math.max(0, progress || 0));

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="xibalba-text-caption text-[var(--xibalba-text-200)]">
              {label}
            </span>
          )}
          {showPercentage && !isIndeterminate && (
            <span className="xibalba-text-caption font-mono text-[var(--xibalba-text-200)]">
              {Math.round(displayProgress)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        className={`${sizeClasses[size]} w-full ${variantClasses[variant]} overflow-hidden relative`}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : displayProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        {/* Progress Fill */}
        {isIndeterminate ? (
          // Indeterminate (animated)
          <div
            className={`h-full ${progressBarClasses[variant]} progress-bar-fill ${
              animated ? 'animate-progress-indeterminate' : ''
            }`}
            style={{
              '--progress-width': '40%'
            } as React.CSSProperties}
          />
        ) : (
          // Determinate (with percentage)
          <div
            className={`h-full ${progressBarClasses[variant]} transition-all duration-300 progress-bar-fill ${
              animated ? 'ease-out' : ''
            }`}
            style={{
              '--progress-width': `${displayProgress}%`
            } as React.CSSProperties}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;

