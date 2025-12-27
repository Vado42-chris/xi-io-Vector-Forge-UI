/**
 * Tool Locking System
 * Production-quality tool stability and locking
 * Prevents accidental tool changes, maintains tool state
 * Adobe/Microsoft/Apple level reliability
 */

import React, { useState, useCallback, useEffect } from 'react';
import { ToolType } from '../types';

export interface ToolLockState {
  isLocked: boolean;
  lockedTool: ToolType | null;
  lockReason?: string;
  lockTimestamp?: number;
}

export interface ToolLockConfig {
  /** Prevent tool changes when locked */
  preventChange: boolean;
  /** Show visual indicator when locked */
  showIndicator: boolean;
  /** Auto-unlock after timeout (ms) */
  autoUnlockTimeout?: number;
  /** Require confirmation to unlock */
  requireConfirmation: boolean;
}

interface ToolLockingSystemProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  lockConfig?: Partial<ToolLockConfig>;
  children: React.ReactNode;
}

const DEFAULT_LOCK_CONFIG: ToolLockConfig = {
  preventChange: true,
  showIndicator: true,
  requireConfirmation: false,
};

/**
 * Tool Lock Manager Hook
 */
export const useToolLock = () => {
  const [lockState, setLockState] = useState<ToolLockState>({
    isLocked: false,
    lockedTool: null,
  });

  const lockTool = useCallback((tool: ToolType, reason?: string) => {
    setLockState({
      isLocked: true,
      lockedTool: tool,
      lockReason: reason,
      lockTimestamp: Date.now(),
    });
  }, []);

  const unlockTool = useCallback((requireConfirmation: boolean = false) => {
    if (requireConfirmation) {
      const confirmed = window.confirm('Unlock tool? This will allow tool changes.');
      if (!confirmed) return;
    }
    setLockState({
      isLocked: false,
      lockedTool: null,
    });
  }, []);

  const toggleLock = useCallback((tool: ToolType, reason?: string) => {
    if (lockState.isLocked) {
      unlockTool();
    } else {
      lockTool(tool, reason);
    }
  }, [lockState.isLocked, lockTool, unlockTool]);

  return {
    lockState,
    lockTool,
    unlockTool,
    toggleLock,
  };
};

/**
 * Tool Lock Indicator Component
 */
export const ToolLockIndicator: React.FC<{
  lockState: ToolLockState;
  onUnlock: () => void;
}> = ({ lockState, onUnlock }) => {
  if (!lockState.isLocked || !lockState.lockedTool) return null;

  return (
    <div className="xibalba-tool-lock-indicator fixed top-20 right-4 z-[300] xibalba-card p-3 flex items-center gap-3 animate-in slide-in-from-right">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[var(--xibalba-accent)] text-[20px]">
          lock
        </span>
        <div className="flex flex-col">
          <span className="xibalba-text-xs font-black uppercase tracking-widest">
            Tool Locked
          </span>
          <span className="xibalba-text-caption text-[8px] text-[var(--xibalba-text-200)]">
            {lockState.lockedTool} {lockState.lockReason ? `• ${lockState.lockReason}` : ''}
          </span>
        </div>
      </div>
      <button
        onClick={onUnlock}
        className="xibalba-toolbar-button-professional size-6"
        title="Unlock Tool"
      >
        <span className="material-symbols-outlined text-[14px]">lock_open</span>
      </button>
    </div>
  );
};

/**
 * Tool Locking System Component
 * Wraps tool selection to prevent changes when locked
 */
export const ToolLockingSystem: React.FC<ToolLockingSystemProps> = ({
  activeTool,
  onToolChange,
  lockConfig = {},
  children,
}) => {
  const config = { ...DEFAULT_LOCK_CONFIG, ...lockConfig };
  const { lockState, lockTool, unlockTool, toggleLock } = useToolLock();

  // Prevent tool changes when locked
  const handleToolChange = useCallback((newTool: ToolType) => {
    if (config.preventChange && lockState.isLocked && lockState.lockedTool !== newTool) {
      // Tool is locked - prevent change
      return;
    }
    onToolChange(newTool);
  }, [lockState, config.preventChange, onToolChange]);

  // Auto-unlock after timeout
  useEffect(() => {
    if (config.autoUnlockTimeout && lockState.isLocked && lockState.lockTimestamp) {
      const timeout = setTimeout(() => {
        unlockTool();
      }, config.autoUnlockTimeout);
      return () => clearTimeout(timeout);
    }
  }, [lockState.isLocked, lockState.lockTimestamp, config.autoUnlockTimeout, unlockTool]);

  // Expose lock controls to children via context
  useEffect(() => {
    (window as any).__toolLockSystem = {
      lockTool,
      unlockTool: () => unlockTool(config.requireConfirmation),
      toggleLock,
      lockState,
    };
  }, [lockTool, unlockTool, toggleLock, lockState, config.requireConfirmation]);

  return (
    <>
      {config.showIndicator && (
        <ToolLockIndicator lockState={lockState} onUnlock={() => unlockTool(config.requireConfirmation)} />
      )}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            activeTool,
            onToolChange: handleToolChange,
            toolLockState: lockState,
          } as any);
        }
        return child;
      })}
    </>
  );
};

export default ToolLockingSystem;
// useToolLock and ToolLockIndicator are already exported above

