/**
 * Unified Canvas Component
 * Single canvas implementation with all required functionality
 * Replaces DraftsmanCanvas and ForgeCanvas
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  ToolType,
  VectorLayer,
  VectorNode,
  AnimationKeyframe,
  FrameState,
  MeasurementUnit,
} from '../types';
import Rulers from './Rulers';

interface CanvasProps {
  // Core props
  svgContent: string;
  layers: VectorLayer[];
  activeTool: ToolType;
  selectedLayerId: string | null;
  selectedNodeId?: string | null;
  zoom: number;
  pan: { x: number; y: number };
  onPan: (pan: { x: number; y: number }) => void;
  onZoom: (zoom: number) => void;
  onSelectLayer: (id: string | null) => void;
  onSelectNode?: (id: string | null) => void;
  onUpdateNode?: (layerId: string, nodeId: string, delta: { x: number; y: number }) => void;

  // Layer operations
  onCreateLayer?: (layer: VectorLayer) => void;
  onUpdateLayer?: (id: string, updates: Partial<VectorLayer>) => void;

  // Animation (optional)
  frameState?: FrameState;
  keyframes?: AnimationKeyframe[];
  onAddKeyframe?: (keyframe: AnimationKeyframe) => void;
  onUpdateKeyframe?: (id: string, properties: Partial<AnimationKeyframe>) => void;
  onInterpolateFrame?: (frame: number, layerId: string) => Partial<VectorLayer>;

  // Canvas settings
  showGuides?: boolean;
  snapToGrid?: boolean;
  snapToGuides?: boolean;
  gridSize?: number;
  measurementUnit?: MeasurementUnit;
  onUnitChange?: (unit: MeasurementUnit) => void;

  // Other
  isGenerating?: boolean;
  guides?: Array<{ id: string; type: 'h' | 'v'; position: number }>;
  onAddGuide?: (type: 'h' | 'v', pos: number) => void;
  onUpdateGuide?: (id: string, pos: number) => void;
  toolProperties?: any;
  isSpacebarDown?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  svgContent,
  layers,
  activeTool,
  selectedLayerId,
  selectedNodeId = null,
  zoom,
  pan,
  onPan,
  onZoom,
  onSelectLayer,
  onSelectNode,
  onUpdateNode,
  onCreateLayer,
  onUpdateLayer,
  frameState,
  keyframes = [],
  onAddKeyframe,
  onUpdateKeyframe,
  onInterpolateFrame,
  showGuides = true,
  snapToGrid = false,
  snapToGuides = false,
  gridSize = 10,
  measurementUnit = 'px',
  onUnitChange,
  isGenerating = false,
  guides = [],
  onAddGuide,
  onUpdateGuide,
  toolProperties,
  isSpacebarDown = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{
    type: 'pan' | 'node' | 'guide' | 'draw';
    id: string;
    startX: number;
    startY: number;
    startPan?: { x: number; y: number };
  } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPath, setDrawPath] = useState<Array<{ x: number; y: number }>>([]);

  const zoomScale = zoom / 100;

  // #region agent log - Measure canvas dimensions after mount
  useEffect(() => {
    if (containerRef.current && canvasViewportRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportRect = canvasViewportRef.current.getBoundingClientRect();
      const containerStyles = getComputedStyle(containerRef.current);
      const viewportStyles = getComputedStyle(canvasViewportRef.current);

      // Check for grid pattern
      const gridPattern = canvasViewportRef.current.querySelector('.canvas-grid-pattern');
      const gridRect = gridPattern?.getBoundingClientRect();
      const gridStyles = gridPattern ? getComputedStyle(gridPattern as HTMLElement) : null;

      // Check for SVG content
      const svgContent = canvasViewportRef.current.querySelector('div[style*="512px"]');
      const svgRect = svgContent?.getBoundingClientRect();
      const svgStyles = svgContent ? getComputedStyle(svgContent as HTMLElement) : null;

      const diagnosticData = {
        container: {
          width: containerRect.width,
          height: containerRect.height,
          display: containerStyles.display,
          visibility: containerStyles.visibility,
          opacity: containerStyles.opacity,
          backgroundColor: containerStyles.backgroundColor,
        },
        viewport: {
          width: viewportRect.width,
          height: viewportRect.height,
          display: viewportStyles.display,
          visibility: viewportStyles.visibility,
          opacity: viewportStyles.opacity,
          backgroundColor: viewportStyles.backgroundColor,
          transform: viewportStyles.transform,
          transformOrigin: viewportStyles.transformOrigin,
        },
        grid: gridPattern
          ? {
              exists: true,
              width: gridRect?.width || 0,
              height: gridRect?.height || 0,
              opacity: gridStyles?.opacity || '0',
              backgroundImage: gridStyles?.backgroundImage || 'none',
              zIndex: gridStyles?.zIndex || '0',
            }
          : { exists: false },
        svgContent: svgContent
          ? {
              exists: true,
              width: svgRect?.width || 0,
              height: svgRect?.height || 0,
              opacity: svgStyles?.opacity || '0',
              visibility: svgStyles?.visibility || 'hidden',
            }
          : { exists: false },
        zoom,
        zoomScale,
        pan,
      };

      console.log('[DEBUG] Canvas comprehensive diagnostic', {
        ...diagnosticData,
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'comprehensive-canvas-diagnostic',
        hypothesisId: 'I',
      });
    }
  }, [zoom, pan, zoomScale]);
  // #endregion
  const selectedLayerData = layers.find(l => l.id === selectedLayerId);

  // Handle wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -10 : 10;
        onZoom(Math.max(10, Math.min(500, zoom + delta)));
      }
    },
    [zoom, onZoom]
  );

  // Handle pointer down
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const target = e.target as HTMLElement;

      // Handle Pan (spacebar, middle mouse, or pan tool)
      if (activeTool === 'pan' || e.button === 1 || isSpacebarDown) {
        setDragState({
          type: 'pan',
          id: '',
          startX: e.clientX,
          startY: e.clientY,
          startPan: pan,
        });
        target.setPointerCapture(e.pointerId);
        return;
      }

      // Handle Guide selection/drag
      if (showGuides && onUpdateGuide) {
        const guideEl = target.closest('[data-guide-id]');
        if (guideEl) {
          const guideId = guideEl.getAttribute('data-guide-id')!;
          setDragState({
            type: 'guide',
            id: guideId,
            startX: e.clientX,
            startY: e.clientY,
          });
          target.setPointerCapture(e.pointerId);
          return;
        }
      }

      // Handle Node selection/drag (Sub-selection mode)
      if (activeTool === 'direct-select' && onSelectNode && onUpdateNode) {
        const nodeEl = target.closest('[data-node-id]');
        if (nodeEl) {
          const nodeId = nodeEl.getAttribute('data-node-id')!;
          onSelectNode(nodeId);
          setDragState({
            type: 'node',
            id: nodeId,
            startX: e.clientX,
            startY: e.clientY,
          });
          target.setPointerCapture(e.pointerId);
          return;
        }
      }

      // Handle Object selection
      if ((activeTool === 'select' || activeTool === 'direct-select') && !isGenerating) {
        let current: SVGElement | null = e.target as SVGElement;
        while (current && current.tagName !== 'DIV') {
          if (
            current.id &&
            current.id !== 'bg' &&
            current.id !== 'workspace_root' &&
            current.tagName !== 'svg'
          ) {
            onSelectLayer(current.id);
            if (activeTool !== 'direct-select' && onSelectNode) {
              onSelectNode(null);
            }
            return;
          }
          current = current.parentElement as unknown as SVGElement;
        }
        onSelectLayer(null);
        if (onSelectNode) onSelectNode(null);
      }

      // Handle drawing tools (basic implementation)
      if (
        ['pen', 'pencil', 'brush', 'line', 'rectangle', 'ellipse'].includes(activeTool) &&
        onCreateLayer
      ) {
        const rect = canvasViewportRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left - rect.width / 2) / zoomScale;
          const y = (e.clientY - rect.top - rect.height / 2) / zoomScale;
          setIsDrawing(true);
          setDrawPath([{ x, y }]);
          setDragState({
            type: 'draw',
            id: '',
            startX: e.clientX,
            startY: e.clientY,
          });
          target.setPointerCapture(e.pointerId);
        }
      }
    },
    [
      activeTool,
      isSpacebarDown,
      pan,
      showGuides,
      onUpdateGuide,
      onSelectNode,
      onUpdateNode,
      isGenerating,
      onSelectLayer,
      onCreateLayer,
      zoomScale,
    ]
  );

  // Handle pointer move
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState) return;

      const dx = (e.clientX - dragState.startX) / zoomScale;
      const dy = (e.clientY - dragState.startY) / zoomScale;

      if (dragState.type === 'pan' && dragState.startPan) {
        onPan({
          x: dragState.startPan.x + (e.clientX - dragState.startX),
          y: dragState.startPan.y + (e.clientY - dragState.startY),
        });
      } else if (dragState.type === 'node' && selectedLayerId && onUpdateNode) {
        onUpdateNode(selectedLayerId, dragState.id, { x: dx, y: dy });
      } else if (dragState.type === 'guide' && onUpdateGuide) {
        const guide = guides.find(g => g.id === dragState.id);
        if (guide) {
          const val = guide.type === 'v' ? dx : dy;
          onUpdateGuide(dragState.id, guide.position + val);
        }
      } else if (dragState.type === 'draw' && isDrawing) {
        const rect = canvasViewportRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left - rect.width / 2) / zoomScale;
          const y = (e.clientY - rect.top - rect.height / 2) / zoomScale;
          setDrawPath(prev => [...prev, { x, y }]);
        }
      }
    },
    [dragState, zoomScale, onPan, selectedLayerId, onUpdateNode, onUpdateGuide, guides, isDrawing]
  );

  // Handle pointer up
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragState?.type === 'draw' && isDrawing && onCreateLayer && drawPath.length > 0) {
        const startPoint = drawPath[0];
        const endPoint = drawPath[drawPath.length - 1];
        const minX = Math.min(startPoint.x, endPoint.x);
        const minY = Math.min(startPoint.y, endPoint.y);
        const maxX = Math.max(startPoint.x, endPoint.x);
        const maxY = Math.max(startPoint.y, endPoint.y);
        const width = maxX - minX;
        const height = maxY - minY;

        let newLayer: VectorLayer;

        // Create proper shape based on tool type
        if (activeTool === 'rectangle') {
          newLayer = {
            id: `layer-${Date.now()}`,
            name: `Rectangle ${Date.now()}`,
            visible: true,
            locked: false,
            opacity: 1,
            blendMode: 'normal',
            color: toolProperties?.fill || '#ffffff',
            stroke: toolProperties?.stroke || '#000000',
            strokeWidth: toolProperties?.strokeWidth || 1,
            shape: {
              type: 'rect',
              x: minX,
              y: minY,
              width,
              height,
              borderRadius: 0,
            },
          };
        } else if (activeTool === 'ellipse') {
          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;
          const radiusX = Math.abs(width / 2);
          const radiusY = Math.abs(height / 2);
          newLayer = {
            id: `layer-${Date.now()}`,
            name: `Ellipse ${Date.now()}`,
            visible: true,
            locked: false,
            opacity: 1,
            blendMode: 'normal',
            color: toolProperties?.fill || '#ffffff',
            stroke: toolProperties?.stroke || '#000000',
            strokeWidth: toolProperties?.strokeWidth || 1,
            shape: {
              type: 'ellipse',
              x: centerX,
              y: centerY,
              radiusX,
              radiusY,
            },
          };
        } else {
          // Default: create path for pen, pencil, brush, line
          newLayer = {
            id: `layer-${Date.now()}`,
            name: `${activeTool} ${Date.now()}`,
            visible: true,
            locked: false,
            opacity: 1,
            blendMode: 'normal',
            color: toolProperties?.fill || '#ffffff',
            stroke: toolProperties?.stroke || '#000000',
            strokeWidth: toolProperties?.strokeWidth || 1,
            shape: {
              type: 'path',
              nodes: drawPath.map((p, i) => ({
                id: `node-${i}`,
                type: i === 0 ? 'move' : 'line',
                x: p.x,
                y: p.y,
                isKinetic: false,
              })),
            },
          };
        }

        onCreateLayer(newLayer);
        setIsDrawing(false);
        setDrawPath([]);
      }
      setDragState(null);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    },
    [dragState, isDrawing, drawPath, onCreateLayer, activeTool, toolProperties]
  );

  // #region agent log - Canvas render verification
  useEffect(() => {
    console.log('[DEBUG] Canvas component RENDERED', {
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'test-fixes',
      hypothesisId: 'A',
      props: {
        hasSvgContent: !!svgContent,
        layersCount: layers.length,
        activeTool,
        zoom,
        showGuides,
        snapToGrid,
        gridSize,
        hasFrameState: !!frameState,
        keyframesCount: keyframes.length,
      },
    });
  }, [
    svgContent,
    layers.length,
    activeTool,
    zoom,
    showGuides,
    snapToGrid,
    gridSize,
    frameState,
    keyframes.length,
  ]);
  // #endregion

  // #region agent log - Canvas return render
  console.log('[DEBUG] Canvas: About to return JSX', {
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'test-ui-fixes',
    hypothesisId: 'E',
    data: { hasContainerRef: !!containerRef.current, showGuides, snapToGrid, gridSize },
  });
  // #endregion

  // #region agent log - Canvas container dimensions
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const styles = getComputedStyle(containerRef.current);
      console.log('[DEBUG] Canvas container dimensions', {
        width: rect.width,
        height: rect.height,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        position: styles.position,
        zIndex: styles.zIndex,
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'measure-canvas-container-dimensions',
        hypothesisId: 'J',
      });
    }
  }, []);
  // #endregion

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden flex items-center justify-center select-none"
      style={{
        cursor: activeTool === 'pan' || isSpacebarDown ? 'grab' : 'default',
        position: 'relative', // FIXED: Relative to respect flex layout, not absolute
        width: '100%',
        height: '100%',
        maxWidth: '100%', // CRITICAL: Prevent horizontal overflow
        maxHeight: '100%', // CRITICAL: Prevent vertical overflow
        zIndex: 1,
        contain: 'layout style paint',
        backgroundColor: 'var(--xibalba-grey-000)', // Match canvas area background
        display: 'flex',
        flexDirection: 'column', // CRITICAL: Stack rulers and viewport vertically
        visibility: 'visible',
        opacity: 1,
        flex: '1 1 0%', // FIXED: Respect flex layout
        minHeight: 0, // FIXED: Allow flex child to shrink
        minWidth: 0, // CRITICAL: Allow flex child to shrink horizontally
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* Rulers */}
      {onAddGuide && (
        <Rulers zoom={zoom} pan={pan} onAddGuide={(type, pos) => onAddGuide(type, pos)} />
      )}

      {/* Interactive Guides */}
      {showGuides &&
        guides.length > 0 &&
        guides.map(g => (
          <div
            key={g.id}
            data-guide-id={g.id}
            className={`absolute z-[55] cursor-${g.type === 'v' ? 'col-resize' : 'row-resize'} group guide-line ${
              g.type === 'v' ? 'guide-vertical' : 'guide-horizontal'
            }`}
            style={{
              [g.type === 'v' ? 'left' : 'top']:
                `${pan[g.type === 'v' ? 'x' : 'y'] + g.position * zoomScale}px`,
              [g.type === 'v' ? 'width' : 'height']: '1px',
              [g.type === 'v' ? 'height' : 'width']: '100%',
            }}
          >
            <div
              className={`absolute ${
                g.type === 'v' ? 'left-1/2 h-full w-px border-l' : 'top-1/2 w-full h-px border-t'
              } border-[var(--xibalba-text-200)] transition-opacity opacity-20 group-hover:opacity-100`}
            />
          </div>
        ))}

      {/* Canvas Viewport - Fills entire container, rulers overlay on top */}
      <div
        ref={canvasViewportRef}
        className="canvas-viewport"
        style={{
          position: 'relative', // FIXED: Relative to respect flex layout
          width: '100%',
          height: '100%',
          maxWidth: '100%', // CRITICAL: Prevent horizontal overflow
          maxHeight: '100%', // CRITICAL: Prevent vertical overflow
          display: 'block',
          visibility: 'visible',
          overflow: 'hidden',
          backgroundColor: 'var(--xibalba-grey-000)',
          flex: '1 1 0%', // FIXED: Fill available space in flex container
          minHeight: 0, // FIXED: Allow flex child to shrink
          minWidth: 0, // CRITICAL: Allow flex child to shrink horizontally
        }}
      >
        {/* Grid Pattern - Always visible, subtle opacity */}
        <div
          className="canvas-grid-pattern"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.5, // Increased from 0.30 for better visibility
            display: 'block',
            backgroundSize: `${gridSize}px ${gridSize}px`,
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)`, // Increased from 0.06 to 0.12
            zIndex: 0,
          }}
          aria-hidden="true"
        />

        {/* Optional empty state (centered when no nodes) */}
        {(!svgContent ||
          svgContent.trim() ===
            '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0a0b0e"/></svg>') && (
          <div
            className="canvas-empty-state"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'rgba(255,255,255,0.9)', // Increased from 0.6 for better readability
              fontSize: 14,
              zIndex: 2,
              pointerEvents: 'none',
              textAlign: 'center',
            }}
            aria-hidden="true"
          >
            <div
              style={{
                fontSize: '18px',
                marginBottom: '8px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.95)',
              }}
            >
              Enter a prompt to start
            </div>
            <div style={{ fontSize: '12px', opacity: 0.85, color: 'rgba(255,255,255,0.8)' }}>
              Start creating by selecting a tool from the left sidebar or generating vectors with
              AI.
            </div>
          </div>
        )}

        {/* Canvas content (SVG / layers) — above grid */}
        <div
          className="canvas-svg-content pointer-events-auto"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'block',
            visibility: 'visible',
            opacity: isGenerating ? 0.1 : 1,
            transition: isGenerating ? 'opacity 0.5s, filter 0.5s' : 'none',
            filter: isGenerating ? 'blur(8px) grayscale(100%)' : 'none',
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Selection Bounding Box */}
        {selectedLayerId && activeTool === 'select' && (
          <div className="absolute w-[512px] h-[512px] pointer-events-none border border-[var(--xibalba-text-200)]/50 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <div className="absolute -top-1 -left-1 size-2.5 bg-[var(--xibalba-text-200)] border border-[var(--xibalba-text-100)]" />
            <div className="absolute -top-1 -right-1 size-2.5 bg-[var(--xibalba-text-200)] border border-[var(--xibalba-text-100)]" />
            <div className="absolute -bottom-1 -left-1 size-2.5 bg-[var(--xibalba-text-200)] border border-[var(--xibalba-text-100)]" />
            <div className="absolute -bottom-1 -right-1 size-2.5 bg-[var(--xibalba-text-200)] border border-[var(--xibalba-text-100)]" />
          </div>
        )}

        {/* Node Handles (Direct Select Mode) */}
        {selectedLayerId &&
          activeTool === 'direct-select' &&
          selectedLayerData &&
          selectedLayerData.shape.type === 'path' &&
          selectedLayerData.shape.nodes && (
            <div className="absolute w-[512px] h-[512px] pointer-events-none">
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                <path
                  d={selectedLayerData.shape.nodes.reduce((acc, n) => {
                    if (n.type === 'move') return `M ${n.x} ${n.y}`;
                    if (n.type === 'line') return `${acc} L ${n.x} ${n.y}`;
                    if (n.type === 'cubic')
                      return `${acc} C ${n.cx1} ${n.cy1}, ${n.cx2} ${n.cy2}, ${n.x} ${n.y}`;
                    if (n.type === 'close') return `${acc} Z`;
                    return acc;
                  }, '')}
                  fill="none"
                  stroke="var(--xibalba-text-200)"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  opacity="0.4"
                />
              </svg>
              {selectedLayerData.shape.nodes.map(node => (
                <div
                  key={node.id}
                  data-node-id={node.id}
                  className={`absolute pointer-events-auto cursor-crosshair transition-all hover:scale-150 node-handle ${
                    node.isKinetic ? 'rounded-none border-[2px]' : 'rounded-none border-[1.5px]'
                  } ${
                    selectedNodeId === node.id
                      ? 'bg-[var(--xibalba-text-200)] border-[var(--xibalba-text-000)] scale-125 z-10'
                      : 'bg-[var(--xibalba-text-200)] border-[var(--xibalba-text-100)] opacity-80'
                  }`}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    transform: 'translate(-50%, -50%)',
                    width: '8px',
                    height: '8px',
                  }}
                />
              ))}
            </div>
          )}

        {/* Drawing Preview */}
        {isDrawing && drawPath.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d={`M ${drawPath[0].x} ${drawPath[0].y} ${drawPath
                .slice(1)
                .map(p => `L ${p.x} ${p.y}`)
                .join(' ')}`}
              fill="none"
              stroke="var(--xibalba-text-200)"
              strokeWidth="2"
              opacity="0.6"
            />
          </svg>
        )}

        {/* Generating Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center zstack-scanning-overlay bg-[var(--xibalba-grey-100)]/95 backdrop-blur-3xl ai-scanning">
            <div className="size-16 border-[4px] border-[var(--xibalba-text-200)]/20 border-t-[var(--xibalba-text-200)] rounded-none animate-spin" />
            <span className="mt-6 text-sm font-black text-[var(--xibalba-text-100)] tracking-[0.5em] uppercase">
              Kernel Link Active
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
