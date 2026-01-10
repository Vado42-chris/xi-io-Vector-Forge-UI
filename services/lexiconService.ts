
export type LexiconCategory = 'NAVIGATION' | 'ENGINE' | 'MARKET' | 'GEOMETRY' | 'TOOLS' | 'VIEWS' | 'ECONOMY';

interface LexiconEntry {
  sovereign: string;
  plain: string;
  description: string;
}

const LEXICON: Record<string, LexiconEntry> = {
  // Navigation & Shell
  'PROJECT_NEXUS': { sovereign: 'Project_Nexus', plain: 'Management Hub', description: 'The central hub for managing tasks, team members, and overall project progress.' },
  'FORGE_SHELL': { sovereign: 'Forge_Shell', plain: 'Design Studio', description: 'The main interactive area where visual and logic design happens.' },
  
  // Economy & Compute (Phase 3)
  'HASH_POWER': { sovereign: 'Hash_Power', plain: 'Compute Contribution', description: 'The amount of GPU processing power you are lending to the AI network.' },
  'COMPUTE_YIELD': { sovereign: 'Compute_Yield', plain: 'Earnings from Mining', description: 'Credits earned by providing distributed compute to other users.' },
  'PEER_GRID': { sovereign: 'Peer_Grid_Swarm', plain: 'Network Map', description: 'A real-time map of all computers currently sharing the AI processing load.' },
  'SOVEREIGN_RIGHT': { sovereign: 'Sovereign_Right_Repair', plain: 'Owner Modifiable', description: 'Confirms you have the full legal and technical right to modify and resell this shard.' },
  'TRAINING_UPLINK': { sovereign: 'Training_Uplink', plain: 'AI Data Sharing', description: 'Opt-in service where your design patterns help train the engine in exchange for lower fees.' },
  'BITCOIN_BRIDGE': { sovereign: 'Bitcoin_Bridge', plain: 'BTC Cashout', description: 'Convert your industrial CORE credits into sovereign Bitcoin rewards.' },
  'SUBSCRIPTION_BENEFITS': { sovereign: 'Sovereign_Privilege_Matrix', plain: 'Access Levels', description: 'Tiered benefits based on your data contribution and network membership.' },
  'ANT_PIPELINE': { sovereign: 'ANT_Orchestrator', plain: 'Background Agents', description: 'Autonomous Network Transports managing silent shard synchronization across the VPN tunnel.' },
  'API_BLACKHOLE': { sovereign: 'Ingress_Event_Horizon', plain: 'Fast Data Ingestion', description: 'High-speed ingestion portal for pulling complex manifests from the global registry.' },
  'SERIALIZED_HASHTAGS': { sovereign: 'Providence_Signatures', plain: 'Ownership Tracking', description: 'Immutable #Tags embedded in shards to track original authors and secondary royalties.' },

  // Studio Workflows (Phase 4)
  'COMPOSITING_NEXUS': { sovereign: 'Compositing_Manifold', plain: 'Visual Layering', description: 'A multi-modal stage where React UI, Alpha-Transparent movies, and Unreal Engine assets are unified.' },
  'STUDIO_ONBOARDING': { sovereign: 'Studio_Knowledge_Bake', plain: 'Team Training', description: 'A tool for studio leads to record and standardize internal design processes for new hires.' },
  'FILE_EXPLORER': { sovereign: 'Studio_Inventory_Vault', plain: 'File Manager', description: 'Hardened project explorer for managing .forge studio manifests without file bleed.' },
  'ROLE_COMPOSITING': { sovereign: 'Compositor_Level', plain: 'Compositing Mode', description: 'Switch to a layout-first view optimized for multi-layer visual alignment.' },
  'MANIFOLD_GRID': { sovereign: 'Manifold_Quad_Grid', plain: 'Multi-Viewport', description: 'Professional 4-quadrant layout for precision NURBS 2.0 geometric modeling.' },
  'HEURISTIC_HANDSHAKE': { sovereign: 'Heuristic_Handshake', plain: 'Standard Recording', description: 'Process of recording lead-standard actions to train the engine on specific studio hygiene.' },
  'RADIOSITY_FORGE': { sovereign: 'Radiosity_Forge', plain: 'Lighting Engine', description: 'Calculates physically based light bounces (PBR) on NURBS surfaces for 1:1 Unreal Lumen parity.' },

  // Tools
  'GESTALT_SELECT': { sovereign: 'Gestalt_Select', plain: 'Direct Selection', description: 'Select entire objects or groups on the canvas.' },
  'PATH_FORGE': { sovereign: 'Path_Forge', plain: 'Pen Tool', description: 'Draw custom vector paths point-by-point.' },
  'PRIMITIVE_BUILDER': { sovereign: 'Primitive_Builder', plain: 'Shape Tool', description: 'Quickly create standard shapes like squares and circles.' },
  'TRANSFORM': { sovereign: 'Spatial_Warp', plain: 'Transform Tool', description: 'Scale, rotate, and skew shards within the compositing manifold.' },
  'KNIFE': { sovereign: 'Alpha_Cutter', plain: 'Splitting Tool', description: 'Cut and divide movie shards or vector paths with precision.' },
  'MEASURE': { sovereign: 'Friction_Auditor', plain: 'Measure Tool', description: 'Audit the distance and visual weight between interface nodes.' },

  // Economic & Market
  'CORE_YIELD': { sovereign: 'Core_Yield', plain: 'Account Balance', description: 'The amount of currency available in your wallet for purchases and listing fees.' },
  'FORGE_EXCHANGE': { sovereign: 'Forge_Exchange', plain: 'Marketplace', description: 'A global store to buy and sell design assets with other users.' },
  'INJECT_SHARD': { sovereign: 'Inject_Shard', plain: 'Add to Project', description: 'Instantly import a marketplace component into your current workspace.' },
  'REGISTRY_STREAM': { sovereign: 'Registry_Mainnet_Stream', plain: 'Global Asset List', description: 'The live list of all items available for purchase or licensing.' },
  
  // Views
  'CANVAS_2D': { sovereign: 'Artboard_2D', plain: 'Drawing Surface', description: 'Standard 2D canvas for vector design.' },
  'COMPUTE_ORCHESTRATOR': { sovereign: 'Compute_Orchestrator', plain: 'Mining Dashboard', description: 'Manage your contribution to the distributed AI processing network.' },
  'BLOCKCHAIN_LEDGER': { sovereign: 'Blockchain_Ledger', plain: 'Payment History', description: 'Immutable record of all your earnings and purchases on the xi-io grid.' },
  'TRAINING_OPT_IN': { sovereign: 'Training_Nexus', plain: 'Data Controls', description: 'Manage how much design data you share with the AI Swarm.' }
};

export const translate = (key: string, verbose: boolean): string => {
  const entry = LEXICON[key];
  if (!entry) return key.replace(/_/g, ' ');
  return verbose ? entry.plain : entry.sovereign;
};

export const getDefinition = (key: string): string => {
  return LEXICON[key]?.description || 'Industrial component mapping.';
};
