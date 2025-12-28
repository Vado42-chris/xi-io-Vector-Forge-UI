export type TabType = 'text' | 'image' | 'chat' | 'terminal' | 'settings' | 'ai-assistant';
export type ToolType = 
  // Selection Tools
  | 'select'           // Selection tool (V)
  | 'direct-select'   // Direct selection (A)
  | 'group-select'    // Group selection
  // Drawing Tools
  | 'pen'             // Pen tool (P)
  | 'pencil'          // Pencil tool (N)
  | 'brush'           // Brush tool (B)
  | 'line'            // Line tool (\)
  | 'rectangle'       // Rectangle tool (M)
  | 'ellipse'         // Ellipse tool (L)
  | 'polygon'         // Polygon tool
  | 'star'            // Star tool
  | 'spiral'          // Spiral tool
  // Text Tools
  | 'text'            // Text tool (T)
  | 'text-on-path'    // Text on path
  // Transformation Tools
  | 'rotate'          // Rotate tool (R)
  | 'scale'           // Scale tool (S)
  | 'shear'           // Shear tool
  | 'reflect'         // Reflect tool (O)
  // Shape Tools
  | 'shape-builder'   // Shape builder
  | 'pathfinder'      // Pathfinder operations
  // Utility Tools
  | 'eyedropper'      // Eyedropper tool (I)
  | 'gradient'        // Gradient tool (G)
  | 'mesh'            // Gradient mesh
  | 'blend'           // Blend tool (W)
  | 'symbol-sprayer'  // Symbol sprayer
  // Navigation Tools
  | 'pan'             // Hand tool (H)
  | 'zoom'            // Zoom tool (Z)
  | 'artboard'        // Artboard tool (Shift+O)
  // Special Tools
  | 'perspective'     // Perspective tool
  | 'free-transform' // Free transform (E)
  | 'width'           // Width tool (Shift+W)
  | 'warp'            // Warp tool (Shift+R)
  | 'twirl'           // Twirl tool
  | 'pucker'          // Pucker tool
  | 'bloat'           // Bloat tool
  | 'scallop'         // Scallop tool
  | 'crystallize'     // Crystallize tool
  | 'wrinkle';        // Wrinkle tool

export type MeasurementUnit = 'px' | 'mm' | 'cm' | 'in' | 'pt';

