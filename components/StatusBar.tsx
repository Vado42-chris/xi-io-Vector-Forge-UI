/**
 * Status Bar Component
 * Bottom status bar with selection info, color mode, zoom, dimensions, AI Engine status
 * Matches design concept: "No Selection", "RGB / 8bpc", "Zoom: 100%", "800 x 600 px", "AI Engine: Ready"
 */

import React from 'react';

interface StatusBarProps {
  selectionInfo?: string;
  colorMode?: string;
  colorDepth?: string;
  zoom?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  aiEngineStatus?: 'ready' | 'processing' | 'error';
}

const StatusBar: React.FC<StatusBarProps> = ({
  selectionInfo = 'No Selection',
  colorMode = 'RGB',
  colorDepth = '8bpc',
  zoom = 100,
  canvasWidth = 800,
  canvasHeight = 600,
  aiEngineStatus = 'ready',
}) => {
  const getAIEngineIcon = () => {
    switch (aiEngineStatus) {
      case 'ready':
        return 'cloud_done';
      case 'processing':
        return 'cloud_sync';
      case 'error':
        return 'cloud_off';
      default:
        return 'cloud';
    }
  };

  const getAIEngineColor = () => {
    switch (aiEngineStatus) {
      case 'ready':
        return 'var(--xibalba-accent, #d46b32)';
      case 'processing':
        return 'var(--xibalba-text-200, #b8bfcc)';
      case 'error':
        return 'var(--xibalba-error, #ff4444)';
      default:
        return 'var(--xibalba-text-200, #b8bfcc)';
    }
  };

  return (
    <footer className="status-bar">
      <div className="status-bar-left">
        <div className="status-bar-item">
          <span className="material-symbols-outlined status-bar-icon">select_all</span>
          <span className="status-bar-text">{selectionInfo}</span>
        </div>
        <div className="status-bar-divider"></div>
        <div className="status-bar-item">
          <span className="material-symbols-outlined status-bar-icon">palette</span>
          <span className="status-bar-text">
            {colorMode} / {colorDepth}
          </span>
        </div>
        <div className="status-bar-divider"></div>
        <div className="status-bar-item">
          <span className="status-bar-text">Zoom: {zoom}%</span>
        </div>
      </div>

      <div className="status-bar-right">
        <div className="status-bar-item">
          <span className="status-bar-text">
            {canvasWidth} x {canvasHeight} px
          </span>
        </div>
        <div className="status-bar-divider"></div>
        <div className="status-bar-item status-bar-ai-engine">
          <span
            className="material-symbols-outlined status-bar-icon"
            style={{ color: getAIEngineColor() }}
          >
            {getAIEngineIcon()}
          </span>
          <span className="status-bar-text" style={{ color: getAIEngineColor() }}>
            AI Engine:{' '}
            {aiEngineStatus === 'ready'
              ? 'Ready'
              : aiEngineStatus === 'processing'
                ? 'Processing...'
                : 'Error'}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
