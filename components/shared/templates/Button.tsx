/**
 * Unified Button Template Component
 * Phase 2: Component Templates & Reusability
 * 
 * NO INLINE STYLES - All styling via CSS classes
 * XIBALBA DESIGN SYSTEM COMPLIANT
 * 
 * Replaces all button patterns across the application
 */

import React from 'react';

export interface ButtonProps {
  /** Button label text */
  label?: string;
  /** Icon name (Material Symbols) */
  icon?: string;
  /** Button action */
  onClick?: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'icon-only' | 'menu';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Active/selected state */
  active?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Tooltip text */
  tooltip?: string;
  /** Keyboard shortcut display */
  shortcut?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** Type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Children (for custom content) */
  children?: React.ReactNode;
}

/**
 * Unified Button Component
 * 
 * Features:
 * - All interaction states (hover, active, focus, disabled, loading)
 * - Xibalba design system compliance
 * - No inline styles
 * - Accessibility support
 * - Loading states
 * - Icon support
 */
export const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  loading = false,
  active = false,
  className = '',
  tooltip,
  shortcut,
  'aria-label': ariaLabel,
  type = 'button',
  children,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
}) => {
  // Build CSS classes
  const baseClasses = 'xibalba-button-professional';
  const variantClasses = {
    primary: 'xibalba-button-primary',
    secondary: 'xibalba-button-secondary',
    tertiary: 'xibalba-button-tertiary',
    'icon-only': 'xibalba-button-icon-only',
    menu: 'xibalba-button-menu',
  };
  const sizeClasses = {
    sm: 'xibalba-button-sm',
    md: 'xibalba-button-md',
    lg: 'xibalba-button-lg',
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    active && 'active',
    disabled && 'disabled',
    loading && 'xibalba-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Determine aria-label
  const finalAriaLabel = ariaLabel || label || tooltip || (icon ? `Button ${icon}` : 'Button');

  // Render button
  const buttonElement = (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      aria-label={finalAriaLabel}
      aria-busy={loading}
      data-loading={loading ? 'true' : 'false'}
      data-active={active ? 'true' : 'false'}
      title={tooltip}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {loading && (
        <span className="xibalba-loading-spinner" aria-hidden="true" />
      )}
      {icon && !loading && (
        <span className="material-symbols-outlined xibalba-button-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {label && <span className="xibalba-button-label">{label}</span>}
      {children}
      {shortcut && (
        <span className="xibalba-button-shortcut" aria-hidden="true">
          {shortcut}
        </span>
      )}
    </button>
  );

  // Wrap with tooltip if provided
  if (tooltip && !shortcut) {
    return (
      <div className="xibalba-tooltip-wrapper" data-tooltip={tooltip}>
        {buttonElement}
      </div>
    );
  }

  return buttonElement;
};

export default Button;

