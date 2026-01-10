

export type TabType = 'forge' | 'chat' | 'terminal' | 'settings';
export type ToolType = 
  | 'select' | 'subselect' | 'pen' | 'rect' | 'ellipse' | 'text' 
  | 'pan' | 'zoom' | 'extrude' | 'rotate3d' | 'bone' | 'emitter' | 'light'
  | 'transform' | 'knife' | 'measure'
  | 'directive_add' | 'agent_dispatch' | 'trajectory_plot' | 'shard_link';

export type ViewType = 
  | 'CANVAS_2D' | 'CANVAS_3D' | 'TERMINAL' | 'AI_SYNTHESIS' | 'NODE_GRAPH' 
  | 'TIMELINE' | 'SCENE_EXPLORER' | 'PROJECT_NEXUS' | 'INTEROP_BRIDGE' 
  | 'ASSET_VAULT' | 'SCRIPT_EDITOR' | 'MOTION_FORGE' | 'SKELETON_VIEW'
  | 'VFX_FLUX' | 'LUCID_STAGE' | 'NEURAL_AUDITOR' | 'CODE_KERNEL'
  | 'ORBITAL_SIM' | 'GLOBAL_BROWSER' | 'MCP_TESTER' | 'ROSETTA_CORE'
  | 'ROSETTA_BRIDGE' | 'UX_SIMULAB' | 'REASONING_ENGINE' | 'MARKETPLACE_NEXUS'
  | 'WALLET_NEXUS' | 'PLUGIN_FORGE' | 'COLOSSEUM_TESTER' | 'MCP_REGISTRY'
  | 'OMNI_THREAD'; // New fractal chat view

export enum WorkflowPhase { IDEATION = 'Ideation', SKELETON = 'Skeleton', SYNTHESIS = 'Synthesis', DEPLOY = 'Deploy' }
export enum ViewportMode { SVG_2D = 'SVG_2D', PERSPECTIVE_3D = 'PERSPECTIVE_3D', ORTHO_TOP = 'ORTHO_TOP', ORTHO_SIDE = 'ORTHO_SIDE', ORTHO_FRONT = 'ORTHO_FRONT' }
export enum UnitSystem { PIXELS = 'PX', MILLIMETERS = 'MM', NORMALIZED = '0-1' }

export interface CognitiveMessage {
  role: 'operator' | 'conductor' | 'user' | 'model';
  content: string;
  meta?: string;
  attachments?: { name: string, type: string, data?: string }[];
  swarmResponse?: boolean;
}

export interface CognitiveTrace {
  id: string;
  timestamp: string;
  summary: string;
  sentiment: number;
  tokensReferenced: number;
  history: CognitiveMessage[];
}

export interface Persona { 
  username: string; 
  title: string;
  avatarUrl: string; 
  nodeStatus: 'online' | 'stealth' | 'offline'; 
  dotfileId: string; 
  trustScore: number;
  shardYield: number;
  cognitiveDepth: number; 
  traces: CognitiveTrace[];
  permissions: {
    coreMutation: boolean;
    marketInjection: boolean;
    deepReasoning: boolean;
  }
}

// Added missing DesignStyle type
export type DesignStyle = 'Flat' | 'Isometric' | 'Abstract';

// Added missing Guide interface
export interface Guide {
  id: string;
  axis: 'x' | 'y' | 'z' | 'p';
  position: number;
  locked: boolean;
}

// Added missing DirectiveStatus type
export type DirectiveStatus = 'BACKLOG' | 'ASSEMBLY' | 'TESTING' | 'DEPLOYED';

// Added missing Directive interface
export interface Directive {
  id: string;
  title: string;
  description: string;
  status: DirectiveStatus;
  priority: 'CRITICAL' | 'NORMAL';
  progress: number;
}

// Added missing Agent interface
export interface Agent {
  id: string;
  name: string;
  type: string;
  avatarUrl: string;
  load: number;
}

// Added missing DeploymentCycle interface
export interface DeploymentCycle {
  id: string;
  name: string;
  isCurrent: boolean;
}

