
export type ShellMode = 'STUDIO' | 'EXCHANGE' | 'VAULT' | 'LEDGER' | 'ONBOARDING';

export type ViewportType = 
  | 'PERSPECTIVE' 
  | 'ORTHO_TOP' 
  | 'ORTHO_SIDE' 
  | 'ORTHO_FRONT' 
  | 'CANVAS_2D' 
  | 'NODE_GRAPH' 
  | 'TIMELINE_EDITOR'
  | 'CODE_IDE'
  | 'LUX_COMPOSITOR'
  | 'AUDIO_SIGNAL'
  | 'DEPENDENCY_GRAPH';

export interface CameraState {
  offset: { x: number, y: number };
  zoom: number;
  pitch: number;
  yaw: number;
}

export enum WorkspaceRole { 
  MODELING = 'Modeling', 
  ANIMATION = 'Animation', 
  VFX_FLUX = 'VFX Flux', 
  COMPOSITING = 'Compositing', 
  LOGIC_FORGE = 'Logic Forge', 
  VECTOR_DESIGN = 'Vector Design', 
  SKELETON_RIG = 'Skeleton Rig',
  PROJECT_NEXUS = 'Project Nexus',
  LUX_STAGE = 'Lux Stage'
}

export type ToolType = 
  | 'select' | 'subselect' | 'lasso'
  | 'pen' | 'anchor_add' | 'anchor_point' | 'curvature'
  | 'rect' | 'ellipse' | 'polygon' | 'star'
  | 'rotate' | 'scale' | 'reflect' | 'shear' | 'transform'
  | 'knife' | 'scissors' | 'eraser'
  | 'pan' | 'zoom' | 'measure'
  | 'bone' | 'emitter' | 'directive_add' | 'agent_dispatch' | 'trajectory_plot' | 'shard_link'
  | 'light_point' | 'light_spot' | 'lux_probe';

export enum ViewportMode { SVG_2D = 'SVG_2D', PERSPECTIVE_3D = 'PERSPECTIVE_3D' }
export enum UnitSystem { PIXELS = 'PX', MILLIMETERS = 'MM', NORMALIZED = '0-1' }

export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  path: string;
  hashtags: string[];
  lastModified: number;
  authorId: string;
  isIsolated: boolean; 
}

export interface ProjectManifest {
  id: string;
  name: string;
  studioName: string;
  version: string;
  files: ProjectFile[];
  compositing: {
    layers: { fileId: string; opacity: number; blendMode: string; zIndex: number; }[];
  };
}

export interface MiningState { isMining: boolean; hashRate: number; totalContributed: number; sessionYield: number; networkDifficulty: number; }
export interface ANTPipeline { activeAgents: number; packetsInFlight: number; tunnelStatus: string; bandwidth: string; }

export type SubscriptionTier = 'BASIC' | 'PRO' | 'ENTERPRISE';
export type ShardType = 'vector' | 'script' | 'audio' | 'video' | 'logic_kernel' | 'shader' | '3d_mesh';

export interface FileShard { id: string; name: string; type: ShardType; size: string; content?: string; }
export interface Guide { id: string; axis: 'x' | 'y'; position: number; locked: boolean; }
export type DirectiveStatus = 'BACKLOG' | 'ASSEMBLY' | 'TESTING' | 'DEPLOYED';

export interface ReasoningStep { id: string; label: string; logic: string; impact: number; status: 'PENDING' | 'RESOLVED'; }
export interface Directive { id: string; title: string; description: string; status: DirectiveStatus; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; progress: number; trajectory?: { steps: ReasoningStep[]; }; }
export interface Agent { id: string; name: string; avatarUrl: string; isIdle: boolean; load: number; specialization: string; }
export interface DeploymentCycle { id: string; name: string; isCurrent: boolean; }
export interface Manifest { id: string; name: string; role: string; }
export interface ChatMessage { role: 'user' | 'model'; text: string; }
export type AssetCategory = 'WIDGETS' | 'THEMES' | 'SCRIPTS' | 'APPS' | '3D' | 'AUDIO' | 'VIDEO' | 'SERVICES';

