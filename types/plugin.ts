/**
 * #hashtag: plugin-types
 * #purpose: TypeScript types for VectorForge plugin system
 * #provides: Type definitions for plugins, commands, marketplace, and developer tools
 * #usage: Import types for plugin development and marketplace integration
 * #related: scriptParser, scriptExecutor, naturalLanguageTranslator
 * 
 * Plugin System Type Definitions
 * Follows Xibalba standards: TypeScript strict mode, comprehensive types
 */

// ============================================================================
// Core Plugin Types
// ============================================================================

export interface VectorForgePlugin {
  // Metadata
  id: string;                    // Unique plugin ID (e.g., "com.user.plugin-name")
  name: string;                   // Display name
  version: string;                // Semantic versioning (e.g., "1.2.3")
  author: string;                 // Author username/ID
  authorId: string;               // Author account ID
  description: string;            // Plugin description
  icon?: string;                  // Plugin icon URL/base64
  tags: string[];                 // Search tags
  license: 'free' | 'paid' | 'open-source' | 'commercial';
  
  // Plugin Content
  commands: PluginCommand[];      // New hashtag commands this plugin adds
  extensions: PluginExtension[];   // Extensions to existing commands
  assets: PluginAsset[];          // Images, sounds, presets, etc.
  scripts: PluginScript[];        // Hashtag script files
  
  // Marketplace
  marketplace: PluginMarketplace;
  
  // Technical
  apiVersion: string;             // VectorForge API version required
  dependencies: PluginDependency[]; // Other plugin IDs this depends on
  permissions: PluginPermission[]; // What the plugin can access
  sandboxed: boolean;             // Run in sandbox (default: true)
  
  // Files
  manifest: PluginManifest;       // plugin.json content
  files: Record<string, string>;   // All plugin files (scripts, assets, etc.)
  
  // Timestamps
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  icon?: string;
  tags: string[];
  license: 'free' | 'paid' | 'open-source' | 'commercial';
  apiVersion: string;
  dependencies: PluginDependency[];
  permissions: PluginPermission[];
  sandboxed: boolean;
  commands: PluginCommandDefinition[];
  scripts?: string[];
  assets?: string[];
}

export interface PluginCommand {
  name: string;                   // Command name (e.g., "particle")
  syntax: string;                 // Syntax template
  description: string;            // What it does
  category: string;               // Command category
  parameters: CommandParameter[]; // Parameter definitions
  implementation: string;         // Hashtag script implementation
  examples: string[];            // Usage examples
  icon?: string;                  // Command icon
  pluginId: string;              // Plugin that owns this command
}

export interface PluginCommandDefinition {
  name: string;
  syntax: string;
  description: string;
  category: string;
  parameters: CommandParameter[];
  examples?: string[];
  icon?: string;
}

export interface CommandParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'layer' | 'command';
  required: boolean;
  default?: any;
  description?: string;
  validation?: string;            // Validation regex or expression
}

export interface PluginExtension {
  extends: string;                // Command name being extended
  hooks: PluginHook[];            // Extension points
  implementation: string;         // Hashtag script
}

export interface PluginHook {
  type: 'before' | 'after' | 'around' | 'error';
  command: string;
  script: string;
}

export interface PluginAsset {
  id: string;
  name: string;
  type: 'image' | 'sound' | 'preset' | 'template' | 'other';
  path: string;
  url?: string;
  size: number;
  mimeType?: string;
}

export interface PluginScript {
  id: string;
  name: string;
  path: string;
  content: string;
  type: 'command' | 'library' | 'utility';
}

export interface PluginDependency {
  pluginId: string;
  version: string;                // Version requirement (e.g., ">=1.0.0")
  optional: boolean;
}

// ============================================================================
// Marketplace Types
// ============================================================================

export interface PluginMarketplace {
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'unpublished';
  price: number;                  // Price in credits (0 = free)
  category: string;               // Animation, Interaction, Logic, etc.
  downloads: number;
  rating: number;                 // Average rating (0-5)
  reviewCount: number;
  reviews: PluginReview[];
  featured: boolean;
  promotion?: PluginPromotion;
}

export interface PluginReview {
  id: string;
  userId: string;
  username: string;
  rating: number;                 // 1-5 stars
  comment: string;
  helpful: number;                // Helpful votes
  createdAt: number;
  updatedAt: number;
}

export interface PluginPromotion {
  type: 'sale' | 'new' | 'featured' | 'trending';
  discount?: number;              // Percentage discount
  startDate: number;
  endDate: number;
}

export interface PluginListing {
  id: string;
  name: string;
  author: string;
  version: string;
  description: string;
  icon?: string;
  price: number;
  category: string;
  rating: number;
  reviewCount: number;
  downloads: number;
  tags: string[];
  featured: boolean;
  status: 'published' | 'unpublished';
}

