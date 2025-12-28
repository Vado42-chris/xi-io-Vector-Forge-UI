# VectorForge Plugin System & Marketplace Architecture

## Overview
VectorForge's hashtag scripting system is designed from the ground up to support a plugin ecosystem and marketplace. Every hashtag command can be extended, packaged, and shared.

## Core Principles
1. **Hashtag-Based Plugin System**: Plugins are collections of hashtag commands with metadata
2. **Serialized Integration**: All plugins use the same hashtag syntax users already know
3. **Marketplace-First Design**: Built-in submission, review, and distribution
4. **Developer Tools**: Full IDE and testing environment within VectorForge
5. **Security & Sandboxing**: Plugins run in isolated execution contexts
6. **Versioning & Updates**: Automatic version management and updates

---

## 1. Plugin Architecture

### Plugin Structure
```typescript
interface VectorForgePlugin {
  // Metadata
  id: string;                    // Unique plugin ID (e.g., "com.user.plugin-name")
  name: string;                   // Display name
  version: string;                // Semantic versioning (e.g., "1.2.3")
  author: string;                 // Author username/ID
  description: string;            // Plugin description
  icon?: string;                  // Plugin icon URL/base64
  tags: string[];                 // Search tags
  
  // Plugin Content
  commands: PluginCommand[];      // New hashtag commands this plugin adds
  extensions: PluginExtension[];  // Extensions to existing commands
  assets: PluginAsset[];          // Images, sounds, presets, etc.
  scripts: string[];              // Hashtag script files
  
  // Marketplace
  marketplace: {
    status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
    price: number;                // Price in credits (0 = free)
    category: string;             // Animation, Interaction, Logic, etc.
    downloads: number;
    rating: number;
    reviews: Review[];
  };
  
  // Technical
  apiVersion: string;             // VectorForge API version required
  dependencies: string[];         // Other plugin IDs this depends on
  permissions: PluginPermission[]; // What the plugin can access
  sandboxed: boolean;            // Run in sandbox (default: true)
  
  // Files
  manifest: string;               // plugin.json content
  files: Record<string, string>;  // All plugin files (scripts, assets, etc.)
}
```

### Plugin Command Definition
```typescript
interface PluginCommand {
  name: string;                   // Command name (e.g., "particle")
  syntax: string;                 // Syntax template
  description: string;            // What it does
  category: string;               // Command category
  parameters: CommandParameter[]; // Parameter definitions
  implementation: string;         // Hashtag script implementation
  examples: string[];            // Usage examples
  icon?: string;                  // Command icon
}
```

---

## 2. Plugin Development Tools

### Plugin Developer IDE
- **Location**: New tab in LeftSidebar: "Plugin Dev"
- **Features**:
  - Code editor with hashtag syntax highlighting
  - Live preview/testing
  - Command palette for plugin commands
  - Asset manager
  - Manifest editor
  - Test runner
  - Debug console

### Plugin Template System
```typescript
interface PluginTemplate {
  name: string;
  description: string;
  structure: {
    'plugin.json': string;        // Manifest template
    'commands/': string[];        // Command definitions
    'scripts/': string[];         // Script files
    'assets/': string[];          // Asset files
    'README.md': string;          // Documentation
  };
}
```

### Development Workflow
1. **Create Plugin**: Use template or start from scratch
2. **Develop**: Write hashtag commands in Plugin Dev IDE
3. **Test**: Run in sandboxed environment
4. **Package**: Generate plugin package (.vfplugin)
5. **Submit**: Upload to marketplace (or use locally)

---

## 3. Plugin Loader & Manager

### Plugin Manager UI
- **Location**: Settings → Plugins
- **Features**:
  - Installed plugins list
  - Enable/disable plugins
  - Update plugins
  - Uninstall plugins
  - View plugin details
  - Open plugin folder

