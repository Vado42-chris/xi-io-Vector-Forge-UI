# Phase 1 Implementation - File System MCP Server
**Date:** January 27, 2025  
**Status:** 🚀 **IN PROGRESS**

---

## What We Built

### ✅ Files Created

1. **`services/fileSystemService.ts`** ✅
   - File system operations service
   - Reuses patterns from `api/tasks.js`
   - Security: path validation, sandboxing
   - Methods: readFile, writeFile, listDirectory, searchFiles, getFileStats

2. **`api/filesystem.js`** ✅
   - HTTP API routes for file operations
   - Follows pattern from `api/tasks.js`
   - Routes: /read, /write, /list, /search, /stats

3. **`server.js`** ✅ (Modified)
   - Added fileSystemRoutes import and registration

---

## Next Steps

### Step 1: Test API Routes (Now)

```bash
# Start server
npm run dev:server

# Test in another terminal
curl -X POST http://localhost:3000/api/filesystem/read \
  -H "Content-Type: application/json" \
  -d '{"path": "package.json"}'
```

### Step 2: Create MCP Server Wrapper (Next)

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
      const entries = await this.fileSystem.listDirectory(path || '.');
      return { entries };
    });
  }

  async start() {
    await this.server.connect();
  }
}
```

### Step 3: Integrate MCP Server into server.js

Add MCP server startup to `server.js`:

```typescript
// Start MCP server (if enabled)
if (process.env.ENABLE_MCP_SERVER === 'true') {
  const { FileSystemMCPServer } = await import('./services/fileSystemMCPServer.js');
  const mcpServer = new FileSystemMCPServer();
  await mcpServer.start();
  console.log('✅ File System MCP Server started');
}
```

### Step 4: Create Frontend Client (Optional)

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

  async listDirectory(path: string = '.'): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.entries;
  }
}
```

---

## Testing

### Test API Routes

```bash
# Read file
curl -X POST http://localhost:3000/api/filesystem/read \
  -H "Content-Type: application/json" \
  -d '{"path": "package.json"}'

# List directory
curl -X POST http://localhost:3000/api/filesystem/list \
  -H "Content-Type: application/json" \
  -d '{"path": "."}'

# Search files
curl -X POST http://localhost:3000/api/filesystem/search \
  -H "Content-Type: application/json" \
  -d '{"pattern": "mcp"}'
```

### Test with Zed

1. Start VectorForge backend: `npm run dev:server`
2. Zed connects to MCP server
3. Zed calls `filesystem/read` with file path
4. Verify file content is returned

---

## Dependencies Needed

```bash
npm install @modelcontextprotocol/sdk
```

---

## Status

- ✅ FileSystemService created
- ✅ API routes created
- ✅ server.js updated
- ⏳ MCP Server wrapper (next)
- ⏳ Frontend client (optional)
- ⏳ Testing

---

**Next:** Create MCP server wrapper and integrate into server.js