export interface PluginFilters {
  category?: string;
  priceRange?: { min: number; max: number };
  rating?: number;
  tags?: string[];
  author?: string;
  search?: string;
  sortBy?: 'relevance' | 'rating' | 'downloads' | 'price' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// Developer Tools Types
// ============================================================================

export interface PluginTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  structure: PluginTemplateStructure;
  files: Record<string, string>;  // Template files with placeholders
}

export interface PluginTemplateStructure {
  'plugin.json': string;
  'commands/': string[];
  'scripts/': string[];
  'assets/': string[];
  'tests/': string[];
  'README.md': string;
  'CHANGELOG.md': string;
}

export interface PluginTest {
  id: string;
  name: string;
  description?: string;
  script: string;                 // Hashtag script to test
  expectedResult: any;            // Expected outcome
  setup?: string;                 // Setup script
  teardown?: string;              // Cleanup script
  timeout?: number;               // Test timeout in ms
}

export interface PluginTestResult {
  testId: string;
  passed: boolean;
  error?: string;
  actualResult?: any;
  executionTime: number;
}

// ============================================================================
// Plugin Manager Types
// ============================================================================

export interface PluginManagerState {
  installedPlugins: InstalledPlugin[];
  enabledPlugins: Set<string>;
  loadingPlugins: Set<string>;
  errorPlugins: Map<string, string>;
}

export interface InstalledPlugin {
  plugin: VectorForgePlugin;
  installedAt: number;
  updatedAt: number;
  enabled: boolean;
  source: 'local' | 'marketplace';
  updateAvailable?: string;       // New version available
}

export interface PluginLoadResult {
  success: boolean;
  plugin?: VectorForgePlugin;
  error?: string;
  warnings?: string[];
}

// ============================================================================
// Permission & Security Types
// ============================================================================

export type PluginPermission = 
  | 'read-layers'           // Read layer data
  | 'write-layers'          // Modify layers
  | 'read-timeline'         // Read timeline/keyframes
  | 'write-timeline'        // Modify timeline
  | 'network-request'       // Make HTTP requests
  | 'file-system-read'      // Read files
  | 'file-system-write'     // Write files
  | 'local-storage'         // Access localStorage
  | 'execute-commands'      // Execute other hashtag commands
  | 'full-access';          // No restrictions (trusted plugins only)

export interface PluginSecurityContext {
  pluginId: string;
  permissions: PluginPermission[];
  sandboxed: boolean;
  resourceLimits: {
    maxExecutionTime: number;    // ms
    maxMemoryUsage: number;         // bytes
    maxNetworkRequests: number;
  };
}

// ============================================================================
// Account & User Types
// ============================================================================

export interface DeveloperAccount {
  userId: string;
  username: string;
  email: string;
  plugins: string[];              // Plugin IDs
  earnings: number;               // Total earnings in credits
  submissions: PluginSubmission[];
  analytics: DeveloperAnalytics;
}

export interface PluginSubmission {
  pluginId: string;
  submittedAt: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
  reviewerId?: string;
  reviewedAt?: number;
}

export interface DeveloperAnalytics {
  totalDownloads: number;
  totalRevenue: number;
  pluginStats: Map<string, PluginStats>;
}

export interface PluginStats {
  downloads: number;
  revenue: number;
  ratings: number;
  reviews: number;
  activeUsers: number;
}

// ============================================================================
// API Types
// ============================================================================

export interface MarketplaceAPI {
  // Browse
  getPlugins(filters: PluginFilters): Promise<PluginListing[]>;
  getPluginDetails(pluginId: string): Promise<VectorForgePlugin>;
  getPluginVersions(pluginId: string): Promise<string[]>;
  
  // User Actions
  purchasePlugin(pluginId: string): Promise<PurchaseResult>;
  downloadPlugin(pluginId: string, version: string): Promise<PluginPackage>;
  ratePlugin(pluginId: string, rating: number, review: string): Promise<void>;
  updatePluginRating(pluginId: string, reviewId: string, rating: number, review: string): Promise<void>;
  
  // Developer Actions
  submitPlugin(plugin: VectorForgePlugin): Promise<SubmissionResult>;
  updatePlugin(pluginId: string, version: string, plugin: Partial<VectorForgePlugin>): Promise<void>;
  getSubmissionStatus(pluginId: string): Promise<SubmissionStatus>;
  unpublishPlugin(pluginId: string): Promise<void>;
  
  // Account
  getDeveloperAccount(): Promise<DeveloperAccount>;
  getPurchases(): Promise<InstalledPlugin[]>;
}

export interface PurchaseResult {
  success: boolean;
  transactionId: string;
  plugin: VectorForgePlugin;
  error?: string;
}

export interface PluginPackage {
  plugin: VectorForgePlugin;
  files: Record<string, ArrayBuffer>;  // File contents
  signature?: string;                   // Code signature
}

export interface SubmissionResult {
  success: boolean;
  submissionId: string;
  pluginId: string;
  message?: string;
}

export interface SubmissionStatus {
  pluginId: string;
  status: 'pending' | 'under-review' | 'approved' | 'rejected' | 'needs-changes';
  reviewNotes?: string;
  reviewerId?: string;
  reviewedAt?: number;
}

