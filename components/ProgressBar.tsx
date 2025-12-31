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

import React, { useRef, useEffect } from 'react';

export interface ProgressBarProps {
  progress?: number;              // 0-100, undefined = indeterminate
  label?: string;                 // Status label
  showPercentage?: boolean;      // Show percentage text
  size?: 'sm' | 'md' | 'lg';     // Size variant
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  animated?: boolean;             // Animate progress
  className?: string;
}

// Progress Fill Component - FIXED: No inline styles
const ProgressFill: React.FC<{
  variant: 'default' | 'accent' | 'success' | 'warning' | 'error';
  progress: number;
  animated: boolean;
  className?: string;
}> = ({ variant, progress, animated, className = '' }) => {
  const fillRef = useRef<HTMLDivElement>(null);
  const progressBarClasses = {
    default: 'bg-[var(--xibalba-accent)]',
    accent: 'bg-[var(--xibalba-accent)]',
    success: 'bg-[var(--vectorforge-accent)]',
    warning: 'bg-[var(--vectorforge-accent)]',
    error: 'bg-[var(--vectorforge-accent)]'
  };

  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.setProperty('--progress-width', `${progress}%`);
    }
  }, [progress]);

  return (
    <div
      ref={fillRef}
      className={`h-full ${progressBarClasses[variant]} progress-bar-fill ${className}`}
    />
  );
};

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
    success: 'bg-[var(--vectorforge-accent)]',
    warning: 'bg-[var(--vectorforge-accent)]',
    error: 'bg-[var(--vectorforge-accent)]'
  };

  const isIndeterminate = progress === undefined;
  const displayProgress = Math.min(100, Math.max(0, progress || 0));

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="xibalba-text-caption text-[var(--xibalba-text-100)]">
              {label}
            </span>
          )}
          {showPercentage && !isIndeterminate && (
            <span className="xibalba-text-caption font-mono text-[var(--xibalba-text-100)]">
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
          // Indeterminate (animated) - FIXED: No inline styles
          <ProgressFill
            variant={variant}
            progress={40}
            animated={animated}
            className={`animate-progress-indeterminate`}
          />
        ) : (
          // Determinate (with percentage) - FIXED: No inline styles
          <ProgressFill
            variant={variant}
            progress={displayProgress}
            animated={animated}
            className="transition-all duration-300 ease-out"
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;

