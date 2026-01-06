/**
 * MAI Framework - Most Actionable Item
 * 
 * Reusable component for surfacing the single most actionable item
 * in any Xibalba product. This fixes the "No Clear Primary Action" UX issue.
 * 
 * Usage:
 * ```tsx
 * <MAIActionCenter
 *   actions={[
 *     { id: 'generate', label: 'Generate Vector', urgency: 'high', action: () => {} }
 *   ]}
 *   position="top-right"
 * />
 * ```
 */

import React, { useState, useEffect } from 'react';
import './MAIFramework.css';

export interface MAIAction {
  id: string;
  label: string;
  description?: string;
  action: () => void;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  context?: string;
  icon?: string;
  disabled?: boolean;
}

export interface MAIFrameworkProps {
  actions: MAIAction[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onAction?: (action: MAIAction) => void;
  className?: string;
}

/**
 * ActionCenter Component (Simple API)
 */
export const ActionCenter: React.FC<ActionCenterProps> = ({
  primaryAction,
  position = 'top-right',
  className = '',
  onAction,
}) => {
  // No action available - show "All Caught Up"
  if (!primaryAction) {
    return (
      <div
        className={`action-center action-center--${position} ${className}`}
        style={{
          position: 'fixed',
          ...(position === 'top-right' && { top: 16, right: 16 }),
          ...(position === 'top-left' && { top: 16, left: 16 }),
          ...(position === 'bottom-right' && { bottom: 16, right: 16 }),
          ...(position === 'bottom-left' && { bottom: 16, left: 16 }),
          background: 'var(--xibalba-bg-tertiary, #2a2a2a)',
          color: 'var(--xibalba-text-secondary, #aaaaaa)',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 500,
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        ✅ All Caught Up
      </div>
    );
  }

  const handleClick = () => {
    if (!primaryAction.disabled && !primaryAction.loading) {
      primaryAction.onClick();
      if (onAction) {
        onAction(primaryAction);
      }
    }
  };

  return (
    <button
      className={`action-center action-center--${position} action-center--active ${className}`}
      onClick={handleClick}
      disabled={primaryAction.disabled || primaryAction.loading}
      style={{
        position: 'fixed',
        ...(position === 'top-right' && { top: 16, right: 16 }),
        ...(position === 'top-left' && { top: 16, left: 16 }),
        ...(position === 'bottom-right' && { bottom: 16, right: 16 }),
        ...(position === 'bottom-left' && { bottom: 16, left: 16 }),
        background: 'var(--vectorforge-accent, #ff9800)',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 700,
        border: 'none',
        cursor: primaryAction.disabled || primaryAction.loading ? 'not-allowed' : 'pointer',
        opacity: primaryAction.disabled ? 0.6 : 1,
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      onMouseEnter={(e) => {
        if (!primaryAction.disabled && !primaryAction.loading) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 152, 0, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
      }}
      aria-label={`Action Center: ${primaryAction.label}`}
    >
      {primaryAction.icon && (
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
          {primaryAction.icon}
        </span>
      )}
      {primaryAction.loading ? '⏳ Processing...' : primaryAction.label}
    </button>
  );
};

/**
 * MAIFramework Component (Legacy API - for backward compatibility)
 */
const MAIFramework: React.FC<MAIFrameworkProps> = ({
  actions,
  position = 'top-right',
  onAction,
  className = '',
}) => {
  // Convert legacy actions to simple format
  if (actions.length === 0) {
    return <ActionCenter primaryAction={null} position={position} className={className} />;
  }

  // Sort by urgency priority
  const urgencyPriority = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...actions].sort((a, b) => 
    urgencyPriority[a.urgency] - urgencyPriority[b.urgency]
  );

  const primaryAction = sorted[0];
  const actionCenterAction: ActionCenterAction = {
    label: primaryAction.label,
    onClick: primaryAction.action,
    disabled: primaryAction.disabled,
    loading: false,
    icon: primaryAction.icon,
  };

  return (
    <ActionCenter
      primaryAction={actionCenterAction}
      position={position}
      className={className}
      onAction={(action) => {
        if (onAction) {
          onAction(primaryAction);
        }
      }}
    />
  );
};

export default MAIFramework;

