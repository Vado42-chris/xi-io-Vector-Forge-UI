/**
 * Professional Draftsman's Table Canvas
 * Power user tool with functional rulers, guides, snap, and animation support
 * NO INLINE STYLES - Component-based platform
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ToolType, VectorLayer, AnimationKeyframe, FrameState, MeasurementUnit, VectorNode } from '../types';
import ProfessionalRulers from './ProfessionalRulers';
import TransformHandles from './TransformHandles';
import NodeEditor from './NodeEditor';
import ErrorBoundary from './ErrorBoundary';
import { createCanvasCoordinateConverter, screenToWorld } from '../utils/coordinateConverter';
import { CoordinateConverter } from '../lib/ourmaths/CoordinateFrame';
import { BrushToolComponent } from './tools/BrushTool';

interface DraftsmanCanvasProps {
  svgContent: string;
  layers: VectorLayer[];
  activeTool: ToolType;
  selectedLayerId: string | null;
  zoom: number;
  pan: { x: number; y: number };
  onPan: (pan: { x: number; y: number }) => void;
  onZoom: (zoom: number) => void;
  onSelectLayer: (id: string) => void;
  onCreateLayer: (layer: VectorLayer) => void;
  onUpdateLayer: (id: string, updates: Partial<VectorLayer>) => void;
  frameState: FrameState;
  keyframes: AnimationKeyframe[];
  onAddKeyframe: (keyframe: AnimationKeyframe) => void;
  onUpdateKeyframe: (id: string, properties: Partial<AnimationKeyframe>) => void;
  onInterpolateFrame?: (frame: number, layerId: string) => Partial<VectorLayer>;
  showGuides: boolean;
  snapToGrid: boolean;
  snapToGuides: boolean;
  gridSize: number;
  measurementUnit: MeasurementUnit;
  onUnitChange: (unit: MeasurementUnit) => void;
  toolProperties?: any;
  isSpacebarDown?: boolean;
}

const DraftsmanCanvas: React.FC<DraftsmanCanvasProps> = ({
  svgContent, layers, activeTool, selectedLayerId, zoom, pan, onPan, onZoom,
  onSelectLayer, onCreateLayer, onUpdateLayer, frameState, keyframes, onAddKeyframe, onUpdateKeyframe,
  onInterpolateFrame,
  showGuides, snapToGrid, snapToGuides, gridSize, measurementUnit, onUnitChange, toolProperties, isSpacebarDown = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const canvasContentRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [guides, setGuides] = useState<Array<{ id: string; type: 'h' | 'v'; position: number }>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPath, setDrawPath] = useState<Array<{ x: number; y: number }>>([]);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);

  const canvasWidth = 1920;
  const canvasHeight = 1080;
  const zoomScale = zoom / 100;

  // Create coordinate converter for canvas
  const coordinateConverter = useMemo(() => {
    if (!canvasContentRef.current) return null;
    const rect = canvasContentRef.current.getBoundingClientRect();
    // Only create converter if canvas has valid dimensions
    if (rect.width === 0 || rect.height === 0) return null;
    return createCanvasCoordinateConverter(pan, zoom, rect);
  }, [pan, zoom, canvasSize.width, canvasSize.height]);

  // Update coordinate converter when canvas dimensions change
  useEffect(() => {
    if (!canvasContentRef.current) return;
    
    const updateSize = () => {
      const rect = canvasContentRef.current?.getBoundingClientRect();
      if (rect && (rect.width !== canvasSize.width || rect.height !== canvasSize.height)) {
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    // Initial size check
    updateSize();

    // Use ResizeObserver to detect canvas size changes
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(canvasContentRef.current);

    // Also listen for window resize
    window.addEventListener('resize', updateSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [canvasSize.width, canvasSize.height]);

  // Update CSS variables for dynamic styles
  useEffect(() => {
    if (gridRef.current) {
      const scaledGridSize = Math.max(1, gridSize * zoomScale);
      // Calculate grid offset to keep grid aligned when panning
      const offsetX = ((pan.x % scaledGridSize) + scaledGridSize) % scaledGridSize;
      const offsetY = ((pan.y % scaledGridSize) + scaledGridSize) % scaledGridSize;
      gridRef.current.style.setProperty('--grid-size', `${scaledGridSize}px`);
      gridRef.current.style.setProperty('--grid-offset-x', `${offsetX}px`);
      gridRef.current.style.setProperty('--grid-offset-y', `${offsetY}px`);
    }
    if (canvasContentRef.current) {
      canvasContentRef.current.style.setProperty('--canvas-pan-x', `${pan.x}px`);
      canvasContentRef.current.style.setProperty('--canvas-pan-y', `${pan.y}px`);
      canvasContentRef.current.style.setProperty('--canvas-zoom-scale', `${zoomScale}`);
      canvasContentRef.current.style.setProperty('--canvas-width', `${canvasWidth}px`);
      canvasContentRef.current.style.setProperty('--canvas-height', `${canvasHeight}px`);
    }
  }, [pan, zoomScale, gridSize, canvasWidth, canvasHeight]);

  // Snap to Grid
  const snapValue = useCallback((value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  // Snap to Guides
  const snapToGuide = useCallback((value: number, axis: 'x' | 'y') => {
    if (!snapToGuides) return value;
    const relevantGuides = guides.filter(g => 
      axis === 'x' ? g.type === 'v' : g.type === 'h'
    );
    const threshold = 5;
    for (const guide of relevantGuides) {
      if (Math.abs(value - guide.position) < threshold) {
        return guide.position;
      }
    }
    return value;
  }, [snapToGuides, guides]);

  // Get canvas coordinates from screen coordinates
  // MIGRATED: Now uses ourmaths coordinate frame system
  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    if (!canvasContentRef.current || !coordinateConverter) {
      return { x: 0, y: 0 };
    }
    const rect = canvasContentRef.current.getBoundingClientRect();
    return screenToWorld(clientX, clientY, coordinateConverter, rect);
  }, [coordinateConverter]);

  // Handle Canvas Interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    const canvasCoords = getCanvasCoords(e.clientX, e.clientY);
    const snappedX = snapToGuide(snapValue(canvasCoords.x), 'x');
    const snappedY = snapToGuide(snapValue(canvasCoords.y), 'y');

    // Pan tool, spacebar, middle mouse, or Ctrl+drag
    if (activeTool === 'pan' || isSpacebarDown || e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
      return;
    }

    // Drawing tools
    if (['pen', 'pencil', 'brush', 'line', 'rectangle', 'ellipse', 'polygon', 'star', 'spiral'].includes(activeTool)) {
      setIsDrawing(true);
      setDrawStart({ x: snappedX, y: snappedY });
      setDrawPath([{ x: snappedX, y: snappedY }]);
      e.preventDefault();
      return;
    }

    // Selection tools
    if (['select', 'direct-select', 'group-select'].includes(activeTool)) {
      // Check if clicking on an existing layer (hit testing)
      let clickedLayer: VectorLayer | null = null;
      
      // Test layers in reverse order (top to bottom)
      for (let i = layers.length - 1; i >= 0; i--) {
        const l = layers[i];
        if (!l.visible || l.locked) continue;
        
        if (l.shape.type === 'rect') {
          const rect = l.shape;
          if (snappedX >= rect.x && snappedX <= rect.x + rect.width &&
              snappedY >= rect.y && snappedY <= rect.y + rect.height) {
            clickedLayer = l;
            break;
          }
        } else if (l.shape.type === 'path' && l.shape.nodes && Array.isArray(l.shape.nodes) && l.shape.nodes.length > 0) {
          // Simple bounding box check for paths - FIXED: Added null checks and validation
          const validNodes = l.shape.nodes.filter(n => n && typeof n.x === 'number' && typeof n.y === 'number' && Number.isFinite(n.x) && Number.isFinite(n.y));
          if (validNodes.length > 0) {
            const xs = validNodes.map(n => n.x);
            const ys = validNodes.map(n => n.y);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            if (snappedX >= minX && snappedX <= maxX &&
                snappedY >= minY && snappedY <= maxY) {
              clickedLayer = l;
              break;
            }
          }
        }
      }
      
      if (clickedLayer) {
        onSelectLayer(clickedLayer.id);
      } else {
        // Clear selection - onSelectLayer doesn't accept null, so we pass empty string
        onSelectLayer('');
      }
      e.preventDefault();
      return;
    }
  };

  // Use window-level pointer events for proper dragging
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Pan (hand tool, spacebar, middle mouse, or Ctrl+drag)
      if (isDragging && (activeTool === 'pan' || isSpacebarDown || e.button === 1 || e.ctrlKey)) {
        onPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
        return;
      }

      // Drawing
      if (isDrawing && drawStart && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const canvasCoords = getCanvasCoords(e.clientX, e.clientY);
        const snappedX = snapToGuide(snapValue(canvasCoords.x), 'x');
        const snappedY = snapToGuide(snapValue(canvasCoords.y), 'y');
        
        if (['pen', 'pencil', 'brush', 'line'].includes(activeTool)) {
          setDrawPath(prev => [...prev, { x: snappedX, y: snappedY }]);
        } else if (['rectangle', 'ellipse'].includes(activeTool)) {
          setDrawPath([drawStart, { x: snappedX, y: snappedY }]);
        }
      }
    };

    const handlePointerUp = () => {
      if (isDrawing && drawStart && drawPath.length > 0) {
      // Create layer from drawing
      let newLayer: VectorLayer | null = null;

      if (activeTool === 'rectangle' && drawPath.length === 2) {
        const [start, end] = drawPath;
        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);
        const cornerRadius = toolProperties?.rectangle?.cornerRadius || 0;
        
          // Only create if size is meaningful
          if (width > 0 && height > 0) {
            newLayer = {
              id: `layer_${Date.now()}`,
              name: `Rectangle ${layers.length + 1}`,
              visible: true,
              locked: false,
              color: toolProperties?.fill || 'var(--xibalba-text-000)',
              stroke: toolProperties?.stroke || 'var(--xibalba-accent)',
              strokeWidth: toolProperties?.strokeWidth || 1,
              opacity: toolProperties?.opacity || 1,
              blendMode: 'normal',
              shape: {
                type: 'rect',
                x, y, width, height,
                borderRadius: cornerRadius
              }
            };
          }
      } else if (activeTool === 'ellipse' && drawPath.length === 2) {
        const [start, end] = drawPath;
        const cx = (start.x + end.x) / 2;
        const cy = (start.y + end.y) / 2;
        const rx = Math.abs(end.x - start.x) / 2;
        const ry = Math.abs(end.y - start.y) / 2;
        
        // Only create if size is meaningful
        if (rx > 0 && ry > 0) {
          // Convert ellipse to path using proper Bezier approximation
          const kappa = 0.5522848; // Magic number for circle approximation
          const nodes: VectorNode[] = [
            { id: '1', type: 'move', x: cx + rx, y: cy },
            { id: '2', type: 'cubic', x: cx + rx, y: cy - ry, cx1: cx + rx, cy1: cy - ry * kappa, cx2: cx + rx * kappa, cy2: cy - ry },
            { id: '3', type: 'cubic', x: cx - rx, y: cy, cx1: cx - rx * kappa, cy1: cy - ry, cx2: cx - rx, cy2: cy - ry * kappa },
            { id: '4', type: 'cubic', x: cx - rx, y: cy + ry, cx1: cx - rx, cy1: cy + ry * kappa, cx2: cx - rx * kappa, cy2: cy + ry },
            { id: '5', type: 'cubic', x: cx + rx, y: cy, cx1: cx + rx * kappa, cy1: cy + ry, cx2: cx + rx, cy2: cy + ry * kappa },
            { id: '6', type: 'close', x: 0, y: 0 }
          ];
          
          newLayer = {
            id: `layer_${Date.now()}`,
            name: `Ellipse ${layers.length + 1}`,
            visible: true,
            locked: false,
            color: toolProperties?.ellipse?.fill !== false ? (toolProperties.fill || 'var(--xibalba-text-000)') : 'none',
            stroke: toolProperties?.ellipse?.stroke !== false ? (toolProperties.stroke || 'var(--xibalba-accent)') : 'none',
            strokeWidth: toolProperties?.strokeWidth || 1,
            opacity: toolProperties?.opacity || 1,
            blendMode: 'normal',
            shape: { type: 'path', nodes }
          };
        }
      } else if (['pen', 'pencil', 'brush', 'line'].includes(activeTool) && drawPath.length > 0) {
        // Only create path if it has at least 2 points (or 1 point for line tool)
        if (drawPath.length >= (activeTool === 'line' ? 2 : 1)) {
          const nodes: VectorNode[] = drawPath.map((p, i) => {
            if (i === 0) {
              return { id: `node_${i}_${Date.now()}`, type: 'move', x: p.x, y: p.y };
            }
            return { id: `node_${i}_${Date.now()}`, type: 'line', x: p.x, y: p.y };
          });
          
          if (toolProperties?.pen?.closePath || toolProperties?.pencil?.closePath) {
            nodes.push({ id: `node_${nodes.length}_${Date.now()}`, type: 'close', x: 0, y: 0 });
          }
          
          newLayer = {
            id: `layer_${Date.now()}`,
            name: `${activeTool.charAt(0).toUpperCase() + activeTool.slice(1)} ${layers.length + 1}`,
            visible: true,
            locked: false,
            color: toolProperties?.pen?.fill !== false ? (toolProperties.fill || 'var(--xibalba-text-000)') : 'none',
            stroke: toolProperties?.pen?.stroke !== false ? (toolProperties.stroke || 'var(--xibalba-accent)') : 'none',
            strokeWidth: toolProperties?.strokeWidth || 1,
            opacity: toolProperties?.opacity || 1,
            blendMode: 'normal',
            shape: { type: 'path', nodes }
          };
        }
      }

      if (newLayer) {
        onCreateLayer(newLayer);
        onSelectLayer(newLayer.id);
      }
    }

      setIsDragging(false);
      setIsDrawing(false);
      setDrawPath([]);
      setDrawStart(null);
    };

    if (isDragging || isDrawing) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, isDrawing, drawStart, drawPath, activeTool, isSpacebarDown, dragStart, onPan, onZoom, onCreateLayer, onSelectLayer, layers, toolProperties, getCanvasCoords, snapValue, snapToGuide]);

  // Zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(25, Math.min(400, zoom * delta));
      onZoom(newZoom);
    }
  };

  // Add guide from ruler
  const handleRulerClick = (type: 'h' | 'v', position: number) => {
    if (showGuides) {
      setGuides([...guides, { id: `guide-${Date.now()}`, type, position }]);
    }
  };

  // Get cursor class based on tool
  const getCursorClass = () => {
    if (activeTool === 'pan' || isSpacebarDown) return 'cursor-grab';
    if (activeTool === 'select') return 'cursor-default';
    return 'cursor-crosshair';
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden canvas-container bg-[var(--xibalba-grey-000)] min-h-[500px] flex flex-col isolation-isolate zstack-canvas"
      data-cursor-type={activeTool === 'select' ? 'default' : activeTool === 'pen' ? 'crosshair' : 'default'}
      onPointerDown={handlePointerDown}
      onWheel={handleWheel}
    >
      {/* Orange Glow Backlight */}
      <div className="canvas-backlight" />
      
      {/* Construction Paper Texture Layer - Isolated to canvas only */}
      <div className="construction-paper-layer" />
      {/* Professional Rulers with Real Measurements */}
      <ProfessionalRulers
        zoom={zoom}
        pan={pan}
        unit={measurementUnit}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        onUnitChange={onUnitChange}
      />

      {/* Canvas Area - Draftsman's Table */}
      <div
        ref={canvasRef}
        className={`absolute inset-0 overflow-hidden canvas-area ${getCursorClass()}`}
      >
        {/* Grid Background - Always show grid for visibility */}
        <div
          ref={gridRef}
          className={`absolute inset-0 pointer-events-none grid-background ${snapToGrid ? 'opacity-100' : 'opacity-30'}`}
        />

        {/* Guides */}
        {showGuides && guides.map(guide => {
          const position = guide.position * zoomScale + (guide.type === 'v' ? pan.x : pan.y);
          return (
            <div
              key={guide.id}
              ref={(node) => {
                if (node) {
                  node.style.setProperty('--guide-position-' + (guide.type === 'v' ? 'x' : 'y'), `${position}px`);
                }
              }}
              className={`absolute pointer-events-none zstack-guides ${guide.type === 'v' ? 'guide-line-vertical' : 'guide-line-horizontal'}`}
            />
          );
        })}

        {/* Canvas Content */}
        <div
          ref={canvasContentRef}
          className="absolute inset-0 canvas-content-wrapper bg-[var(--xibalba-grey-050)] min-w-full min-h-full block"
        >
          <svg
            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
            width={canvasWidth}
            height={canvasHeight}
            ref={(node) => {
              if (node) {
                node.style.setProperty('--svg-min-width', '800px');
                node.style.setProperty('--svg-min-height', '600px');
              }
            }}
            className="canvas-svg block w-full h-full min-w-[var(--svg-min-width)] min-h-[var(--svg-min-height)]"
          >
            {/* FIXED: Recursive rendering function for groups and children - moved outside map for proper closure */}
            {(() => {
              // FIXED: Recursive function to find layer by ID (searches children too)
              const findLayerById = (layerList: VectorLayer[], id: string): VectorLayer | null => {
                for (const layer of layerList) {
                  if (layer.id === id) return layer;
                  if (layer.children && Array.isArray(layer.children)) {
                    const found = findLayerById(layer.children, id);
                    if (found) return found;
                  }
                }
                return null;
              };
              
              // Recursive rendering function for groups and children
              const renderLayerRecursive = (layerToRender: VectorLayer, depth: number = 0): React.ReactNode => {
                  // FIXED: Validate layer before rendering
                  if (!layerToRender || !layerToRender.shape) {
                    return null;
                  }
                  
                  const shape = layerToRender.shape;
                  const clipPathId = layerToRender.mask ? `clip-${layerToRender.id}` : undefined;
                  
                  // FIXED: Render clipping mask if present - find mask layer recursively
                  const clipPath = layerToRender.mask ? (() => {
                    const maskLayer = findLayerById(layers, layerToRender.mask);
                    if (maskLayer && maskLayer.shape) {
                      // Render mask shape inside clipPath
                      if (maskLayer.shape.type === 'path' && maskLayer.shape.nodes && Array.isArray(maskLayer.shape.nodes)) {
                        const maskNodes = maskLayer.shape.nodes.filter(n => n && typeof n.x === 'number' && typeof n.y === 'number');
                        const maskPathData = maskNodes.length > 0
                          ? maskNodes.map(n => {
                              if (n.type === 'move') return `M ${n.x} ${n.y}`;
                              if (n.type === 'line') return `L ${n.x} ${n.y}`;
                              if (n.type === 'cubic') {
                                const cx1 = Number.isFinite(n.cx1) ? n.cx1 : n.x;
                                const cy1 = Number.isFinite(n.cy1) ? n.cy1 : n.y;
                                const cx2 = Number.isFinite(n.cx2) ? n.cx2 : n.x;
                                const cy2 = Number.isFinite(n.cy2) ? n.cy2 : n.y;
                                return `C ${cx1} ${cy1} ${cx2} ${cy2} ${n.x} ${n.y}`;
                              }
                              if (n.type === 'close') return 'Z';
                              return '';
                            }).filter(cmd => cmd !== '').join(' ')
                          : (maskLayer.shape.d || '');
                        return (
                          <defs>
                            <clipPath id={clipPathId}>
                              <path d={maskPathData} />
                            </clipPath>
                          </defs>
                        );
                      } else if (maskLayer.shape.type === 'rect') {
                        return (
                          <defs>
                            <clipPath id={clipPathId}>
                              <rect x={maskLayer.shape.x || 0} y={maskLayer.shape.y || 0} width={maskLayer.shape.width || 100} height={maskLayer.shape.height || 100} />
                            </clipPath>
                          </defs>
                        );
                      } else if (maskLayer.shape.type === 'ellipse') {
                        return (
                          <defs>
                            <clipPath id={clipPathId}>
                              <ellipse cx={maskLayer.shape.x || 0} cy={maskLayer.shape.y || 0} rx={maskLayer.shape.radiusX || 50} ry={maskLayer.shape.radiusY || 50} />
                            </clipPath>
                          </defs>
                        );
                      }
                    }
                    return (
                      <defs>
                        <clipPath id={clipPathId}>
                          {/* Fallback mask */}
                        </clipPath>
                      </defs>
                    );
                  })() : null;
                  
                  let shapeElement: React.ReactNode = null;
                  
                  if (shape.type === 'rect') {
                    const rect = shape;
                    shapeElement = (
                      <rect
                        x={rect.x}
                        y={rect.y}
                        width={rect.width}
                        height={rect.height}
                        rx={rect.borderRadius}
                        fill={layerToRender.color}
                        stroke={layerToRender.stroke}
                        strokeWidth={layerToRender.strokeWidth}
                        opacity={layerToRender.opacity}
                        clipPath={clipPathId ? `url(#${clipPathId})` : undefined}
                        className={selectedLayerId === layerToRender.id ? 'canvas-layer-selected' : 'canvas-layer'}
                        onClick={() => onSelectLayer(layerToRender.id)}
                      />
                    );
                  } else if (shape.type === 'ellipse') {
                    // FIXED: Ellipse rendering
                    const ellipse = shape;
                    shapeElement = (
                      <ellipse
                        cx={ellipse.x}
                        cy={ellipse.y}
                        rx={ellipse.radiusX}
                        ry={ellipse.radiusY}
                        fill={layerToRender.color}
                        stroke={layerToRender.stroke}
                        strokeWidth={layerToRender.strokeWidth}
                        opacity={layerToRender.opacity}
                        clipPath={clipPathId ? `url(#${clipPathId})` : undefined}
                        className={selectedLayerId === layerToRender.id ? 'canvas-layer-selected' : 'canvas-layer'}
                        onClick={() => onSelectLayer(layerToRender.id)}
                      />
                    );
                  } else if (shape.type === 'text') {
                    // FIXED: Text rendering
                    const text = shape;
                    shapeElement = (
                      <text
                        x={text.x}
                        y={text.y}
                        fill={layerToRender.color}
                        stroke={layerToRender.stroke}
                        strokeWidth={layerToRender.strokeWidth}
                        opacity={layerToRender.opacity}
                        clipPath={clipPathId ? `url(#${clipPathId})` : undefined}
                        className={selectedLayerId === layerToRender.id ? 'canvas-layer-selected' : 'canvas-layer'}
                        onClick={() => onSelectLayer(layerToRender.id)}
                      >
                        {text.content || ''}
                      </text>
                    );
                  } else if (shape.type === 'path') {
                    // FIXED: Added null checks and validation for path data generation
                    const nodes = shape.nodes || [];
                    const validNodes = nodes.filter(node => 
                      node && 
                      typeof node.x === 'number' && 
                      typeof node.y === 'number' && 
                      Number.isFinite(node.x) && 
                      Number.isFinite(node.y) &&
                      node.type
                    );
                    
                    const pathData = validNodes.length > 0 
                      ? validNodes.map((node) => {
                          if (node.type === 'move') return `M ${node.x} ${node.y}`;
                          if (node.type === 'line') return `L ${node.x} ${node.y}`;
                          if (node.type === 'cubic') {
                            const cx1 = Number.isFinite(node.cx1) ? node.cx1 : node.x;
                            const cy1 = Number.isFinite(node.cy1) ? node.cy1 : node.y;
                            const cx2 = Number.isFinite(node.cx2) ? node.cx2 : node.x;
                            const cy2 = Number.isFinite(node.cy2) ? node.cy2 : node.y;
                            return `C ${cx1} ${cy1} ${cx2} ${cy2} ${node.x} ${node.y}`;
                          }
                          if (node.type === 'close') return 'Z';
                          return '';
                        }).filter(cmd => cmd !== '').join(' ')
                      : (shape.d || '');
                    
                    const pathClipPathId = layerToRender.mask ? `clip-${layerToRender.id}` : undefined;
                    shapeElement = (
                      <g>
                        {pathClipPathId && (
                          <defs>
                            <clipPath id={pathClipPathId}>
                              {/* Clipping mask for path */}
                            </clipPath>
                          </defs>
                        )}
                        <path
                          d={pathData}
                          fill={layerToRender.color === 'none' ? 'transparent' : layerToRender.color}
                          stroke={layerToRender.stroke === 'none' ? 'transparent' : layerToRender.stroke}
                          strokeWidth={layerToRender.strokeWidth}
                          opacity={layerToRender.opacity}
                          clipPath={pathClipPathId ? `url(#${pathClipPathId})` : undefined}
                          className={selectedLayerId === layerToRender.id ? 'canvas-layer-selected' : 'canvas-layer'}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLayer(layerToRender.id);
                          }}
                        />
                        {/* Node Editor for Direct Selection Tool - FIXED: Added null checks and error boundary */}
                        {selectedLayerId === layerToRender.id && activeTool === 'direct-select' && shape.nodes && Array.isArray(shape.nodes) && shape.nodes.length > 0 && (
                          <ErrorBoundary fallback={<div className="text-xs text-[var(--vectorforge-accent)]">Node editor error</div>}>
                            <NodeEditor
                              nodes={shape.nodes.filter(n => n && typeof n.x === 'number' && typeof n.y === 'number')}
                              zoom={zoomScale * 100}
                              onNodeMove={(nodeId, x, y) => {
                                if (!shape.nodes) return;
                                const newNodes = shape.nodes.map(n => 
                                  n && n.id === nodeId ? { ...n, x, y } : n
                                ).filter(n => n !== null && n !== undefined);
                                onUpdateLayer(layerToRender.id, { shape: { ...shape, nodes: newNodes } });
                              }}
                              onNodeAdd={(afterNodeId, x, y) => {
                                if (!shape.nodes) return;
                                const index = shape.nodes.findIndex(n => n && n.id === afterNodeId);
                                if (index === -1) return;
                                const newNode: VectorNode = {
                                  id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                                  x,
                                  y,
                                  type: 'line'
                                };
                                const newNodes = [
                                  ...shape.nodes.slice(0, index + 1),
                                  newNode,
                                  ...shape.nodes.slice(index + 1)
                                ];
                                onUpdateLayer(layerToRender.id, { shape: { ...shape, nodes: newNodes } });
                              }}
                              onNodeDelete={(nodeId) => {
                                if (!shape.nodes) return;
                                const newNodes = shape.nodes.filter(n => n && n.id !== nodeId);
                                if (newNodes.length > 0) {
                                  onUpdateLayer(layerToRender.id, { shape: { ...shape, nodes: newNodes } });
                                }
                              }}
                              onNodeTypeChange={(nodeId, type) => {
                                if (!shape.nodes) return;
                                const newNodes = shape.nodes.map(n => 
                                  n && n.id === nodeId ? { ...n, type } : n
                                ).filter(n => n !== null && n !== undefined);
                                onUpdateLayer(layerToRender.id, { shape: { ...shape, nodes: newNodes } });
                              }}
                              onControlPointMove={(nodeId, cpIndex, x, y) => {
                                if (!shape.nodes) return;
                                const newNodes = shape.nodes.map(n => {
                                  if (!n || n.id !== nodeId) return n;
                                  if (cpIndex === 1) {
                                    return { ...n, cx1: x, cy1: y };
                                  } else {
                                    return { ...n, cx2: x, cy2: y };
                                  }
                                }).filter(n => n !== null && n !== undefined);
                                onUpdateLayer(layerToRender.id, { shape: { ...shape, nodes: newNodes } });
                              }}
                            />
                          </ErrorBoundary>
                        )}
                      </g>
                    );
                  }
                  
                  // FIXED: Render children recursively if present
                  const childrenElements = layerToRender.children && Array.isArray(layerToRender.children) && layerToRender.children.length > 0
                    ? layerToRender.children
                        .filter(c => c.visible !== false && !c.locked)
                        .map(child => renderLayerRecursive(child, depth + 1))
                    : null;
                  
                  return (
                    <g key={layerToRender.id}>
                      {clipPath}
                      {shapeElement}
                      {childrenElements}
                    </g>
                  );
                };
              
              // Apply animation interpolation if keyframes exist
              return layers
                .filter(l => l.visible && !l.locked)
                .map(layer => {
                  let animatedLayer = layer;
                  if (onInterpolateFrame && keyframes.length > 0) {
                    const layerKeyframes = keyframes.filter(k => k.layerId === layer.id).sort((a, b) => a.frame - b.frame);
                    if (layerKeyframes.length > 0) {
                      const interpolated = onInterpolateFrame(frameState.currentFrame, layer.id);
                      if (interpolated) {
                        animatedLayer = { ...layer, ...interpolated };
                      }
                    }
                  }
                  
                  // Render the layer using recursive function
                  return (
                    <ErrorBoundary key={layer.id} fallback={<g><text x="10" y="10" fill="red" fontSize="12">Layer render error</text></g>}>
                      {renderLayerRecursive(animatedLayer)}
                    </ErrorBoundary>
                  );
                });
            })()}
            
            {/* Drawing preview */}
            {isDrawing && drawPath.length > 0 && (
              <path
                d={drawPath.map((p, i) => i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`).join(' ')}
                fill="none"
                stroke="var(--xibalba-text-200)"
                strokeWidth={2}
                strokeDasharray="4 4"
                opacity={0.7}
              />
            )}
          </svg>
          
          {/* Empty State - Show when no layers */}
          {layers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center text-[var(--xibalba-text-100)] p-8 bg-[var(--xibalba-grey-050)]/80 rounded-lg border border-white/10">
                <span className="material-symbols-outlined text-4xl mb-4 block opacity-50">gesture</span>
                <h3 className="text-lg font-semibold mb-2 text-[var(--xibalba-text-000)]">Start Drawing</h3>
                <p className="text-sm opacity-75 mb-4">Select a tool from the left sidebar and draw on the canvas</p>
                <div className="text-xs opacity-60">
                  <p>Press <kbd className="px-2 py-1 bg-[var(--xibalba-grey-100)] rounded">V</kbd> for Select, <kbd className="px-2 py-1 bg-[var(--xibalba-grey-100)] rounded">M</kbd> for Rectangle, <kbd className="px-2 py-1 bg-[var(--xibalba-grey-100)] rounded">P</kbd> for Pen</p>
                </div>
              </div>
            </div>
          )}

          {/* Animation Paths Visualization */}
          {keyframes
            .filter(k => k.layerId === selectedLayerId)
            .map((keyframe, i, arr) => {
              if (i === 0) return null;
              const prev = arr[i - 1];
              return (
                <svg
                  key={`path-${keyframe.id}`}
                  className="absolute inset-0 pointer-events-none animation-path"
                >
                  <path
                    d={`M ${prev.properties.x || 0} ${prev.properties.y || 0} L ${keyframe.properties.x || 0} ${keyframe.properties.y || 0}`}
                    stroke="var(--xibalba-text-200)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    fill="none"
                    opacity="0.6"
                  />
                </svg>
              );
            })}
        </div>

        {/* Transform Handles for Selected Layer - FIXED: Added support for all shape types and error boundary */}
        {selectedLayerId && activeTool === 'select' && (() => {
          const selectedLayer = layers.find(l => l.id === selectedLayerId);
          if (!selectedLayer) return null;
          return (
            <ErrorBoundary fallback={<div className="text-xs text-[var(--vectorforge-accent)]">Transform handles error</div>}>
              <TransformHandles
                key={selectedLayer.id}
                layer={selectedLayer}
                zoom={zoom}
                onTransform={(transform) => {
                  if (selectedLayer.shape.type === 'rect') {
                    const newShape = {
                      ...selectedLayer.shape,
                      x: transform.x !== undefined ? transform.x : selectedLayer.shape.x,
                      y: transform.y !== undefined ? transform.y : selectedLayer.shape.y,
                      width: transform.width !== undefined ? transform.width : selectedLayer.shape.width,
                      height: transform.height !== undefined ? transform.height : selectedLayer.shape.height,
                    };
                    onUpdateLayer(selectedLayer.id, { shape: newShape });
                  } else if (selectedLayer.shape.type === 'path' && selectedLayer.shape.nodes && Array.isArray(selectedLayer.shape.nodes)) {
                    // FIXED: Transform all path nodes
                    const deltaX = transform.x !== undefined ? transform.x - (selectedLayer.shape.nodes[0]?.x || 0) : 0;
                    const deltaY = transform.y !== undefined ? transform.y - (selectedLayer.shape.nodes[0]?.y || 0) : 0;
                    const newNodes = selectedLayer.shape.nodes.map(n => {
                      if (!n || typeof n.x !== 'number' || typeof n.y !== 'number') return n;
                      return {
                        ...n,
                        x: n.x + deltaX,
                        y: n.y + deltaY,
                        cx1: n.cx1 !== undefined ? n.cx1 + deltaX : undefined,
                        cy1: n.cy1 !== undefined ? n.cy1 + deltaY : undefined,
                        cx2: n.cx2 !== undefined ? n.cx2 + deltaX : undefined,
                        cy2: n.cy2 !== undefined ? n.cy2 + deltaY : undefined
                      };
                    });
                    onUpdateLayer(selectedLayer.id, { shape: { ...selectedLayer.shape, nodes: newNodes } });
                  } else if (selectedLayer.shape.type === 'text') {
                    // FIXED: Transform text position
                    const newShape = {
                      ...selectedLayer.shape,
                      x: transform.x !== undefined ? transform.x : selectedLayer.shape.x,
                      y: transform.y !== undefined ? transform.y : selectedLayer.shape.y
                    };
                    onUpdateLayer(selectedLayer.id, { shape: newShape });
                  } else if (selectedLayer.shape.type === 'ellipse') {
                    // FIXED: Transform ellipse position and size
                    const newShape = {
                      ...selectedLayer.shape,
                      x: transform.x !== undefined ? transform.x : selectedLayer.shape.x,
                      y: transform.y !== undefined ? transform.y : selectedLayer.shape.y,
                      radiusX: transform.width !== undefined ? transform.width / 2 : selectedLayer.shape.radiusX,
                      radiusY: transform.height !== undefined ? transform.height / 2 : selectedLayer.shape.radiusY
                    };
                    onUpdateLayer(selectedLayer.id, { shape: newShape });
                  }
                }}
              />
            </ErrorBoundary>
          );
        })()}

        {/* Brush Tool Integration */}
        {activeTool === 'brush' && containerRef.current && (
          <BrushToolComponent
            canvasRef={containerRef}
            config={{
              minWidth: toolProperties?.brush?.minWidth || 2,
              maxWidth: toolProperties?.brush?.maxWidth || 20,
              pressureSensitivity: toolProperties?.brush?.pressureSensitivity || 0.7,
              smoothing: toolProperties?.brush?.smoothing || 0.3,
              color: toolProperties?.color || '#ff9800',
              opacity: toolProperties?.opacity || 1.0,
            }}
            onStrokeComplete={(stroke) => {
              // Convert BrushStroke to VectorLayer
              const layer: VectorLayer = {
                id: stroke.id,
                name: `Brush ${layers.length + 1}`,
                visible: true,
                locked: false,
                color: stroke.color,
                stroke: 'none',
                strokeWidth: (stroke.minWidth + stroke.maxWidth) / 2,
                opacity: stroke.opacity,
                blendMode: 'normal',
                shape: {
                  type: 'path',
                  nodes: stroke.points.map((p, i) => ({
                    id: `node_${i}_${stroke.id}`,
                    type: i === 0 ? 'move' : 'line',
                    x: p.x,
                    y: p.y,
                  })),
                },
              };
              onCreateLayer(layer);
            }}
            active={activeTool === 'brush'}
            shortcut="B"
          />
        )}
        {activeTool === 'brush' && (
          <BrushToolComponent
            canvasRef={canvasRef}
            config={{
              minWidth: toolProperties?.brush?.minWidth || 2,
              maxWidth: toolProperties?.brush?.maxWidth || 20,
              pressureSensitivity: toolProperties?.brush?.pressureSensitivity || 0.7,
              smoothing: toolProperties?.brush?.smoothing || 0.3,
              color: toolProperties?.color || 'var(--vectorforge-accent)',
              opacity: toolProperties?.opacity || 1.0,
            }}
            onStrokeComplete={(stroke) => {
              // Convert BrushStroke to VectorLayer
              const nodes: VectorNode[] = stroke.points.map((p, i) => ({
                id: `node_${i}_${Date.now()}`,
                type: i === 0 ? 'move' : 'line',
                x: p.x,
                y: p.y,
              }));

              const layer: VectorLayer = {
                id: stroke.id,
                name: `Brush ${layers.length + 1}`,
                visible: true,
                locked: false,
                color: stroke.color,
                stroke: 'none',
                strokeWidth: (stroke.minWidth + stroke.maxWidth) / 2,
                opacity: stroke.opacity,
                blendMode: 'normal',
                shape: {
                  type: 'path',
                  nodes
                }
              };
              onCreateLayer(layer);
            }}
            active={activeTool === 'brush'}
            shortcut="B"
          />
        )}

        {/* Onion Skinning for Animation */}
        {frameState.isPlaying && (
          <div className="absolute inset-0 pointer-events-none onion-skin-overlay">
            {/* Previous frame ghost */}
            <div className="absolute inset-0 opacity-20">
              {/* Render previous frame content */}
            </div>
          </div>
        )}
      </div>

      {/* Canvas Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 zstack-canvas-controls">
        <div className="xibalba-panel-professional flex items-center gap-2 p-2">
          <button
            onClick={() => onZoom(Math.max(25, zoom - 25))}
            className="xibalba-toolbar-button-professional"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true" data-icon="remove"></span>
          </button>
          <span className="xibalba-text-caption font-mono min-w-[60px] text-center">{zoom}%</span>
          <button
            onClick={() => onZoom(Math.min(400, zoom + 25))}
            className="xibalba-toolbar-button-professional"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true" data-icon="add"></span>
          </button>
          <div className="w-px h-6 bg-[var(--xibalba-grey-200)] opacity-20 mx-1" />
          <button
            onClick={() => onZoom(100)}
            className="xibalba-toolbar-button-professional"
            title="Fit to Screen"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true" data-icon="fit_screen"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftsmanCanvas;
