/**
 * Type Guards for Runtime Type Validation
 * Patent: VF-UI-004
 * Server Timestamp: 1738000000000
 */

import { VectorLayer, VectorNode, Shape, ToolType } from '../types';

/**
 * Check if value is a valid VectorNode
 */
export function isVectorNode(value: any): value is VectorNode {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.x === 'number' &&
    typeof value.y === 'number' &&
    typeof value.type === 'string' &&
    ['move', 'line', 'cubic', 'close'].includes(value.type)
  );
}

/**
 * Check if value is a valid array of VectorNodes
 */
export function isVectorNodeArray(value: any): value is VectorNode[] {
  return Array.isArray(value) && value.every(node => isVectorNode(node));
}

/**
 * Check if value is a valid Shape
 */
export function isShape(value: any): value is Shape {
  if (!value || typeof value !== 'object' || !value.type) {
    return false;
  }
  
  switch (value.type) {
    case 'rect':
      return (
        typeof value.x === 'number' &&
        typeof value.y === 'number' &&
        typeof value.width === 'number' &&
        typeof value.height === 'number' &&
        (value.borderRadius === undefined || typeof value.borderRadius === 'number')
      );
    
    case 'ellipse':
      return (
        typeof value.x === 'number' &&
        typeof value.y === 'number' &&
        typeof value.radiusX === 'number' &&
        typeof value.radiusY === 'number'
      );
    
    case 'path':
      return (
        (typeof value.d === 'string' || value.d === undefined) &&
        (value.nodes === undefined || isVectorNodeArray(value.nodes))
      );
    
    case 'text':
      return (
        typeof value.x === 'number' &&
        typeof value.y === 'number' &&
        (typeof value.content === 'string' || value.content === undefined)
      );
    
    default:
      return false;
  }
}

/**
 * Check if value is a valid VectorLayer
 */
export function isVectorLayer(value: any): value is VectorLayer {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.visible === 'boolean' &&
    typeof value.locked === 'boolean' &&
    typeof value.color === 'string' &&
    typeof value.stroke === 'string' &&
    typeof value.strokeWidth === 'number' &&
    typeof value.opacity === 'number' &&
    isShape(value.shape)
  );
}

/**
 * Check if value is a valid ToolType
 */
export function isToolType(value: any): value is ToolType {
  const validTools: ToolType[] = [
    'select', 'direct-select', 'group-select',
    'pen', 'pencil', 'brush', 'line', 'rectangle', 'ellipse', 'polygon', 'star', 'spiral',
    'text', 'text-on-path',
    'rotate', 'scale', 'shear', 'reflect',
    'shape-builder', 'pathfinder',
    'eyedropper', 'gradient', 'mesh', 'blend', 'symbol-sprayer',
    'pan', 'zoom', 'artboard',
    'perspective', 'free-transform', 'width', 'warp', 'twirl', 'pucker', 'bloat', 'scallop', 'crystallize', 'wrinkle'
  ];
  return typeof value === 'string' && validTools.includes(value as ToolType);
}

/**
 * Validate and sanitize VectorNode
 */
export function sanitizeVectorNode(node: any): VectorNode | null {
  if (!isVectorNode(node)) {
    return null;
  }
  
  // Ensure numeric properties are valid numbers
  const sanitized: VectorNode = {
    id: String(node.id),
    type: node.type,
    x: Number.isFinite(node.x) ? node.x : 0,
    y: Number.isFinite(node.y) ? node.y : 0
  };
  
  // Add cubic-specific properties if present
  if (node.type === 'cubic') {
    sanitized.cx1 = Number.isFinite(node.cx1) ? node.cx1 : sanitized.x;
    sanitized.cy1 = Number.isFinite(node.cy1) ? node.cy1 : sanitized.y;
    sanitized.cx2 = Number.isFinite(node.cx2) ? node.cx2 : sanitized.x;
    sanitized.cy2 = Number.isFinite(node.cy2) ? node.cy2 : sanitized.y;
  }
  
  return sanitized;
}

/**
 * Validate and sanitize Shape
 */
export function sanitizeShape(shape: any): Shape | null {
  if (!isShape(shape)) {
    return null;
  }
  
  switch (shape.type) {
    case 'rect':
      return {
        type: 'rect',
        x: Number.isFinite(shape.x) ? shape.x : 0,
        y: Number.isFinite(shape.y) ? shape.y : 0,
        width: Number.isFinite(shape.width) && shape.width > 0 ? shape.width : 100,
        height: Number.isFinite(shape.height) && shape.height > 0 ? shape.height : 100,
        borderRadius: shape.borderRadius !== undefined && Number.isFinite(shape.borderRadius) ? Math.max(0, shape.borderRadius) : 0
      };
    
    case 'ellipse':
      return {
        type: 'ellipse',
        x: Number.isFinite(shape.x) ? shape.x : 0,
        y: Number.isFinite(shape.y) ? shape.y : 0,
        radiusX: Number.isFinite(shape.radiusX) && shape.radiusX > 0 ? shape.radiusX : 50,
        radiusY: Number.isFinite(shape.radiusY) && shape.radiusY > 0 ? shape.radiusY : 50
      };
    
    case 'path':
      return {
        type: 'path',
        d: typeof shape.d === 'string' ? shape.d : '',
        nodes: shape.nodes && Array.isArray(shape.nodes) 
          ? shape.nodes.map(sanitizeVectorNode).filter((n): n is VectorNode => n !== null)
          : []
      };
    
    case 'text':
      return {
        type: 'text',
        x: Number.isFinite(shape.x) ? shape.x : 0,
        y: Number.isFinite(shape.y) ? shape.y : 0,
        content: typeof shape.content === 'string' ? shape.content : ''
      };
    
    default:
      return null;
  }
}

/**
 * Validate and sanitize VectorLayer
 */
export function sanitizeVectorLayer(layer: any): VectorLayer | null {
  if (!layer || typeof layer !== 'object') {
    return null;
  }
  
  const sanitizedShape = sanitizeShape(layer.shape);
  if (!sanitizedShape) {
    return null;
  }
  
  return {
    id: String(layer.id || 'unknown'),
    name: String(layer.name || 'Unnamed Layer'),
    visible: Boolean(layer.visible !== false),
    locked: Boolean(layer.locked === true),
    color: String(layer.color || '#ffffff'),
    stroke: String(layer.stroke || '#000000'),
    strokeWidth: Number.isFinite(layer.strokeWidth) ? Math.max(0, layer.strokeWidth) : 1,
    opacity: Number.isFinite(layer.opacity) ? Math.max(0, Math.min(1, layer.opacity)) : 1,
    blendMode: layer.blendMode || 'normal',
    shape: sanitizedShape,
    children: layer.children && Array.isArray(layer.children)
      ? layer.children.map(sanitizeVectorLayer).filter((l): l is VectorLayer => l !== null)
      : undefined,
    clippingMask: layer.clippingMask ? String(layer.clippingMask) : undefined,
    mask: layer.mask ? String(layer.mask) : undefined
  };
}

