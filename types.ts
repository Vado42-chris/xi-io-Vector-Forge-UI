
export type TabType = 'text' | 'image' | 'chat' | 'terminal' | 'settings';
export type ToolType = 'select' | 'subselect' | 'pan' | 'pencil' | 'shape';

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
}

export interface ParametricRectangle {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
}

// Add other parametric shapes here in the future, e.g., Ellipse, Polygon
// export interface ParametricEllipse { ... }

export type Shape = Path | ParametricRectangle;

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
  shape: Shape;
  isRigged?: boolean;
}

export interface AppState {
  activeTab: TabType;
  activeTool: ToolType;
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
  guides: { id: string, type: 'h' | 'v', pos: number }[];
  showRulers: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  engineConfig: {
    provider: AIProvider;
    apiKey: string;
    thinkingBudget: number;
  };
}
