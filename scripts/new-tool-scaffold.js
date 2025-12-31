#!/usr/bin/env node

/**
 * Tool Scaffold Generator
 * Creates file structure for new drawing tools following the established pattern
 * 
 * Usage: node scripts/new-tool-scaffold.js --name=toolname [--shortcut=K]
 * 
 * #hashtag: tools scaffold generator factory
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const nameArg = args.find(arg => arg.startsWith('--name='));
const shortcutArg = args.find(arg => arg.startsWith('--shortcut='));

if (!nameArg) {
  console.error('Error: --name parameter required');
  console.error('Usage: node scripts/new-tool-scaffold.js --name=toolname [--shortcut=K]');
  process.exit(1);
}

const toolName = nameArg.split('=')[1];
const shortcut = shortcutArg ? shortcutArg.split('=')[1] : toolName.charAt(0).toUpperCase();

if (!toolName || toolName.length === 0) {
  console.error('Error: Tool name cannot be empty');
  process.exit(1);
}

// Validate tool name (alphanumeric + underscore)
if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(toolName)) {
  console.error('Error: Tool name must start with a letter and contain only letters, numbers, and underscores');
  process.exit(1);
}

const ToolName = toolName.charAt(0).toUpperCase() + toolName.slice(1);
const TOOL_NAME = toolName.toUpperCase();

console.log(`\n🔧 Generating scaffold for: ${ToolName} Tool`);
console.log(`   Shortcut: ${shortcut}\n`);

// Template files
const templates = {
  core: {
    path: `lib/tools/${toolName}.ts`,
    content: `/**
 * ${ToolName} Tool - Core Implementation
 * [DESCRIPTION]
 * Headless core (no React dependencies)
 * 
 * #hashtag: tools ${toolName} drawing
 */

export interface ${ToolName}Point {
  x: number;
  y: number;
  pressure?: number;
  timestamp: number;
}

export interface ${ToolName}Stroke {
  id: string;
  points: ${ToolName}Point[];
  color: string;
  opacity: number;
  startTime: number;
  endTime: number;
}

export interface ${ToolName}Config {
  color?: string;
  opacity?: number;
  // Add tool-specific config here
}

class ${ToolName}Tool {
  private currentStroke: ${ToolName}Point[] = [];
  private strokeHistory: ${ToolName}Stroke[] = [];
  private undoStack: ${ToolName}Stroke[] = [];
  private config: Required<${ToolName}Config>;

  constructor(config: ${ToolName}Config = {}) {
    this.config = {
      color: config.color ?? '#ff9800',
      opacity: config.opacity ?? 1.0,
      // Initialize tool-specific defaults
    };
  }

  /**
   * Start a new stroke
   */
  startStroke(x: number, y: number, pressure?: number): void {
    this.currentStroke = [];
    
    const point: ${ToolName}Point = {
      x,
      y,
      pressure,
      timestamp: Date.now(),
    };
    
    this.currentStroke.push(point);
  }

  /**
   * Add a point to the current stroke
   */
  addPoint(x: number, y: number, pressure?: number): void {
    if (this.currentStroke.length === 0) {
      this.startStroke(x, y, pressure);
      return;
    }

    const point: ${ToolName}Point = {
      x,
      y,
      pressure,
      timestamp: Date.now(),
    };

    this.currentStroke.push(point);
  }

  /**
   * End the current stroke and add it to history
   */
  endStroke(): ${ToolName}Stroke | null {
    if (this.currentStroke.length < 2) {
      this.currentStroke = [];
      return null;
    }

    const stroke: ${ToolName}Stroke = {
      id: \`${toolName}_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`,
      points: [...this.currentStroke],
      color: this.config.color,
      opacity: this.config.opacity,
      startTime: this.currentStroke[0].timestamp,
      endTime: this.currentStroke[this.currentStroke.length - 1].timestamp,
    };

    this.strokeHistory.push(stroke);
    this.currentStroke = [];
    this.undoStack = []; // Clear redo stack on new action

    return stroke;
  }

  /**
   * Get current stroke (for preview)
   */
  getCurrentStroke(): ${ToolName}Point[] {
    return [...this.currentStroke];
  }

  /**
   * Get all completed strokes
   */
  getStrokes(): ${ToolName}Stroke[] {
    return [...this.strokeHistory];
  }

