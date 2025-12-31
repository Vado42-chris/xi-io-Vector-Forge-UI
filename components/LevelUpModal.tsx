/**
 * Level Up Modal Component
 * Displays level up celebration and unlocked features
 * 
 * #hashtag: gamification level-up component
 */

import React, { useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { LevelDefinition } from '../services/xpService';

interface LevelUpModalProps {
  isOpen: boolean;
  levelInfo: LevelDefinition;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, levelInfo, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal flex items-center justify-center bg-black/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="level-up-title"
        onClick={onClose}
      >
        <div
          className="xibalba-panel bg-[var(--xibalba-grey-050)] border-2 border-[var(--xibalba-accent)] rounded-lg p-8 max-w-md w-[90vw] shadow-2xl animate-pulse"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce" aria-hidden="true">
              🎉
            </div>
            <h2 id="level-up-title" className="text-3xl font-bold text-[var(--xibalba-accent)] mb-2">
              Level Up!
            </h2>
            <div className="text-4xl font-bold text-[var(--xibalba-text-000)] mb-4">
              Level {levelInfo.level}
            </div>
            <div className="text-lg font-semibold text-[var(--xibalba-text-000)] mb-2">
              {levelInfo.title}
            </div>
            <p className="text-sm text-[var(--xibalba-text-100)] mb-6">
              {levelInfo.description}
            </p>

            {levelInfo.unlocks.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-semibold text-[var(--xibalba-text-000)] mb-3">
                  New Features Unlocked:
                </div>
                <div className="space-y-2">
                  {levelInfo.unlocks.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-[var(--xibalba-grey-100)] rounded-lg"
                    >
                      <span className="material-symbols-outlined text-[var(--xibalba-accent)]" aria-hidden="true">
                        check_circle
                      </span>
                      <span className="text-sm text-[var(--xibalba-text-000)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="xibalba-button-primary min-w-[120px] min-h-[44px]"
              aria-label="Close level up modal"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LevelUpModal;

