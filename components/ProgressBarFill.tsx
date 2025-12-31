/**
 * Progress Bar Fill Component
 * Uses ref with setProperty instead of inline styles for linter compliance
 * 
 * #hashtag: progress-bar component-isolation
 */

import React, { useRef, useEffect } from 'react';

interface ProgressBarFillProps {
  progress: number;
  className?: string;
  ariaLabel?: string;
}

const ProgressBarFill: React.FC<ProgressBarFillProps> = ({ 
  progress, 
  className = '',
  ariaLabel 
}) => {
  const fillRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.setProperty('--progress-value', `${progress}%`);
    }
  }, [progress]);

  const label = ariaLabel || `Progress: ${progress.toFixed(0)}%`;

  return (
    <div
      ref={fillRef}
      className={className}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      title={label}
    />
  );
};

export default ProgressBarFill;