  /**
   * Undo last stroke
   */
  undo(): ${ToolName}Stroke | null {
    if (this.strokeHistory.length === 0) {
      return null;
    }

    const stroke = this.strokeHistory.pop()!;
    this.undoStack.push(stroke);
    return stroke;
  }

  /**
   * Redo last undone stroke
   */
  redo(): ${ToolName}Stroke | null {
    if (this.undoStack.length === 0) {
      return null;
    }

    const stroke = this.undoStack.pop()!;
    this.strokeHistory.push(stroke);
    return stroke;
  }

  /**
   * Clear all strokes
   */
  clear(): void {
    this.strokeHistory = [];
    this.undoStack = [];
    this.currentStroke = [];
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<${ToolName}Config>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<${ToolName}Config> {
    return { ...this.config };
  }

  /**
   * Convert stroke to SVG path
   */
  strokeToSvgPath(stroke: ${ToolName}Stroke): string {
    if (stroke.points.length < 2) {
      return '';
    }

    const pathParts: string[] = [];
    
    stroke.points.forEach((point, index) => {
      if (index === 0) {
        pathParts.push(\`M \${point.x} \${point.y}\`);
      } else {
        pathParts.push(\`L \${point.x} \${point.y}\`);
      }
    });

    return pathParts.join(' ');
  }

  /**
   * Convert all strokes to SVG paths
   */
  strokesToSvgPaths(): string[] {
    return this.strokeHistory.map(stroke => this.strokeToSvgPath(stroke));
  }
}

export default ${ToolName}Tool;
`
  },
  adapter: {
    path: `components/tools/${ToolName}Tool.tsx`,
    content: `/**
 * ${ToolName} Tool - React Adapter
 * Connects ${ToolName}Tool core to React/Canvas
 * 
 * #hashtag: tools ${toolName} react adapter
 */

import React, { useRef, useEffect, useCallback } from 'react';
import ${ToolName}Tool, { ${ToolName}Stroke, ${ToolName}Point, ${ToolName}Config } from '../../lib/tools/${toolName}';

export interface ${ToolName}ToolProps {
  /** Canvas element ref */
  canvasRef: React.RefObject<HTMLDivElement>;
  /** Tool configuration */
  config?: ${ToolName}Config;
  /** Callback when stroke completes */
  onStrokeComplete?: (stroke: ${ToolName}Stroke) => void;
  /** Callback for undo */
  onUndo?: (stroke: ${ToolName}Stroke) => void;
  /** Callback for redo */
  onRedo?: (stroke: ${ToolName}Stroke) => void;
  /** Whether tool is active */
  active?: boolean;
  /** Keyboard shortcut */
  shortcut?: string;
}

/**
 * ${ToolName} Tool React Component
 * Handles pointer events and renders strokes
 */
export const ${ToolName}ToolComponent: React.FC<${ToolName}ToolProps> = ({
  canvasRef,
  config = {},
  onStrokeComplete,
  onUndo,
  onRedo,
  active = false,
  shortcut = '${shortcut}',
}) => {
  const toolRef = useRef<${ToolName}Tool | null>(null);
  const isDrawingRef = useRef(false);

  // Initialize tool
  useEffect(() => {
    if (!toolRef.current) {
      toolRef.current = new ${ToolName}Tool(config);
    } else {
      toolRef.current.updateConfig(config);
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
    if (!active || !toolRef.current) return;
    
    const coords = getCanvasCoords(e.clientX, e.clientY);
    if (!coords) return;

    e.preventDefault();
    isDrawingRef.current = true;
    
    const pressure = e.pointerType === 'pen' ? e.pressure : undefined;
    toolRef.current.startStroke(coords.x, coords.y, pressure);
  }, [active, getCanvasCoords]);

  // Handle pointer move
  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!active || !isDrawingRef.current || !toolRef.current) return;
    
    const coords = getCanvasCoords(e.clientX, e.clientY);
    if (!coords) return;

    const pressure = e.pointerType === 'pen' ? e.pressure : undefined;
    toolRef.current.addPoint(coords.x, coords.y, pressure);
  }, [active, getCanvasCoords]);

  // Handle pointer up
  const handlePointerUp = useCallback(() => {
    if (!isDrawingRef.current || !toolRef.current) return;
    
    isDrawingRef.current = false;
    const stroke = toolRef.current.endStroke();
    
    if (stroke && onStrokeComplete) {
      onStrokeComplete(stroke);
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
        if (e.shiftKey && toolRef.current) {
          // Ctrl+Shift+[shortcut] = Redo
          const stroke = toolRef.current.redo();
          if (stroke && onRedo) {
            onRedo(stroke);
          }
        } else if (toolRef.current) {
          // Ctrl+[shortcut] = Undo
          const stroke = toolRef.current.undo();
          if (stroke && onUndo) {
            onUndo(stroke);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, shortcut, onUndo, onRedo]);

  if (!active) {
    return null;
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}
      aria-label={\`${ToolName} tool (\${shortcut})\`}
      role="button"
      tabIndex={0}
    />
  );
};

export default ${ToolName}ToolComponent;
`
  },
  test: {
    path: `tests/${toolName}.test.ts`,
    content: `/**
 * ${ToolName} Tool Tests
 * Unit tests for ${toolName} tool core functionality
 * 
 * #hashtag: testing ${toolName} tool
 */

import ${ToolName}Tool from '../lib/tools/${toolName}';

describe('${ToolName}Tool', () => {
  let tool: ${ToolName}Tool;

  beforeEach(() => {
    tool = new ${ToolName}Tool({
      color: '#ff9800',
      opacity: 1.0,
    });
  });

  describe('startStroke', () => {
    it('should start a new stroke', () => {
      tool.startStroke(10, 20, 0.5);
      const currentStroke = tool.getCurrentStroke();
      
      expect(currentStroke.length).toBe(1);
      expect(currentStroke[0].x).toBe(10);
      expect(currentStroke[0].y).toBe(20);
    });
  });

  describe('addPoint', () => {
    it('should add points to current stroke', () => {
      tool.startStroke(10, 20);
      tool.addPoint(20, 30);
      tool.addPoint(30, 40);
      
      const currentStroke = tool.getCurrentStroke();
      expect(currentStroke.length).toBe(3);
    });
  });

  describe('endStroke', () => {
    it('should create stroke from current points', () => {
      tool.startStroke(10, 20);
      tool.addPoint(20, 30);
      tool.addPoint(30, 40);
      
      const stroke = tool.endStroke();
      expect(stroke).not.toBeNull();
      expect(stroke!.points.length).toBe(3);
    });

    it('should return null if stroke has less than 2 points', () => {
      tool.startStroke(10, 20);
      const stroke = tool.endStroke();
      expect(stroke).toBeNull();
    });
  });

  describe('undo/redo', () => {
    it('should undo last stroke', () => {
      tool.startStroke(10, 20);
      tool.addPoint(20, 30);
      const stroke = tool.endStroke();
      
      expect(tool.getStrokes().length).toBe(1);
      
      const undone = tool.undo();
      expect(undone).toEqual(stroke);
      expect(tool.getStrokes().length).toBe(0);
    });

    it('should redo last undone stroke', () => {
      tool.startStroke(10, 20);
      tool.addPoint(20, 30);
      const stroke = tool.endStroke();
      
      tool.undo();
      expect(tool.getStrokes().length).toBe(0);
      
      const redone = tool.redo();
      expect(redone).toEqual(stroke);
      expect(tool.getStrokes().length).toBe(1);
    });
  });

  describe('strokeToSvgPath', () => {
    it('should convert stroke to SVG path', () => {
      tool.startStroke(10, 20, 0.5);
      tool.addPoint(20, 30, 0.6);
      tool.addPoint(30, 40, 0.7);
      const stroke = tool.endStroke();
      
      const pathData = tool.strokeToSvgPath(stroke!);
      expect(pathData).toContain('M');
      expect(pathData).toContain('L');
    });
  });
});
`
  },
  readme: {
    path: `docs/${TOOL_NAME}_TOOL_README.md`,
    content: `# ${ToolName} Tool - Implementation Guide

**Status:** 🚧 Scaffold Generated  
**Tool Type:** [DESCRIPTION]  
**Integration:** Headless core + React adapter pattern

---

## Overview

The ${ToolName} tool [DESCRIPTION]. It follows the established architectural pattern:

- **Headless Core** (\`lib/tools/${toolName}.ts\`) - Pure TypeScript, no React dependencies
- **React Adapter** (\`components/tools/${ToolName}Tool.tsx\`) - Connects core to React/Canvas
- **Tests** (\`tests/${toolName}.test.ts\`) - Unit tests for core functionality
- **Export Integration** - \`strokeToSvgPath()\` for SVG export

---

## Features

### Core Functionality
- ✅ Basic stroke drawing
- ✅ Undo/redo support
- ✅ SVG path export
- ⚠️ [ADD TOOL-SPECIFIC FEATURES]

### Integration Points
- ✅ Tool palette selection
- ✅ Keyboard shortcuts (${shortcut} for tool, Ctrl+${shortcut} for undo, Ctrl+Shift+${shortcut} for redo)
- ✅ Pointer event handling (mouse and stylus)
- ✅ Canvas coordinate conversion

---

## Manual Testing Steps

### 1. Basic Drawing
1. Select ${ToolName} tool from palette (or press \`${shortcut}\`)
2. Click and drag on canvas
3. **Expected:** [DESCRIBE EXPECTED BEHAVIOR]

### 2. Undo/Redo
1. Draw a stroke
2. Press \`Ctrl+${shortcut}\` (or use undo button)
3. **Expected:** Last stroke is removed
4. Press \`Ctrl+Shift+${shortcut}\` (or use redo button)
5. **Expected:** Stroke is restored

### 3. Export
1. Draw several strokes
2. Export as SVG
3. **Expected:** All strokes appear in exported SVG with correct paths

---

## Integration Notes

### Adding to Canvas Component

\`\`\`tsx
import { ${ToolName}ToolComponent } from './tools/${ToolName}Tool';

// In DraftsmanCanvas.tsx
{activeTool === '${toolName}' && (
  <${ToolName}ToolComponent
    canvasRef={canvasRef}
    config={{
      color: toolProperties?.color || '#ff9800',
      opacity: toolProperties?.opacity || 1.0,
    }}
    onStrokeComplete={(stroke) => {
      // Convert to VectorLayer and add to layers
      const layer: VectorLayer = {
        id: stroke.id,
        name: \`${ToolName} \${layers.length + 1}\`,
        visible: true,
        locked: false,
        color: stroke.color,
        stroke: 'none',
        strokeWidth: 1,
        opacity: stroke.opacity,
        blendMode: 'normal',
        shape: {
          type: 'path',
          nodes: stroke.points.map((p, i) => ({
            id: \`node_\${i}\`,
            type: i === 0 ? 'move' : 'line',
            x: p.x,
            y: p.y,
          })),
        },
      };
      onCreateLayer(layer);
    }}
    active={activeTool === '${toolName}'}
    shortcut="${shortcut}"
  />
)}
\`\`\`

---

## Implementation Checklist

- [ ] Implement tool-specific core logic in \`lib/tools/${toolName}.ts\`
- [ ] Add tool-specific configuration options
- [ ] Implement custom stroke rendering if needed
- [ ] Add tool properties panel controls
- [ ] Write unit tests for tool-specific features
- [ ] Test integration with canvas
- [ ] Test export functionality
- [ ] Update documentation with tool-specific details

---

## Testing

Run unit tests:
\`\`\`bash
npm test -- ${toolName}.test.ts
\`\`\`

---

**#hashtag: tools ${toolName} implementation guide**
`
  }
};

// Create directories if they don't exist
const dirs = [
  'lib/tools',
  'components/tools',
  'tests',
  'docs'
];

dirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Create files
let created = 0;
let skipped = 0;

Object.entries(templates).forEach(([key, template]) => {
  const filePath = path.join(process.cwd(), template.path);
  
  if (fs.existsSync(filePath)) {
    console.log(`⚠️  Skipped (exists): ${template.path}`);
    skipped++;
  } else {
    fs.writeFileSync(filePath, template.content, 'utf8');
    console.log(`✅ Created: ${template.path}`);
    created++;
  }
});

// Summary
console.log(`\n📊 Summary:`);
console.log(`   Created: ${created} files`);
console.log(`   Skipped: ${skipped} files`);
console.log(`\n✨ ${ToolName} tool scaffold generated!`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Implement tool-specific logic in lib/tools/${toolName}.ts`);
console.log(`   2. Customize React adapter in components/tools/${ToolName}Tool.tsx`);
console.log(`   3. Add tool to DraftsmanCanvas.tsx`);
console.log(`   4. Add tool properties panel controls`);
console.log(`   5. Run tests: npm test -- ${toolName}.test.ts`);
console.log(`\n`);