### Plugin Loading System
```typescript
class PluginManager {
  // Load plugin from file or marketplace
  async loadPlugin(pluginId: string, source: 'local' | 'marketplace'): Promise<VectorForgePlugin>;
  
  // Register plugin commands with script parser
  registerPluginCommands(plugin: VectorForgePlugin): void;
  
  // Execute plugin command
  async executePluginCommand(command: string, params: Record<string, any>): Promise<any>;
  
  // Sandbox execution
  async executeInSandbox(script: string, permissions: PluginPermission[]): Promise<any>;
}
```

### Command Registration
When a plugin is loaded:
1. Parse plugin manifest
2. Register new hashtag commands with script parser
3. Add commands to auto-complete
4. Add to command palette
5. Update help/documentation

---

## 4. Marketplace Integration

### Marketplace UI
- **Location**: New tab in LeftSidebar: "Marketplace"
- **Features**:
  - Browse plugins by category
  - Search plugins
  - Filter by price, rating, downloads
  - View plugin details
  - Install plugins
  - Manage purchases

### Marketplace Backend API
```typescript
interface MarketplaceAPI {
  // Browse
  getPlugins(filters: PluginFilters): Promise<PluginListing[]>;
  getPluginDetails(pluginId: string): Promise<VectorForgePlugin>;
  
  // User Actions
  purchasePlugin(pluginId: string): Promise<PurchaseResult>;
  downloadPlugin(pluginId: string, version: string): Promise<PluginPackage>;
  ratePlugin(pluginId: string, rating: number, review: string): Promise<void>;
  
  // Developer Actions
  submitPlugin(plugin: VectorForgePlugin): Promise<SubmissionResult>;
  updatePlugin(pluginId: string, version: string): Promise<void>;
  getSubmissionStatus(pluginId: string): Promise<SubmissionStatus>;
}
```

### Submission Workflow
1. **Develop**: Create plugin in Plugin Dev IDE
2. **Test**: Run through test suite
3. **Package**: Generate .vfplugin file
4. **Submit**: Upload to marketplace
5. **Review**: Automated + manual review process
6. **Publish**: Approved plugins go live
7. **Updates**: Version updates follow same process

---

## 5. Security & Sandboxing

### Permission System
```typescript
type PluginPermission = 
  | 'read-layers'           // Read layer data
  | 'write-layers'          // Modify layers
  | 'read-timeline'          // Read timeline/keyframes
  | 'write-timeline'         // Modify timeline
  | 'network-request'        // Make HTTP requests
  | 'file-system-read'      // Read files
  | 'file-system-write'      // Write files
  | 'local-storage'          // Access localStorage
  | 'execute-commands'       // Execute other hashtag commands
  | 'full-access';           // No restrictions (trusted plugins only)
```

### Sandbox Execution
- Plugins run in isolated JavaScript context
- Limited API access based on permissions
- Resource limits (CPU, memory, execution time)
- Network request restrictions
- File system access restrictions

---

## 6. Plugin Package Format

### .vfplugin File Structure
```
plugin-name-1.0.0.vfplugin
├── plugin.json              # Manifest
├── commands/
│   ├── particle.json        # Command definition
│   └── physics.json
├── scripts/
│   ├── particle-system.vfscript
│   └── physics-engine.vfscript
├── assets/
│   ├── icons/
│   ├── images/
│   └── sounds/
├── README.md
└── CHANGELOG.md
```

### Manifest Schema (plugin.json)
```json
{
  "id": "com.user.particle-system",
  "name": "Particle System",
  "version": "1.0.0",
  "author": "username",
  "description": "Advanced particle effects for animations",
  "icon": "assets/icons/particle.png",
  "tags": ["particles", "effects", "animation"],
  "apiVersion": "1.0.0",
  "dependencies": [],
  "permissions": ["read-layers", "write-layers", "read-timeline"],
  "commands": [
    {
      "name": "particle",
      "syntax": "#particle [target] type:[type] count:[number]",
      "description": "Create particle effect",
      "category": "Effects"
    }
  ],
  "marketplace": {
    "price": 500,
    "category": "Animation"
  }
}
```

---

## 7. Developer Tools Implementation

### Plugin Dev IDE Component
- Full-featured code editor
- Hashtag syntax highlighting
- Auto-complete for plugin API
- Live preview panel
- Test runner
- Debug console
- Asset manager
- Manifest editor

