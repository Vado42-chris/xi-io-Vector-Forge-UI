/**
 * Brush Tool - React Adapter
 * Connects BrushTool core to React/Canvas
 * 
 * #hashtag: tools brush react adapter
 */

import React, { useRef, useEffect, useCallback } from 'react';
import BrushTool, { BrushStroke, BrushPoint, BrushConfig } from '../../lib/tools/brush';

export interface BrushToolProps {
  /** Canvas element ref */
  canvasRef: React.RefObject<HTMLDivElement>;
  /** Tool configuration */
  config?: BrushConfig;
  /** Callback when stroke completes */
  onStrokeComplete?: (stroke: BrushStroke) => void;
  /** Callback for undo */
  onUndo?: (stroke: BrushStroke) => void;
  /** Callback for redo */
  onRedo?: (stroke: BrushStroke) => void;
  /** Whether tool is active */
  active?: boolean;
  /** Keyboard shortcut */
  shortcut?: string;
}

/**
 * Brush Tool React Component
 * Handles pointer events and renders strokes
 */
export const BrushToolComponent: React.FC<BrushToolProps> = ({
  canvasRef,
  config = {},
  onStrokeComplete,
  onUndo,
  onRedo,
  active = false,
  shortcut = 'B',
}) => {
  const brushToolRef = useRef<BrushTool | null>(null);
  const isDrawingRef = useRef(false);
  const previewPathRef = useRef<SVGPathElement | null>(null);

  // Initialize brush tool
  useEffect(() => {
    if (!brushToolRef.current) {
      brushToolRef.current = new BrushTool(config);
    } else {
      brushToolRef.current.updateConfig(config);
    }
  }, [config]);

  // Get canvas coordinates from pointer event
  const getCanvasCoords = useCallback((clientX: number, clientY: number): { x: number; y: number } | null => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, [canvasRef]);

  // Handle pointer down
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!active || !brushToolRef.current) return;
    
    const coords = getCanvasCoords(e.clientX, e.clientY);
    if (!coords) return;

    e.preventDefault();
    isDrawingRef.current = true;
    
    // Get pressure from pointer event if available
    const pressure = e.pointerType === 'pen' ? e.pressure : undefined;
    brushToolRef.current.startStroke(coords.x, coords.y, pressure);
  }, [active, getCanvasCoords]);

  // Handle pointer move
  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!active || !isDrawingRef.current || !brushToolRef.current) return;
    
    const coords = getCanvasCoords(e.clientX, e.clientY);
    if (!coords) return;

    const pressure = e.pointerType === 'pen' ? e.pressure : undefined;
    brushToolRef.current.addPoint(coords.x, coords.y, pressure);

    // Update preview path
    const currentStroke = brushToolRef.current.getCurrentStroke();
    if (currentStroke.length > 1 && previewPathRef.current) {
      const pathData = brushToolRef.current.strokeToSvgPath({
        id: 'preview',
        points: currentStroke,
        minWidth: brushToolRef.current.getConfig().minWidth,
        maxWidth: brushToolRef.current.getConfig().maxWidth,
        color: brushToolRef.current.getConfig().color,
        opacity: brushToolRef.current.getConfig().opacity,
        startTime: currentStroke[0]?.timestamp || 0,
        endTime: currentStroke[currentStroke.length - 1]?.timestamp || 0,
      });
      previewPathRef.current.setAttribute('d', pathData);
    }
  }, [active, getCanvasCoords]);

  // Handle pointer up
  const handlePointerUp = useCallback(() => {
    if (!isDrawingRef.current || !brushToolRef.current) return;
    
    isDrawingRef.current = false;
    const stroke = brushToolRef.current.endStroke();
    
    if (stroke && onStrokeComplete) {
      onStrokeComplete(stroke);
    }

    // Clear preview
    if (previewPathRef.current) {
      previewPathRef.current.setAttribute('d', '');
    }
  }, [onStrokeComplete]);

  // Set up pointer event listeners
  useEffect(() => {
    if (!active) return;

    const handleMove = (e: PointerEvent) => handlePointerMove(e);
    const handleUp = () => handlePointerUp();

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [active, handlePointerMove, handlePointerUp]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === shortcut.toLowerCase() && e.ctrlKey) {
        e.preventDefault();
        if (e.shiftKey && brushToolRef.current) {
          // Ctrl+Shift+B = Redo
          const stroke = brushToolRef.current.redo();
          if (stroke && onRedo) {
            onRedo(stroke);
          }
        } else if (brushToolRef.current) {
          // Ctrl+B = Undo
          const stroke = brushToolRef.current.undo();
          if (stroke && onUndo) {
            onUndo(stroke);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, shortcut, onUndo, onRedo]);

  // Render strokes
  const renderStrokes = useCallback(() => {
    if (!brushToolRef.current || !canvasRef.current) return null;

    const strokes = brushToolRef.current.getStrokes();
    const config = brushToolRef.current.getConfig();

    return (
      <g className="brush-strokes">
        {strokes.map((stroke) => {
          const pathData = brushToolRef.current!.strokeToSvgPath(stroke);
          const avgPressure = stroke.points.reduce((sum, p) => sum + p.pressure, 0) / stroke.points.length;
          const strokeWidth = brushToolRef.current!.getStrokeWidth(avgPressure);

          return (
            <path
              key={stroke.id}
              d={pathData}
              fill="none"
              stroke={stroke.color}
              strokeWidth={strokeWidth}
              strokeOpacity={stroke.opacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
        {/* Preview path */}
        <path
          ref={previewPathRef}
          className="brush-preview"
          fill="none"
          stroke={config.color}
          strokeWidth={(config.minWidth + config.maxWidth) / 2}
          strokeOpacity={config.opacity * 0.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  }, [canvasRef]);

  if (!active) {
    return null;
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      className="absolute inset-0 pointer-events-auto"
      aria-label={`Brush tool (${shortcut})`}
      role="button"
      tabIndex={0}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {renderStrokes()}
      </svg>
    </div>
  );
};

export default BrushToolComponent;


