/**
 * Template Frame Context Hook
 * Detects if a component is attached to a template frame
 * 
 * #hashtag: templates template-frames hooks context-detection
 */

import { useEffect, useState } from 'react';
import { templateFrameService } from '../services/templateFrameService';

export interface TemplateFrameContext {
  frameId: string | null;
  frame: ReturnType<typeof templateFrameService.getFrame> | null;
  isAttached: boolean;
  attachToFrame: (frameId: string) => boolean;
  detachFromFrame: () => boolean;
}

/**
 * Hook to detect and manage template frame attachment
 * @param componentId - ID of the component using this hook
 * @returns Template frame context
 */
export function useTemplateFrame(componentId: string): TemplateFrameContext {
  const [frameId, setFrameId] = useState<string | null>(null);
  const [frame, setFrame] = useState<ReturnType<typeof templateFrameService.getFrame> | null>(null);

  useEffect(() => {
    // Check if component is attached to any frame
    const allFrames = templateFrameService.getAllFrames();
    const attachedFrame = allFrames.find(f => f.attachedComponents.includes(componentId));
    
    if (attachedFrame) {
      setFrameId(attachedFrame.id);
      setFrame(attachedFrame);
    } else {
      setFrameId(null);
      setFrame(null);
    }
  }, [componentId]);

  const attachToFrame = (targetFrameId: string): boolean => {
    const success = templateFrameService.attachComponent(targetFrameId, componentId);
    if (success) {
      const attachedFrame = templateFrameService.getFrame(targetFrameId);
      setFrameId(targetFrameId);
      setFrame(attachedFrame);
    }
    return success;
  };

  const detachFromFrame = (): boolean => {
    if (!frameId) return false;
    
    const success = templateFrameService.detachComponent(frameId, componentId);
    if (success) {
      setFrameId(null);
      setFrame(null);
    }
    return success;
  };

  return {
    frameId,
    frame,
    isAttached: frameId !== null,
    attachToFrame,
    detachFromFrame,
  };
}

