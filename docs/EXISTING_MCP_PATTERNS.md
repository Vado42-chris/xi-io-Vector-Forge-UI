# Existing MCP Patterns & Reusable Code
**Date:** January 27, 2025  
**Purpose:** Document existing MCP server implementations and deployment patterns to reuse

---

## ✅ What We Found

### 1. MCP Infrastructure in VectorForge ✅

**Files:**
- `services/mcpScriptService.ts` - MCP script service (AI completion, validation)
- `config/mcpConfig.ts` - MCP configuration management
- `components/MCPSettings.tsx` - MCP settings UI
- `services/xibalbaService.ts` - MCP client implementation

**Patterns to Reuse:**
- MCP configuration loading/saving
- MCP client connection handling
- Error handling for MCP operations
- Local-first approach (localStorage fallback)

---

### 2. File System Patterns ✅

**Files:**
- `api/tasks.js` - File-based storage example
- `api/projects.js` - More file operations
- `api/sprints.js` - File operations

**Patterns to Reuse:**
```javascript
// From api/tasks.js
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'data');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

async function loadTasks() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveTasks(tasks) {
  await ensureDataDir();
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}
```

**Key Patterns:**
- ✅ `fs.mkdir` with `recursive: true`
- ✅ `fs.readFile` with error handling
- ✅ `fs.writeFile` with JSON.stringify
- ✅ Path resolution using `path.join` and `__dirname`

---

### 3. Deployment Scripts ✅

**Files:**
- `00_xibalba_framework_blockchain/external/xi-os-site-source/xi-os-site/deployment/deploy.sh`
- `00_xibalba_framework_blockchain/external/xi-os-site-source/xi-os-site/deployment/DEPLOYMENT_GUIDE.md`

**Patterns to Reuse:**
```bash
# From deploy.sh
SERVER="root@162.217.146.98"
SERVER_DIR="/var/www/os.xi-io.com"

# Build
npm run build

# Deploy
rsync -avz --delete out/ "$SERVER:$SERVER_DIR/"

# Verify
ssh "$SERVER" "ls -la $SERVER_DIR"
```

**Key Patterns:**
- ✅ Build → Deploy → Verify workflow
- ✅ rsync for deployment
- ✅ SSH for remote operations
- ✅ Error handling with `set -e`

---

### 4. Zed Orchestrator (Base44) ✅

**Files:**
- `Documents/base_44_source/xi-io_7/src/components/development/ZedOrchestrator.jsx`

**What It Does:**
- Coordinates with Zed agents
- Manages agent connections
- Handles agent commands
- Provides agent status

**Patterns to Reuse:**
- Agent connection management
- Command routing
- Status tracking
- Error handling

---

### 5. MCP Configuration Files ✅

**Files:**
- `~/.cursor/mcp.json` - Cursor MCP config
- `~/.gemini/antigravity/mcp_config.json` - Gemini MCP config

**Patterns:**
- MCP server configuration structure
- Connection parameters
- Authentication setup

---

## Reusable Code Snippets

### File System Service (Based on api/tasks.js)

```typescript
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class FileSystemService {
  private projectRoot: string;

  constructor(projectRoot?: string) {
    this.projectRoot = projectRoot || process.cwd();
  }

  async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  async readFile(filePath: string): Promise<string> {
    const fullPath = this.validatePath(filePath);
    return await fs.readFile(fullPath, 'utf-8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    const fullPath = this.validatePath(filePath);
    const dir = path.dirname(fullPath);
    await this.ensureDirectory(dir);
    await fs.writeFile(fullPath, content, 'utf-8');
  }

  async listDirectory(dirPath: string): Promise<string[]> {
    const fullPath = this.validatePath(dirPath);
    return await fs.readdir(fullPath);
  }

  private validatePath(filePath: string): string {
    const resolved = path.resolve(this.projectRoot, filePath);
    if (!resolved.startsWith(this.projectRoot)) {
      throw new Error('Path outside project directory');
    }
    return resolved;
  }
}
```

### MCP Server Wrapper (Based on mcpScriptService.ts)

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { FileSystemService } from './fileSystemService.js';

export class FileSystemMCPServer {
  private server: Server;
  private fileSystem: FileSystemService;

  constructor() {
    this.server = new Server({
      name: 'vectorforge-filesystem',
      version: '1.0.0'
    });
    this.fileSystem = new FileSystemService();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler('filesystem/read', async (request) => {
      const { path } = request.params;
      const content = await this.fileSystem.readFile(path);
      return { content };
    });

    this.server.setRequestHandler('filesystem/write', async (request) => {
      const { path, content } = request.params;
      await this.fileSystem.writeFile(path, content);
      return { success: true };
    });

    this.server.setRequestHandler('filesystem/list', async (request) => {
      const { path } = request.params;
      const files = await this.fileSystem.listDirectory(path);
      return { files };
    });
  }

  async start() {
    await this.server.connect();
  }
}
```

### Deployment Service (Based on deploy.sh)

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export class DeploymentService {
  async build(): Promise<void> {
    await execAsync('npm run build');
  }

  async deploy(server: string, serverDir: string, localDir: string): Promise<void> {
    await execAsync(`rsync -avz --delete ${localDir}/out/ ${server}:${serverDir}/`);
  }

  async verify(server: string, serverDir: string): Promise<string> {
    const { stdout } = await execAsync(`ssh ${server} "ls -la ${serverDir}"`);
    return stdout;
  }
}
```

---

## Integration Points

### 1. Use Existing MCP Config

**File:** `config/mcpConfig.ts`

```typescript
// Extend existing MCP config
export interface FileSystemMCPConfig extends MCPConfig {
  filesystem: {
    enabled: boolean;
    allowedPaths: string[];
    maxFileSize: number;
  };
}
```

### 2. Use Existing Server.js Patterns

**File:** `server.js`

```typescript
// Add routes following existing pattern
import { fileSystemRoutes } from './api/filesystem.js';
await fileSystemRoutes(app);
```

### 3. Use Existing Error Handling

**Pattern from api/tasks.js:**
```typescript
try {
  // operation
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Failed to...' });
}
```

---

## Next Steps

1. **Create FileSystemService** - Reuse patterns from `api/tasks.js`
2. **Create FileSystemMCPServer** - Reuse patterns from `mcpScriptService.ts`
3. **Add API Routes** - Follow pattern from `api/tasks.js`
4. **Create DeploymentService** - Reuse patterns from `deploy.sh`
5. **Integrate with Existing MCP Config** - Extend `config/mcpConfig.ts`

---

**Status:** Ready to build using existing patterns ✅

