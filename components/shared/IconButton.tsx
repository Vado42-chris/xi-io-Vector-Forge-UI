/**
 * Reusable Icon Button Component
 * REDUCE, REUSE, RECYCLE: Extract icon button pattern from RightSidebar and other components
 * For simple icon-only buttons (not tool buttons)
 */

import React from 'react';
import Tooltip from '../Tooltip';

export interface IconButtonProps {
  icon: string;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
  variant?: 'default' | 'danger' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  tooltip,
  disabled = false,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'size-6 text-[14px]',
    md: 'size-8 text-[18px]',
    lg: 'size-12 text-[20px]',
  };

  const variantClasses = {
    default: 'xibalba-toolbar-button-professional',
    danger: 'xibalba-toolbar-button-professional delete-button-text',
    primary: 'xibalba-toolbar-button-professional bg-[var(--xibalba-accent)]',
  };

  const button = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={tooltip}
      aria-label={tooltip}
    >
      <span className="material-symbols-outlined" aria-hidden="true" data-icon={icon} />
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} position="left">
        {button}
      </Tooltip>
    );
  }

  return button;
};

