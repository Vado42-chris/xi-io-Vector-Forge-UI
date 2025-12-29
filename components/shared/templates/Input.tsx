/**
 * Unified Input Template Component
 * Phase 2: Component Templates & Reusability
 * 
 * NO INLINE STYLES - All styling via CSS classes
 * XIBALBA DESIGN SYSTEM COMPLIANT
 * 
 * Replaces all input patterns across the application
 */

import React from 'react';

export interface InputProps {
  /** Input type */
  type?: 'text' | 'number' | 'email' | 'password' | 'search' | 'url' | 'tel';
  /** Input value */
  value?: string | number;
  /** Default value */
  defaultValue?: string | number;
  /** Placeholder text */
  placeholder?: string;
  /** Label text */
  label?: string;
  /** Input name */
  name?: string;
  /** Input ID */
  id?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Read-only state */
  readOnly?: boolean;
  /** Required state */
  required?: boolean;
  /** Validation state */
  invalid?: boolean;
  /** Validation message */
  validationMessage?: string;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Blur handler */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Focus handler */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** ARIA described by */
  'aria-describedby'?: string;
  /** Min value (for number inputs) */
  min?: number;
  /** Max value (for number inputs) */
  max?: number;
  /** Step value (for number inputs) */
  step?: number;
}

/**
 * Unified Input Component
 * 
 * Features:
 * - All interaction states (hover, focus, disabled, invalid)
 * - Xibalba design system compliance
 * - No inline styles
 * - Accessibility support
 * - Validation support
 * - Multiple sizes
 */
export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  defaultValue,
  placeholder,
  label,
  name,
  id,
  disabled = false,
  readOnly = false,
  required = false,
  invalid = false,
  validationMessage,
  size = 'md',
  onChange,
  onBlur,
  onFocus,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  min,
  max,
  step,
}) => {
  // Build CSS classes
  const baseClasses = 'xibalba-input-professional';
  const sizeClasses = {
    sm: 'xibalba-input-sm',
    md: 'xibalba-input-md',
    lg: 'xibalba-input-lg',
  };
  
  const classes = [
    baseClasses,
    sizeClasses[size],
    invalid && 'xibalba-input-invalid',
    disabled && 'disabled',
    readOnly && 'readonly',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Generate unique ID if not provided
  const inputId = id || (name ? `input-${name}` : `input-${Math.random().toString(36).substring(2, 9)}`);
  const validationId = validationMessage ? `${inputId}-validation` : undefined;
  const finalAriaDescribedBy = ariaDescribedBy || (validationMessage ? validationId : undefined);

  return (
    <div className="xibalba-input-wrapper">
      {label && (
        <label htmlFor={inputId} className="xibalba-label-professional">
          {label}
          {required && <span className="xibalba-required-indicator" aria-label="required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        className={classes}
        aria-label={ariaLabel || label}
        aria-describedby={finalAriaDescribedBy}
        aria-invalid={invalid}
        aria-required={required}
        min={min}
        max={max}
        step={step}
      />
      {validationMessage && (
        <div id={validationId} className="xibalba-input-validation-message" role="alert">
          {validationMessage}
        </div>
      )}
    </div>
  );
};

export default Input;

