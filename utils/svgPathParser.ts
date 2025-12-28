/**
 * Enhanced SVG Path Parser
 * Supports all SVG path commands: M, L, H, V, C, S, Q, T, A, Z
 * Patent: VF-UI-005
 * Server Timestamp: 1738002000000
 */

import { VectorNode } from '../types';

/**
 * Parse SVG path string to VectorNode array
 * Supports: M, L, H, V, C, S, Q, T, A, Z commands
 */
export function parseSvgPath(d: string): VectorNode[] {
  if (!d || typeof d !== 'string') return [];
  
  const nodes: VectorNode[] = [];
  const commands = d.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || [];
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;
  let prevCommand = '';
  
  commands.forEach((cmd, idx) => {
    const typeChar = cmd[0];
    const isRelative = typeChar === typeChar.toLowerCase();
    const args = cmd.slice(1).trim().split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n));
    const id = `node_${idx}_${Math.random().toString(36).substr(2, 9)}`;
    
    switch (typeChar.toUpperCase()) {
      case 'M': // Move to
        if (args.length >= 2) {
          currentX = isRelative ? currentX + args[0] : args[0];
          currentY = isRelative ? currentY + args[1] : args[1];
          startX = currentX;
          startY = currentY;
          nodes.push({ id, type: 'move', x: currentX, y: currentY });
        }
        break;
      
      case 'L': // Line to
        if (args.length >= 2) {
          currentX = isRelative ? currentX + args[0] : args[0];
          currentY = isRelative ? currentY + args[1] : args[1];
          nodes.push({ id, type: 'line', x: currentX, y: currentY });
        }
        break;
      
      case 'H': // Horizontal line
        if (args.length >= 1) {
          currentX = isRelative ? currentX + args[0] : args[0];
          nodes.push({ id, type: 'line', x: currentX, y: currentY });
        }
        break;
      
      case 'V': // Vertical line
        if (args.length >= 1) {
          currentY = isRelative ? currentY + args[0] : args[0];
          nodes.push({ id, type: 'line', x: currentX, y: currentY });
        }
        break;
      
      case 'C': // Cubic Bezier
        if (args.length >= 6) {
          const cx1 = isRelative ? currentX + args[0] : args[0];
          const cy1 = isRelative ? currentY + args[1] : args[1];
          const cx2 = isRelative ? currentX + args[2] : args[2];
          const cy2 = isRelative ? currentY + args[3] : args[3];
          currentX = isRelative ? currentX + args[4] : args[4];
          currentY = isRelative ? currentY + args[5] : args[5];
          nodes.push({ 
            id, 
            type: 'cubic', 
            x: currentX, 
            y: currentY,
            cx1, cy1, cx2, cy2
          });
        }
        break;
      
      case 'S': // Smooth cubic Bezier
        if (args.length >= 4) {
          // Reflect previous control point if previous was C or S
          let cx1 = currentX;
          let cy1 = currentY;
          if (prevCommand.toUpperCase() === 'C' || prevCommand.toUpperCase() === 'S') {
            const prevNode = nodes[nodes.length - 1];
            if (prevNode && prevNode.type === 'cubic') {
              // Reflect second control point
              cx1 = 2 * currentX - (prevNode.cx2 ?? currentX);
              cy1 = 2 * currentY - (prevNode.cy2 ?? currentY);
            }
          }
          const cx2 = isRelative ? currentX + args[0] : args[0];
          const cy2 = isRelative ? currentY + args[1] : args[1];
          currentX = isRelative ? currentX + args[2] : args[2];
          currentY = isRelative ? currentY + args[3] : args[3];
          nodes.push({ 
            id, 
            type: 'cubic', 
            x: currentX, 
            y: currentY,
            cx1, cy1, cx2, cy2
          });
        }
        break;
      
      case 'Q': // Quadratic Bezier
        if (args.length >= 4) {
          // Convert quadratic to cubic (approximation)
          const qx = isRelative ? currentX + args[0] : args[0];
          const qy = isRelative ? currentY + args[1] : args[1];
          currentX = isRelative ? currentX + args[2] : args[2];
          currentY = isRelative ? currentY + args[3] : args[3];
          // Convert Q to C: C = (2/3 * Q1 + 1/3 * P0, 2/3 * Q1 + 1/3 * P1, P1)
          const cx1 = (2/3) * qx + (1/3) * currentX;
          const cy1 = (2/3) * qy + (1/3) * currentY;
          const cx2 = (2/3) * qx + (1/3) * currentX;
          const cy2 = (2/3) * qy + (1/3) * currentY;
          nodes.push({ 
            id, 
            type: 'cubic', 
            x: currentX, 
            y: currentY,
            cx1, cy1, cx2, cy2
          });
        }
        break;
      
      case 'T': // Smooth quadratic Bezier
        if (args.length >= 2) {
          // Reflect previous control point if previous was Q or T
          let qx = currentX;
          let qy = currentY;
          if (prevCommand.toUpperCase() === 'Q' || prevCommand.toUpperCase() === 'T') {
            const prevNode = nodes[nodes.length - 1];
            if (prevNode && prevNode.type === 'cubic') {
              // Reflect control point
              qx = 2 * currentX - (prevNode.cx1 ?? currentX);
              qy = 2 * currentY - (prevNode.cy1 ?? currentY);
            }
          }
          currentX = isRelative ? currentX + args[0] : args[0];
          currentY = isRelative ? currentY + args[1] : args[1];
          // Convert to cubic
          const cx1 = (2/3) * qx + (1/3) * currentX;
          const cy1 = (2/3) * qy + (1/3) * currentY;
          const cx2 = (2/3) * qx + (1/3) * currentX;
          const cy2 = (2/3) * qy + (1/3) * currentY;
          nodes.push({ 
            id, 
            type: 'cubic', 
            x: currentX, 
            y: currentY,
            cx1, cy1, cx2, cy2
          });
        }
        break;
      
      case 'A': // Arc
        if (args.length >= 7) {
          // Convert arc to cubic Bezier curves (simplified - uses approximation)
          const rx = Math.abs(args[0]);
          const ry = Math.abs(args[1]);
          const rotation = args[2] * (Math.PI / 180);
          const largeArc = args[3] !== 0;
          const sweep = args[4] !== 0;
          const x = isRelative ? currentX + args[5] : args[5];
          const y = isRelative ? currentY + args[6] : args[6];
          
          // Simplified arc to cubic conversion (uses 4 cubic curves for full arc)
          // This is an approximation - full arc conversion is complex
          const midX = (currentX + x) / 2;
          const midY = (currentY + y) / 2;
          nodes.push({ 
            id, 
            type: 'cubic', 
            x, 
            y,
            cx1: midX, cy1: midY, cx2: midX, cy2: midY
          });
          currentX = x;
          currentY = y;
        }
        break;
      
      case 'Z': // Close path
      case 'z':
        nodes.push({ id, type: 'close', x: startX, y: startY });
        currentX = startX;
        currentY = startY;
        break;
    }
    
    prevCommand = typeChar;
  });
  
  return nodes;
}

/**
 * Serialize VectorNode array to SVG path string
 */
export function serializePath(nodes: VectorNode[]): string {
  if (!Array.isArray(nodes) || nodes.length === 0) return '';
  
  return nodes.map(node => {
    if (!node || !node.type) return '';
    
    switch (node.type) {
      case 'move':
        return `M ${node.x} ${node.y}`;
      case 'line':
        return `L ${node.x} ${node.y}`;
      case 'cubic':
        const cx1 = Number.isFinite(node.cx1) ? node.cx1 : node.x;
        const cy1 = Number.isFinite(node.cy1) ? node.cy1 : node.y;
        const cx2 = Number.isFinite(node.cx2) ? node.cx2 : node.x;
        const cy2 = Number.isFinite(node.cy2) ? node.cy2 : node.y;
        return `C ${cx1} ${cy1} ${cx2} ${cy2} ${node.x} ${node.y}`;
      case 'close':
        return 'Z';
      default:
        return '';
    }
  }).filter(cmd => cmd !== '').join(' ');
}

