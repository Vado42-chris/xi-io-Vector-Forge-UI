/**
 * Professional Node Editor
 * Direct node manipulation for path editing
 * Like Illustrator/Inkscape - edit individual path nodes
 * NO INLINE STYLES - Component-based platform
 */

import React, { useRef, useState, useCallback } from 'react';
import { VectorNode } from '../types';

interface NodeEditorProps {
  nodes: VectorNode[];
  zoom: number;
  onNodeMove: (nodeId: string, x: number, y: number) => void;
  onNodeAdd: (afterNodeId: string, x: number, y: number) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeTypeChange: (nodeId: string, type: 'move' | 'line' | 'cubic' | 'close') => void;
  onControlPointMove: (nodeId: string, cpIndex: 1 | 2, x: number, y: number) => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({
  nodes, zoom, onNodeMove, onNodeAdd, onNodeDelete, onNodeTypeChange, onControlPointMove
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, nodeX: 0, nodeY: 0 });

  const nodeSize = Math.max(6, 6 / (zoom / 100));
  const controlPointSize = Math.max(4, 4 / (zoom / 100));

  const handleNodeMouseDown = useCallback((e: React.MouseEvent, node: VectorNode) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
    setIsDragging(node.id);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      nodeX: node.x,
      nodeY: node.y
    });
  }, []);

  const handleNodePointerDown = useCallback((e: React.PointerEvent, node: VectorNode) => {
    handleNodeMouseDown(e as any, node);
  }, [handleNodeMouseDown]);

  const handleControlPointMouseDown = useCallback((e: React.MouseEvent, nodeId: string, cpIndex: 1 | 2) => {
    e.stopPropagation();
    setIsDragging(`${nodeId}-cp${cpIndex}`);
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      nodeX: cpIndex === 1 ? (node.cx1 ?? node.x) : (node.cx2 ?? node.x),
      nodeY: cpIndex === 1 ? (node.cy1 ?? node.y) : (node.cy2 ?? node.y)
    });
  }, [nodes]);

  const handleControlPointPointerDown = useCallback((e: React.PointerEvent, nodeId: string, cpIndex: 1 | 2) => {
    handleControlPointMouseDown(e as any, nodeId, cpIndex);
  }, [handleControlPointMouseDown]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = (e.clientX - dragStart.x) / zoom * 100;
    const deltaY = (e.clientY - dragStart.y) / zoom * 100;

    if (isDragging.includes('-cp')) {
      const [nodeId, cpStr] = isDragging.split('-cp');
      const cpIndex = parseInt(cpStr) as 1 | 2;
      onControlPointMove(nodeId, cpIndex, dragStart.nodeX + deltaX, dragStart.nodeY + deltaY);
    } else {
      onNodeMove(isDragging, dragStart.nodeX + deltaX, dragStart.nodeY + deltaY);
    }
  }, [isDragging, dragStart, zoom, onNodeMove, onControlPointMove]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    handleMouseMove(e as any);
  }, [handleMouseMove]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    setIsDragging(null);
    if (e.target instanceof HTMLElement) {
      e.target.releasePointerCapture(e.pointerId);
    }
  }, []);

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

  return (
    <>
      {nodes.map((node, index) => {
        if (node.type === 'close') return null;

        return (
          <g key={node.id}>
            {/* Control Points for Cubic Nodes */}
            {node.type === 'cubic' && (
              <>
                {node.cx1 !== undefined && node.cy1 !== undefined && (
                  <g>
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={node.cx1}
                      y2={node.cy1}
                      stroke="var(--xibalba-accent)"
                      strokeWidth={1}
                      strokeDasharray="2 2"
                      opacity={0.5}
                    />
                    <circle
                      cx={node.cx1}
                      cy={node.cy1}
                      r={controlPointSize}
                      fill="var(--xibalba-text-200)"
                      stroke="var(--xibalba-grey-050)"
                      strokeWidth={1}
                      className="cursor-pointer"
                      onPointerDown={(e) => handleControlPointPointerDown(e, node.id, 1)}
                    />
                  </g>
                )}
                {node.cx2 !== undefined && node.cy2 !== undefined && (
                  <g>
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={node.cx2}
                      y2={node.cy2}
                      stroke="var(--xibalba-accent)"
                      strokeWidth={1}
                      strokeDasharray="2 2"
                      opacity={0.5}
                    />
                    <circle
                      cx={node.cx2}
                      cy={node.cy2}
                      r={controlPointSize}
                      fill="var(--xibalba-text-200)"
                      stroke="var(--xibalba-grey-050)"
                      strokeWidth={1}
                      className="cursor-pointer"
                      onPointerDown={(e) => handleControlPointPointerDown(e, node.id, 2)}
                    />
                  </g>
                )}
              </>
            )}

            {/* Node Handle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={nodeSize}
              fill={selectedNodeId === node.id ? 'var(--xibalba-text-200)' : 'var(--xibalba-grey-050)'}
              stroke={selectedNodeId === node.id ? 'var(--xibalba-text-000)' : 'var(--xibalba-text-200)'}
              strokeWidth={selectedNodeId === node.id ? 2 : 1}
              className="cursor-pointer"
              onPointerDown={(e) => handleNodePointerDown(e, node)}
              onContextMenu={(e) => {
                e.preventDefault();
                // Could show context menu for node operations
              }}
            />

            {/* Node Type Indicator */}
            {selectedNodeId === node.id && (
              <text
                x={node.x}
                y={node.y - nodeSize - 4}
                fontSize="8px"
                fill="var(--xibalba-text-000)"
                textAnchor="middle"
                className="pointer-events-none"
              >
                {node.type === 'move' ? 'M' : node.type === 'line' ? 'L' : 'C'}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
};

export default NodeEditor;

