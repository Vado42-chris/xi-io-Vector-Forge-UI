/**
 * Template Frame Container Component
 * Renders template frames and their attached components
 * 
 * This component provides the rendering system for template frames.
 * Components can attach to frames via the `attachedToFrame` property.
 * 
 * #hashtag: templates template-frames frame-container
 */

import React, { useEffect, useState, useRef } from 'react';
import { templateFrameService, TemplateFrame } from '../services/templateFrameService';

interface TemplateFrameContainerProps {
  frameId: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Individual Template Frame Component
 */
export const TemplateFrameComponent: React.FC<TemplateFrameContainerProps> = ({
  frameId,
  children,
  className = '',
  style = {},
}) => {
  const [frame, setFrame] = useState<TemplateFrame | null>(null);

  useEffect(() => {
    // Load frame
    const loadedFrame = templateFrameService.getFrame(frameId);
    setFrame(loadedFrame);

    // Listen for frame updates (if service supports events in future)
    // For now, we'll just load once
  }, [frameId]);

  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!frame || !frame.visible || !frameRef.current) {
      return;
    }

    // Set CSS custom properties instead of inline styles
    if (frame.zIndex !== undefined) {
      frameRef.current.style.setProperty('--template-frame-z-index', frame.zIndex.toString());
    }
    
    if (frame.position) {
      if (frame.position.x !== undefined) {
        frameRef.current.style.setProperty('--template-frame-left', `${frame.position.x}px`);
      }
      if (frame.position.y !== undefined) {
        frameRef.current.style.setProperty('--template-frame-top', `${frame.position.y}px`);
      }
      if (frame.position.width !== undefined) {
        frameRef.current.style.setProperty('--template-frame-width', `${frame.position.width}px`);
      }
      if (frame.position.height !== undefined) {
        frameRef.current.style.setProperty('--template-frame-height', `${frame.position.height}px`);
      }
    }
  }, [frame]);

  if (!frame || !frame.visible) {
    return null;
  }

  return (
    <div
      ref={frameRef}
      id={frame.containerId || `template-frame-${frameId}`}
      className={`template-frame ${className}`}
      data-frame-id={frameId}
    >
      {children}
    </div>
  );
};

/**
 * Template Frame Container Manager
 * Manages and renders all visible template frames
 */
export const TemplateFrameContainer: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const [frames, setFrames] = useState<TemplateFrame[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load visible frames
    const visibleFrames = templateFrameService.getVisibleFrames();
    setFrames(visibleFrames);

    // TODO: Add event listener for frame updates when service supports it
    // For now, we'll just load once on mount
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      // Set CSS custom property for positioning context
      containerRef.current.style.setProperty('--template-frame-container-position', 'relative');
    }
  }, []);

  // Always render container, even if empty (prevents hook order issues)
  return (
    <div 
      ref={containerRef}
      className={`template-frame-container ${frames.length === 0 ? 'template-frame-container-empty' : ''} ${className}`}
    >
      {frames.map(frame => (
        <TemplateFrameComponent
          key={frame.id}
          frameId={frame.id}
        />
      ))}
    </div>
  );
};

export default TemplateFrameContainer;

