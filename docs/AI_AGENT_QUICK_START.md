# AI Agent File System & Deployment - Quick Start
**Date:** January 27, 2025  
**Purpose:** Get Zed working with VectorForge file system access ASAP

---

## TL;DR - What We're Building

**Problem:** Zed can't see your files, you have to copy-paste everything.

**Solution:** Build MCP servers in VectorForge backend that expose:
1. File system (read/write files)
2. Git operations (commit/push/PR)
3. Deployment management

**Why This Works:**
- VectorForge already has MCP infrastructure ✅
- VectorForge has Node.js backend (`server.js`) ✅
- We can reuse patterns from `api/tasks.js` ✅

---

## MVP: Get File System Working (3-5 days)

### Step 1: Create File System Service (Day 1)

**File:** `services/fileSystemService.ts`

```typescript
import { promises as fs } from 'fs';
import path from 'path';

export class FileSystemService {
  // Read file
  async readFile(filePath: string): Promise<string> {
    const fullPath = this.validatePath(filePath);
    return await fs.readFile(fullPath, 'utf-8');
  }

  // Write file
  async writeFile(filePath: string, content: string): Promise<void> {
    const fullPath = this.validatePath(filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, 'utf-8');
  }

  // List directory
  async listDirectory(dirPath: string): Promise<string[]> {
    const fullPath = this.validatePath(dirPath);
    return await fs.readdir(fullPath);
  }

  // Security: Validate paths (prevent directory traversal)
  private validatePath(filePath: string): string {
    const projectRoot = process.cwd();
    const resolved = path.resolve(projectRoot, filePath);
    if (!resolved.startsWith(projectRoot)) {
      throw new Error('Path outside project directory');
    }
    return resolved;
  }
}
```

### Step 2: Add API Routes (Day 1)

**File:** `server.js` (add these routes)

```typescript
import { FileSystemService } from './services/fileSystemService.js';

const fileSystemService = new FileSystemService();

// Read file
app.post('/api/filesystem/read', async (req, res) => {
  try {
    const { path } = req.body;
    const content = await fileSystemService.readFile(path);
    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Write file
app.post('/api/filesystem/write', async (req, res) => {
  try {
    const { path, content } = req.body;
    await fileSystemService.writeFile(path, content);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// List directory
app.post('/api/filesystem/list', async (req, res) => {
  try {
    const { path } = req.body;
    const files = await fileSystemService.listDirectory(path);
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Step 3: Create Frontend Client (Day 2)

**File:** `services/fileSystemClient.ts`

```typescript
export class FileSystemClient {
  private baseUrl = '/api/filesystem';

  async readFile(path: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.content;
  }

  async writeFile(path: string, content: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
  }

  async listDirectory(path: string): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.files;
  }
}
```

### Step 4: Create MCP Server Wrapper (Day 2-3)

**File:** `services/fileSystemMCPServer.ts`

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
    // Read file handler
    this.server.setRequestHandler('filesystem/read', async (request) => {
      const { path } = request.params;
      const content = await this.fileSystem.readFile(path);
      return { content };
    });

    // Write file handler
    this.server.setRequestHandler('filesystem/write', async (request) => {
      const { path, content } = request.params;
      await this.fileSystem.writeFile(path, content);
      return { success: true };
    });

    // List directory handler
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

### Step 5: Connect to Zed (Day 3-4)

**How Zed Connects:**

1. **Zed starts MCP client**
2. **Connects to VectorForge MCP server** (running in `server.js`)
3. **Calls MCP methods:**
   - `filesystem/read` - Read files
   - `filesystem/write` - Write files
   - `filesystem/list` - List directories

**VectorForge Side:**

```typescript
// In server.js, start MCP server
import { FileSystemMCPServer } from './services/fileSystemMCPServer.js';

const mcpServer = new FileSystemMCPServer();
await mcpServer.start();
```

**Zed Side (what Zed needs to do):**

```python
# Zed connects to VectorForge MCP server
from mcp import Client

client = Client.connect("http://localhost:3000/mcp")
files = client.call("filesystem/list", {"path": "/home/chrishallberg/xi-io-Vector-Forge-UI"})
content = client.call("filesystem/read", {"path": "package.json"})
```

---

## Next: Git Operations (3-5 days)

After file system works, add git operations:

1. **Install dependency:**
   ```bash
   npm install simple-git
   ```

2. **Create `services/gitService.ts`** (similar to fileSystemService)

3. **Add API routes** to `server.js`

4. **Create MCP server** for git operations

5. **Zed can then:**
   - `git/status` - Check status
   - `git/add` - Stage files
   - `git/commit` - Commit changes
   - `git/push` - Push to remote
   - `git/pr` - Create PR

---

## Testing

### Test File System Locally

```bash
# Start VectorForge backend
npm run dev:server

# In another terminal, test API
curl -X POST http://localhost:3000/api/filesystem/read \
  -H "Content-Type: application/json" \
  -d '{"path": "package.json"}'
```

### Test with Zed

1. Start VectorForge backend
2. Zed connects to MCP server
3. Zed calls `filesystem/read` with a file path
4. Verify file content is returned

---

## Security Checklist

- ✅ Path validation (prevent directory traversal)
- ✅ Sandbox to project directory
- ✅ Validate file operations
- ✅ Log all operations
- ✅ Rate limiting (prevent abuse)

---

## What This Enables

**Before:**
- Zed: "I need to read package.json"
- You: *copy-paste file content*
- Zed: "I need to modify it"
- You: *copy-paste modified content back*

**After:**
- Zed: "I need to read package.json"
- Zed: *calls filesystem/read*
- Zed: "I'll modify it"
- Zed: *calls filesystem/write*
- **No copy-paste needed!**

---

## Timeline

**MVP (File System Only):** 3-5 days
- Day 1: Backend service + API routes
- Day 2: Frontend client + MCP server
- Day 3: Testing + Zed integration
- Day 4-5: Polish + security

**Full System (File + Git + Deploy):** 14-22 days
- Phase 1: File System (3-5 days)
- Phase 2: Git Operations (3-5 days)
- Phase 3: Deployment (3-5 days)
- Phase 4: Agent Orchestration (5-7 days)

---

**Status:** Ready to start - Phase 1 can begin immediately