export interface ToolProperties {
  // Common properties (used across multiple tools)
  strokeWidth?: number;
  fill?: string;
  stroke?: string;
  opacity?: number;
  strokeDasharray?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  fillRule?: 'nonzero' | 'evenodd';
  fontSize?: number;
  fontFamily?: string;
  // Pen Tool
  pen?: {
    fill?: boolean;
    stroke?: boolean;
    closePath?: boolean;
    smoothness?: number;
  };
  // Pencil Tool
  pencil?: {
    fidelity?: number; // 0-100
    smoothness?: number; // 0-100
    fillNewPaths?: boolean;
    fill?: boolean;
    stroke?: boolean;
  };
  // Brush Tool
  brush?: {
    brushType?: 'calligraphic' | 'scatter' | 'art' | 'pattern' | 'bristle';
    size?: number;
    opacity?: number;
    flow?: number;
    angle?: number;
    roundness?: number;
  };
  // Text Tool
  text?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    fontStyle?: 'normal' | 'italic';
    alignment?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    tracking?: number;
    leading?: number;
  };
  // Shape Tools
  rectangle?: {
    cornerRadius?: number;
  };
  ellipse?: {
    startAngle?: number;
    endAngle?: number;
  };
  polygon?: {
    sides?: number;
    starPoints?: number;
    innerRadius?: number;
  };
  star?: {
    points?: number;
    innerRadius?: number;
  };
  spiral?: {
    decay?: number;
    turns?: number;
  };
  // Line Tool
  line?: {
    cap?: 'butt' | 'round' | 'square';
    join?: 'miter' | 'round' | 'bevel';
  };
  // Text on Path Tool
  'text-on-path'?: {
    offset?: number;
    flip?: boolean;
  };
  // Free Transform Tool
  'free-transform'?: {
    constrain?: boolean;
    origin?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
  // Reflect Tool
  reflect?: {
    axis?: 'vertical' | 'horizontal' | 'both';
    copy?: boolean;
  };
  // Mesh Tool
  mesh?: {
    rows?: number;
    columns?: number;
  };
  // Eyedropper Tool
  eyedropper?: {
    sampleSize?: 'point' | '3x3' | '5x5' | '11x11';
    sampleAll?: boolean;
  };
  // Transformation Tools
  rotate?: {
    angle?: number;
    referencePoint?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
  scale?: {
    x?: number;
    y?: number;
    uniform?: boolean;
    referencePoint?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
  // Gradient Tool
  gradient?: {
    type?: 'linear' | 'radial' | 'mesh' | 'conic';
    stops?: Array<{ color: string; position: number }>;
    angle?: number;
  };
  zoom?: {
    level?: number;
  };
}

export enum DesignStyle {
  FLAT = 'Flat Icon',
  LINE = 'Line Art',
  ISOMETRIC = 'Isometric',
  ABSTRACT = 'Abstract'
}

export enum AIProvider {
  GEMINI_FLASH = 'Gemini 3 Flash',
  GEMINI_PRO = 'Gemini 3 Pro',
}

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

// --- Parametric Shape System ---

export interface VectorNode {
  id: string;
  x: number;
  y: number;
  type: 'move' | 'line' | 'cubic' | 'close';
  cx1?: number; // Control point 1
  cy1?: number;
  cx2?: number; // Control point 2
  cy2?: number;
  isKinetic?: boolean;
}

export interface Path {
  type: 'path';
  nodes: VectorNode[];
  d?: string; // SVG path data string (for compatibility)
}

export interface ParametricRectangle {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
}

export interface TextShape {
  type: 'text';
  content: string;
  x: number;
  y: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface EllipseShape {
  type: 'ellipse';
  x: number; // Center x
  y: number; // Center y
  radiusX: number;
  radiusY: number;
}

export type Shape = Path | ParametricRectangle | TextShape | EllipseShape;

// --- End Parametric Shape System ---

export interface VectorLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion';
  shape: Shape;
  isRigged?: boolean;
  clippingMask?: boolean;
  mask?: string; // Layer ID of mask
  children?: VectorLayer[]; // Nested layers for groups
  effects?: Array<{
    type: 'drop-shadow' | 'inner-shadow' | 'blur' | 'glow';
    properties: Record<string, any>;
  }>;
}

export interface AppState {
  activeTab: TabType;
  activeTool: ToolType;
  toolProperties: ToolProperties;
  measurementUnit: MeasurementUnit;
  prompt: string;
  isGenerating: boolean;
  style: DesignStyle;
  complexity: number;
  credits: number;
  layers: VectorLayer[];
  selectedLayerId: string | null;
  selectedNodeId: string | null;
  zoom: number;
  pan: { x: number, y: number };
  currentSvg: string;
  history: string[];
  redoHistory: string[];
  snapshots: { id: string; name: string; svg: string; timestamp: number }[];
  chatHistory: { role: 'user' | 'assistant' | 'system'; content: string; timestamp: number }[];
  terminalLogs: { id: string; type: 'info' | 'error' | 'success' | 'command'; text: string; timestamp: number }[];
  terminalHistory: string[];
  toasts: Array<{ id: string; message: string; type: 'info' | 'success' | 'error' | 'warning' }>;
  guides: { id: string, type: 'h' | 'v', pos: number }[];
  showRulers: boolean;
  workspaceLayout: 'default' | 'custom';
  dockedPanels: Array<{ id: string; position: 'left' | 'right' | 'bottom'; size: number }>;
  engineConfig: {
    provider: AIProvider;
    apiKey: string;
    thinkingBudget: number;
  };
  mcpServers?: Array<{
    id: string;
    name: string;
    url: string;
    enabled: boolean;
  }>;
}

// --- Animation System ---

export interface AnimationKeyframe {
  id: string;
  frame: number;
  layerId: string;
  properties: {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
    opacity?: number;
    [key: string]: any;
  };
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic';
  script?: string; // Hashtag script commands for this keyframe
}

export interface AnimationPath {
  id: string;
  layerId: string;
  type: 'linear' | 'bezier' | 'arc';
  points: { x: number; y: number; frame: number }[];
  loop: boolean;
}

export interface AnimationPreset {
  id: string;
  name: string;
  category: 'entrance' | 'exit' | 'emphasis' | 'motion';
  properties: Partial<AnimationKeyframe['properties']>;
  duration: number;
  easing: AnimationKeyframe['easing'];
}

export interface FrameState {
  currentFrame: number;
  totalFrames: number;
  fps: number;
  isPlaying: boolean;
  isLooping: boolean;
}
