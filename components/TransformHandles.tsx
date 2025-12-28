/**
 * Professional Transform Handles
 * Visual transform controls for selected objects
 * Like Illustrator/Inkscape - handles for scale, rotate, move
 * NO INLINE STYLES - Component-based platform
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { VectorLayer } from '../types';

interface TransformHandlesProps {
  layer: VectorLayer;
  zoom: number;
  onTransform: (transform: { x?: number; y?: number; width?: number; height?: number; rotation?: number }) => void;
  onTransformStart?: () => void;
  onTransformEnd?: () => void;
}

const TransformHandles: React.FC<TransformHandlesProps> = ({
  layer, zoom, onTransform, onTransformStart, onTransformEnd
}) => {
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, initial: { x: 0, y: 0, width: 0, height: 0 } });
  const handlesRef = useRef<HTMLDivElement>(null);

  // Calculate bounding box
  const getBoundingBox = useCallback(() => {
    if (layer.shape.type === 'rect') {
      const rect = layer.shape;
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      };
    } else if (layer.shape.type === 'path' && layer.shape.nodes.length > 0) {
      const nodes = layer.shape.nodes;
      const xs = nodes.map(n => n.x);
      const ys = nodes.map(n => n.y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    }
    return { x: 0, y: 0, width: 100, height: 100 };
  }, [layer]);

  const bbox = getBoundingBox();
  const handleSize = Math.max(8, 8 / (zoom / 100));

  const handlePointerDown = useCallback((e: React.PointerEvent, handleType: string) => {
    e.stopPropagation();
    setIsDragging(handleType);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      initial: { ...bbox }
    });
    onTransformStart?.();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [bbox, onTransformStart]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging) return;

    const deltaX = (e.clientX - dragStart.x) / zoom * 100;
    const deltaY = (e.clientY - dragStart.y) / zoom * 100;

    switch (isDragging) {
      case 'move':
        onTransform({
          x: dragStart.initial.x + deltaX,
          y: dragStart.initial.y + deltaY
        });
        break;
      
      case 'nw': // Top-left
        onTransform({
          x: dragStart.initial.x + deltaX,
          y: dragStart.initial.y + deltaY,
          width: dragStart.initial.width - deltaX,
          height: dragStart.initial.height - deltaY
        });
        break;
      
      case 'ne': // Top-right
        onTransform({
          y: dragStart.initial.y + deltaY,
          width: dragStart.initial.width + deltaX,
          height: dragStart.initial.height - deltaY
        });
        break;
      
      case 'sw': // Bottom-left
        onTransform({
          x: dragStart.initial.x + deltaX,
          width: dragStart.initial.width - deltaX,
          height: dragStart.initial.height + deltaY
        });
        break;
      
      case 'se': // Bottom-right
        onTransform({
          width: dragStart.initial.width + deltaX,
          height: dragStart.initial.height + deltaY
        });
        break;
      
      case 'n': // Top
        onTransform({
          y: dragStart.initial.y + deltaY,
          height: dragStart.initial.height - deltaY
        });
        break;
      
      case 's': // Bottom
        onTransform({
          height: dragStart.initial.height + deltaY
        });
        break;
      
      case 'e': // Right
        onTransform({
          width: dragStart.initial.width + deltaX
        });
        break;
      
      case 'w': // Left
        onTransform({
          x: dragStart.initial.x + deltaX,
          width: dragStart.initial.width - deltaX
        });
        break;
    }
  }, [isDragging, dragStart, zoom, onTransform]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (isDragging) {
      setIsDragging(null);
      onTransformEnd?.();
      if (e.target instanceof HTMLElement) {
        e.target.releasePointerCapture(e.pointerId);
      }
    }
  }, [isDragging, onTransformEnd]);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Update handle size CSS variable
  useEffect(() => {
    if (handlesRef.current) {
      handlesRef.current.style.setProperty('--handle-size', `${handleSize}px`);
    }
  }, [handleSize]);

  const handleStyle = {
    width: `${handleSize}px`,
    height: `${handleSize}px`,
    border: '2px solid var(--xibalba-text-200)',
    backgroundColor: 'var(--xibalba-grey-050)',
    cursor: 'pointer'
  };

  const cornerHandleStyle = {
    ...handleStyle,
    cursor: isDragging?.includes('nw') ? 'nwse-resize' : 
            isDragging?.includes('ne') ? 'nesw-resize' :
            isDragging?.includes('sw') ? 'nesw-resize' :
            isDragging?.includes('se') ? 'nwse-resize' : 'default'
  };

  // Update CSS variables for transform handles
  useEffect(() => {
    if (handlesRef.current) {
      handlesRef.current.style.setProperty('--transform-left', `${bbox.x}px`);
      handlesRef.current.style.setProperty('--transform-top', `${bbox.y}px`);
      handlesRef.current.style.setProperty('--transform-width', `${bbox.width}px`);
      handlesRef.current.style.setProperty('--transform-height', `${bbox.height}px`);
      handlesRef.current.style.setProperty('--transform-scale', `${zoom / 100}`);
    }
  }, [bbox, zoom]);

  return (
    <div
      ref={handlesRef}
      className="absolute pointer-events-none z-50 transform-handle-container"
    >
      {/* Corner Handles */}
      <div
        className="absolute pointer-events-auto transform-handle-corner nw cursor-nwse-resize"
        onPointerDown={(e) => handlePointerDown(e, 'nw')}
        title="Resize top-left"
      />
      <div
        className="absolute pointer-events-auto transform-handle-corner ne cursor-nesw-resize"
        onPointerDown={(e) => handlePointerDown(e, 'ne')}
        title="Resize top-right"
      />
      <div
        className="absolute pointer-events-auto transform-handle-corner sw cursor-nesw-resize"
        onPointerDown={(e) => handlePointerDown(e, 'sw')}
        title="Resize bottom-left"
      />
      <div
        className="absolute pointer-events-auto transform-handle-corner se cursor-nwse-resize"
        onPointerDown={(e) => handlePointerDown(e, 'se')}
        title="Resize bottom-right"
      />

      {/* Edge Handles */}
      <div
        className="absolute pointer-events-auto transform-handle-edge n cursor-ns-resize"
        onPointerDown={(e) => handlePointerDown(e, 'n')}
        title="Resize top"
      />
      <div
        className="absolute pointer-events-auto transform-handle-edge s cursor-ns-resize"
        onPointerDown={(e) => handlePointerDown(e, 's')}
        title="Resize bottom"
      />
      <div
        className="absolute pointer-events-auto transform-handle-edge w cursor-ew-resize"
        onPointerDown={(e) => handlePointerDown(e, 'w')}
        title="Resize left"
      />
      <div
        className="absolute pointer-events-auto transform-handle-edge e cursor-ew-resize"
        onPointerDown={(e) => handlePointerDown(e, 'e')}
        title="Resize right"
      />

      {/* Center Move Handle */}
      <div
        className="absolute pointer-events-auto transform-handle-center cursor-move"
        onPointerDown={(e) => handlePointerDown(e, 'move')}
        title="Move"
      />
    </div>
  );
};

export default TransformHandles;

