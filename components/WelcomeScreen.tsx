/**
 * Welcome Screen
 * First-time user onboarding and quick start guide
 */

import React, { useState } from 'react';

interface WelcomeScreenProps {
  onDismiss: () => void;
  onStartTutorial?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onDismiss, onStartTutorial }) => {
  const [showMore, setShowMore] = useState(false);

  const quickStartSteps = [
    { icon: 'add', text: 'Press Ctrl+N to create a new file', shortcut: 'Ctrl+N' },
    { icon: 'edit', text: 'Select a tool (V=Select, P=Pen, M=Rectangle)', shortcut: 'V, P, M' },
    { icon: 'gesture', text: 'Draw on the canvas to create shapes', shortcut: 'Click & Drag' },
    { icon: 'layers', text: 'Manage layers in the right sidebar', shortcut: 'Right Panel' },
    { icon: 'save', text: 'Press Ctrl+S to save your work', shortcut: 'Ctrl+S' },
  ];

  return (
    <div className="welcome-screen-overlay">
      <div className="welcome-screen-content xibalba-card">
        <div className="welcome-header">
          <div className="welcome-logo">
            <span className="material-symbols-outlined text-6xl text-[var(--xibalba-accent)]">auto_awesome</span>
          </div>
          <h1 className="welcome-title">Welcome to VectorForge</h1>
          <p className="welcome-subtitle">Professional vector editing powered by Xibalba OS</p>
        </div>

        <div className="welcome-quick-start">
          <h2 className="welcome-section-title">Quick Start</h2>
          <div className="welcome-steps">
            {quickStartSteps.map((step, idx) => (
              <div key={idx} className="welcome-step">
                <div className="welcome-step-icon">
                  <span className="material-symbols-outlined">{step.icon}</span>
                </div>
                <div className="welcome-step-content">
                  <p className="welcome-step-text">{step.text}</p>
                  <span className="welcome-step-shortcut">{step.shortcut}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showMore && (
          <div className="welcome-more-info">
            <h2 className="welcome-section-title">Keyboard Shortcuts</h2>
            <div className="welcome-shortcuts-grid">
              <div className="welcome-shortcut-item">
                <span className="welcome-shortcut-key">Ctrl+Z</span>
                <span className="welcome-shortcut-desc">Undo</span>
              </div>
              <div className="welcome-shortcut-item">
                <span className="welcome-shortcut-key">Ctrl+Shift+Z</span>
                <span className="welcome-shortcut-desc">Redo</span>
              </div>
              <div className="welcome-shortcut-item">
                <span className="welcome-shortcut-key">Ctrl+G</span>
                <span className="welcome-shortcut-desc">Group</span>
              </div>
              <div className="welcome-shortcut-item">
                <span className="welcome-shortcut-key">Ctrl+0</span>
                <span className="welcome-shortcut-desc">Fit to Window</span>
              </div>
              <div className="welcome-shortcut-item">
                <span className="welcome-shortcut-key">Delete</span>
                <span className="welcome-shortcut-desc">Delete Selected</span>
              </div>
              <div className="welcome-shortcut-item">
                <span className="welcome-shortcut-key">Esc</span>
                <span className="welcome-shortcut-desc">Deselect</span>
              </div>
            </div>
          </div>
        )}

        <div className="welcome-actions">
          <button
            onClick={() => setShowMore(!showMore)}
            className="xibalba-button-professional"
          >
            <span className="material-symbols-outlined text-[16px] mr-2">
              {showMore ? 'expand_less' : 'expand_more'}
            </span>
            {showMore ? 'Show Less' : 'Show More Shortcuts'}
          </button>
          {onStartTutorial && (
            <button
              onClick={onStartTutorial}
              className="xibalba-button-professional"
            >
              <span className="material-symbols-outlined text-[16px] mr-2">school</span>
              Start Tutorial
            </button>
          )}
          <button
            onClick={onDismiss}
            className="xibalba-button-professional primary"
          >
            <span className="material-symbols-outlined text-[16px] mr-2">rocket_launch</span>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