export interface CloudPackage {
  id: string;
  name: string;
  description: string;
  type: string;
  size: string;
  author: string;
  stability: 'STABLE' | 'EXPERIMENTAL' | 'BETA';
  category: AssetCategory;
  price?: number;
  provenance?: {
    rootAuthorId: string;
    derivationDepth: number;
    serializedHashtags: string[];
    royaltySplit: number;
  };
}

export interface CognitiveMessage { role: 'operator' | 'kernel'; content: string; }
export interface CognitiveTrace { id: string; timestamp: string; summary: string; history: CognitiveMessage[]; }
export interface Interaction { id: string; type: 'MENTORSHIP' | 'TRANSACTION' | 'COLLABORATION'; peerId: string; memo: string; impact: number; timestamp: number; }
export interface ActionPacket { type: string; payload: any; timestamp: number; origin: string; context: any; }
export interface KernelState { status: 'STABLE' | 'BUSY' | 'OFFLINE'; metrics: any; }
export interface PeerNode { id: string; status: 'ACTIVE' | 'STANDBY'; latency: number; }
export interface TrainingConfig { optInDepth: number; benefitLevel: number; }

export interface Persona { 
  username: string; 
  title: string; 
  avatarUrl: string; 
  nodeStatus: 'online' | 'offline' | 'away'; 
  dotfileId: string; 
  trustScore: number; 
  shardYield: number; 
  cognitiveDepth: number; 
  rank: string;
  level: number;
  xp: number;
  xpToNext: number;
  communityImpact: number;
  traces: CognitiveTrace[]; 
  interactions: Interaction[];
  permissions: { coreMutation: boolean; marketInjection: boolean; deepReasoning: boolean; };
}

export interface AppState {
  shellMode: ShellMode;
  activeRole: WorkspaceRole;
  activeTool: ToolType;
  prompt: string;
  isGenerating: boolean;
  style: string;
  credits: number;
  layers: VectorLayer[];
  selectedLayerId: string | null;
  selectedDirectiveId?: string | null;
  zoom: number;
  pan: { x: number, y: number };
  views: SovereignViewConfig[];
  isProjectOpen: boolean;
  projectName: string;
  activeManifest?: ProjectManifest;
  persona: Persona;
  currentFrame: number;
  totalFrames: number;
  showGrid: boolean;
  showRulers: boolean;
  unitSystem: UnitSystem;
  guides: Guide[];
  complexity: number;
  entropySeed: string;
  viewportMode: ViewportMode;
  directives: Directive[];
  agents: Agent[];
  miningState: MiningState;
  antPipeline: ANTPipeline;
  peers: PeerNode[];
  savedLayouts: Record<string, SovereignViewConfig[]>;
  viewportSync?: { groupId: string; isSynced: boolean; masterViewId: string; coordinateSpace: string; };
}

export interface VectorNode { id: string; x: number; y: number; type: 'move' | 'line' | 'cubic' | 'close'; cx1?: number; cy1?: number; cx2?: number; cy2?: number; }
export interface VectorLayer { id: string; name: string; visible: boolean; locked: boolean; color: string; stroke: string; strokeWidth: number; opacity: number; nodes: VectorNode[]; position?: { x: number, y: number, z: number }; }
export interface SovereignViewConfig { id: string; type: ViewportType; isFocused: boolean; activeShardId?: string; camera: CameraState; }

export enum ProjectTemplate { 
  VECTOR_DESIGN = 'VECTOR_DESIGN', 
  SKELETON_RIG = 'SKELETON_RIG',
  ANIMATION_TIMELINE = 'ANIMATION_TIMELINE',
  CODE_FORGE = 'CODE_FORGE',
  PROJECT_NEXUS = 'PROJECT_NEXUS',
  LUX_COMPOSITING = 'LUX_COMPOSITING'
}

export enum AIProvider { 
  GEMINI_PRO = 'gemini-3-pro-preview',
  GEMINI_FLASH = 'gemini-3-flash-preview',
  SWARM = 'SWARM'
}