// Added missing ProjectTemplate enum
export enum ProjectTemplate {
  BLANK_CANVAS = 'BLANK_CANVAS',
  ANIMATION_TIMELINE = 'ANIMATION_TIMELINE',
  PARTICLE_SYSTEM = 'PARTICLE_SYSTEM',
  TASK_BOARD = 'TASK_BOARD'
}

// Added missing CloudPackage interface
export interface CloudPackage {
  id: string;
  name: string;
  description: string;
  type: ShardType;
  size: string;
  author: string;
  stability: 'STABLE' | 'EXPERIMENTAL' | 'BETA';
  category: 'THEME' | 'EXTENSION' | 'SNIPPET' | 'PLUGIN';
  price?: number;
}

export interface AppState {
  activeRole: WorkspaceRole;
  activePhase: WorkflowPhase;
  activeTool: ToolType;
  prompt: string;
  isGenerating: boolean;
  style: DesignStyle;
  credits: number;
  layers: VectorLayer[];
  selectedLayerId: string | null;
  // Fixed selection types to allow IDs
  selectedDirectiveId: string | null;
  selectedAgentId: string | null;
  selectedNodeId: string | null;
  zoom: number;
  pan: { x: number, y: number };
  views: SovereignViewConfig[];
  presets: WorkspacePreset[];
  activePresetId: string;
  isProjectOpen: boolean;
  projectName: string;
  manifestId: string;
  persona: Persona;
  shards: FileShard[];
  currentFrame: number;
  totalFrames: number;
  engineConfig: { provider: AIProvider; apiKey: string; };
  showGrid: boolean;
  showRulers: boolean;
  snapToGrid: boolean;
  snapToGuides: boolean;
  unitSystem: UnitSystem;
  guides: Guide[];
  complexity: number;
  viewportMode: ViewportMode;
  directives: Directive[];
  agents: Agent[];
  cycles: DeploymentCycle[];
  recentManifests: Manifest[];
  activeChatHistory: CognitiveMessage[];
  isChatOpen: boolean;
}

export enum WorkspaceRole { MODELING = 'Modeling', ANIMATION = 'Animation', VFX_FLUX = 'VFX Flux', COMPOSITING = 'Compositing', CODE_TERMINAL = 'Logic Forge', VECTOR_DESIGN = 'Vector', SKELETON_RIG = 'Skeleton', FLUX_PARTICLES = 'Flux', LUX_STAGE = 'Lighting', MANIFOLD_WARP = 'Manifold', PROJECT_NEXUS = 'Nexus', ENGINE_DEV = 'Development' }
export enum AIProvider { GEMINI_FLASH = 'gemini-3-flash-preview', GEMINI_PRO = 'gemini-3-pro-preview', SWARM = 'SWARM_ORCHESTRATOR' }
export interface VectorNode { id: string; x: number; y: number; z?: number; type: 'move' | 'line' | 'cubic' | 'close'; cx1?: number; cy1?: number; cx2?: number; cy2?: number; }
export interface VectorLayer { id: string; name: string; visible: boolean; locked: boolean; color: string; stroke: string; strokeWidth: number; opacity: number; nodes: VectorNode[]; tags?: string[]; position?: { x: number, y: number, z: number }; rotation?: { x: number, y: number, z: number }; }
export interface Manifest { id: string; name: string; lastModified: string; role: WorkspaceRole; }
export interface FileShard { id: string; name: string; type: ShardType; isActive: boolean; size?: string; lastModified?: string; content?: any; }
export type ShardType = 'vector' | '3d_mesh' | 'audio' | 'video' | 'script' | 'task_list' | 'roadmap' | 'shader' | 'logic_kernel';
export interface SovereignViewConfig { id: string; type: ViewType; mode: ViewportMode; isVisible: boolean; isFocused: boolean; isDetached: boolean; isMaximized?: boolean; width?: string | number; height?: string | number; activeTool: ToolType; }
export interface WorkspacePreset { id: string; name: string; views: SovereignViewConfig[]; }
export interface ChatMessage { role: 'user' | 'model'; text: string; attachments?: { name: string, type: string, data?: string }[]; }