### Plugin Testing Framework
```typescript
interface PluginTest {
  name: string;
  script: string;              // Hashtag script to test
  expectedResult: any;         // Expected outcome
  setup?: string;              // Setup script
  teardown?: string;           // Cleanup script
}
```

---

## 8. User Account Integration

### Account Features
- **Developer Account**: Submit plugins, manage submissions
- **Purchases**: Track purchased plugins
- **Earnings**: Revenue from plugin sales
- **Reviews**: Manage plugin reviews
- **Analytics**: Plugin download/usage stats

### Account UI
- Profile page
- My Plugins (developer)
- My Purchases (user)
- Earnings dashboard (developer)
- Submission history

---

## 9. Implementation Phases

### Phase 1: Core Plugin System
- [ ] Plugin structure/types
- [ ] Plugin loader
- [ ] Command registration
- [ ] Basic sandboxing
- [ ] Plugin Manager UI

### Phase 2: Developer Tools
- [ ] Plugin Dev IDE
- [ ] Plugin templates
- [ ] Test runner
- [ ] Package generator

### Phase 3: Marketplace Foundation
- [ ] Marketplace UI
- [ ] Plugin submission
- [ ] Plugin browsing
- [ ] Basic install/download

### Phase 4: Marketplace Full
- [ ] Payment system
- [ ] Reviews/ratings
- [ ] Search/filtering
- [ ] Update system

### Phase 5: Advanced Features
- [ ] Plugin dependencies
- [ ] Plugin versioning
- [ ] Analytics
- [ ] Developer dashboard

---

## 10. Example: Creating a Plugin

### Step 1: Create Plugin
```
1. Open Plugin Dev tab
2. Click "New Plugin"
3. Choose template: "Animation Effects"
4. Name: "Bounce Effects"
```

### Step 2: Define Command
```json
// commands/bounce.json
{
  "name": "bounce",
  "syntax": "#bounce [target] height:[number] count:[number] duration:[frames]",
  "description": "Bounce animation effect",
  "category": "Animation",
  "parameters": [
    { "name": "height", "type": "number", "required": true },
    { "name": "count", "type": "number", "default": 1 },
    { "name": "duration", "type": "number", "default": 30 }
  ]
}
```

### Step 3: Implement Command
```hashtag
// scripts/bounce.vfscript
#bounce [target] height:[h] count:[c] duration:[d]
  #set variable:frame value:0
  #set variable:direction value:1
  #loop count:[d] commands:
    #set variable:y value:Math.sin(frame / [d] * Math.PI * 2 * [c]) * [h]
    #move [target] y:[y]
    #increment variable:frame amount:1
```

### Step 4: Test
```
1. Open test panel
2. Write test script
3. Run test
4. Verify results
```

### Step 5: Package & Submit
```
1. Click "Package Plugin"
2. Review manifest
3. Click "Submit to Marketplace"
4. Fill in marketplace details
5. Submit for review
```

---

## 11. Integration Points

### With Hashtag System
- Plugin commands appear in auto-complete
- Plugin commands in command palette
- Plugin commands in help/documentation
- Plugin commands execute through same executor

### With Timeline
- Plugin commands can be added to keyframes
- Plugin scripts can be attached to animations
- Plugin effects can be previewed in timeline

### With Marketplace
- Browse plugins from within app
- Install plugins without leaving app
- Update plugins automatically
- Manage purchases/submissions

---

## 12. Technical Considerations

### Performance
- Lazy load plugins (only load when needed)
- Cache plugin commands
- Optimize sandbox execution
- Resource limits per plugin

### Security
- Code signing for trusted plugins
- Automated security scanning
- Manual review for sensitive permissions
- User warnings for risky plugins

### Compatibility
- API versioning
- Backward compatibility
- Migration tools for plugin updates
- Deprecation warnings

---

This architecture makes VectorForge's hashtag scripting system the foundation for a thriving plugin ecosystem and marketplace, where users can easily create, share, and monetize their extensions.

