# AI Agent File System & Deployment System - Implementation Plan
**Date:** January 27, 2025  
**Purpose:** Build VectorForge feature to enable Zed and local AI agents to access files and manage deployments  
**Status:** 🚀 Ready to Build

---

## Executive Summary

**The Problem:**
- Zed agents can't see local files
- Manual copy-paste required for everything
- No automated deployment management
- No integration between VectorForge and local AI agents

**The Solution:**
Build MCP servers in VectorForge's Node.js backend that expose:
1. **File System Access** - Read/write local files
2. **Git Operations** - Commit, push, PR creation
3. **Deployment Management** - Automated deployments to live/git
4. **Agent Orchestration** - Connect to Zed and coordinate operations

**Why This Works:**
- VectorForge already has MCP infrastructure
- VectorForge has Node.js backend (`server.js`)
- MCP protocol is perfect for this use case
- Can reuse existing patterns from `api/tasks.js` (file operations)

---

## What We Found

### ✅ Existing Infrastructure

1. **MCP Integration** ✅
   - `components/MCPSettings.tsx` - MCP configuration UI
   - `services/xibalbaService.ts` - MCP client implementation
   - `config/mcpConfig.ts` - MCP configuration
   - VectorForge can connect to MCP servers

2. **Node.js Backend** ✅
   - `server.js` - Express server with API routes
   - `api/tasks.js` - File-based storage example (uses `fs`)
   - `api/projects.js` - More file operations
   - Already has file system access patterns

3. **File System Patterns** ✅
   - `api/tasks.js` shows how to:
     - Read files: `fs.readFile()`
     - Write files: `fs.writeFile()`
     - Create directories: `fs.mkdir()`
   - Can extend these patterns

4. **00_framework Project** ✅
   - Found `tools/local_agent_propose.py` - Local agent integration
   - Has deployment scripts in `external/xi-os-site-source/xi-os-site/deployment/`
   - Patterns exist for agent coordination

---

## Architecture

```
┌─────────────────────────────────────────┐
│      VectorForge UI (Browser)          │
│  - File System Browser                  │
│  - Git Operations Panel                 │
│  - Deployment Manager                   │
│  - Agent Manager                        │
└──────────────┬──────────────────────────┘
               │ HTTP/WebSocket
               ▼
┌─────────────────────────────────────────┐
│   VectorForge Backend (server.js)      │
│   - Express API Routes                  │
│   - MCP Server Wrapper                  │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌──────────────┐  ┌──────────────┐
│ File System │  │ Git Service  │
│ MCP Server  │  │ MCP Server   │
└──────┬───────┘  └──────┬───────┘
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Node.js fs  │  │ simple-git   │
│ module      │  │ library      │
└──────────────┘  └──────────────┘
       │                 │
       └────────┬─────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   Local System                          │
│   - File System                         │
│   - Git Repository                      │
└─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│   External AI Agents (Zed)              │
│   - Connect via MCP                     │
│   - Access files via VectorForge        │
│   - Coordinate deployments             │
└─────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: File System MCP Server (3-5 days)

**Goal:** Enable file reading/writing via MCP

**What to Build:**

1. **Backend MCP Server** (`services/fileSystemMCPServer.ts`)
   ```typescript
   // MCP server that exposes file operations
   - readFile(path: string): Promise<string>
   - writeFile(path: string, content: string): Promise<void>
   - listDirectory(path: string): Promise<string[]>
   - searchFiles(pattern: string): Promise<string[]>
   - watchFile(path: string, callback: Function): void
   ```

2. **Backend Service** (`services/fileSystemService.ts`)
   ```typescript
   // Service layer using Node.js fs
   - Uses patterns from api/tasks.js
   - Handles errors gracefully
   - Security: path validation, sandboxing
   ```

3. **API Routes** (extend `server.js`)
   ```typescript
   app.post('/api/filesystem/read', ...)
   app.post('/api/filesystem/write', ...)
   app.post('/api/filesystem/list', ...)
   app.post('/api/filesystem/search', ...)
   ```

4. **Frontend Service** (`services/fileSystemClient.ts`)
   ```typescript
   // Client that calls backend API
   - readFile(path): Promise<string>
   - writeFile(path, content): Promise<void>
   - listDirectory(path): Promise<string[]>
   ```

5. **UI Component** (`components/FileSystemBrowser.tsx`)
   ```typescript
   // File browser UI
   - Directory tree
   - File viewer/editor
   - Search functionality
   ```

**Dependencies:**
```json
{
  "@modelcontextprotocol/sdk": "^0.5.0",
  "chokidar": "^3.5.3"  // For file watching
}
```

**Files to Create:**
- `services/fileSystemMCPServer.ts`
- `services/fileSystemService.ts`
- `services/fileSystemClient.ts`
- `components/FileSystemBrowser.tsx`
- `types/filesystem.ts`

**Files to Modify:**
- `server.js` - Add API routes

---

### Phase 2: Git Operations MCP Server (3-5 days)

**Goal:** Enable git operations via MCP

**What to Build:**

1. **Backend MCP Server** (`services/gitMCPServer.ts`)
   ```typescript
   // MCP server for git operations
   - status(): Promise<GitStatus>
   - add(files: string[]): Promise<void>
   - commit(message: string): Promise<void>
   - push(branch?: string): Promise<void>
   - pull(): Promise<void>
   - branch(name: string, create?: boolean): Promise<void>
   - createPR(title: string, body: string): Promise<PR>
   ```

2. **Backend Service** (`services/gitService.ts`)
   ```typescript
   // Service using simple-git
   - Uses simple-git library
   - Handles git errors
   - Security: validate git operations
   ```

3. **API Routes** (extend `server.js`)
   ```typescript
   app.get('/api/git/status', ...)
   app.post('/api/git/add', ...)
   app.post('/api/git/commit', ...)
   app.post('/api/git/push', ...)
   app.post('/api/git/pull', ...)
   app.post('/api/git/branch', ...)
   app.post('/api/git/pr', ...)
   ```

4. **Frontend Service** (`services/gitClient.ts`)
   ```typescript
   // Client for git operations
   - status(): Promise<GitStatus>
   - commitAndPush(message: string): Promise<void>
   - createPR(title: string, body: string): Promise<PR>
   ```

5. **UI Component** (`components/GitOperationsPanel.tsx`)
   ```typescript
   // Git operations UI
   - Status display
   - Commit interface
   - Branch management
   - PR creation
   ```

**Dependencies:**
```json
{
  "simple-git": "^3.20.0",
  "@octokit/rest": "^20.0.0"  // For GitHub API
}
```

**Files to Create:**
- `services/gitMCPServer.ts`
- `services/gitService.ts`
- `services/gitClient.ts`
- `components/GitOperationsPanel.tsx`
- `types/git.ts`

**Files to Modify:**
- `server.js` - Add API routes

---

### Phase 3: Deployment Manager (3-5 days)

**Goal:** Manage deployments to live and git

**What to Build:**

1. **Backend Service** (`services/deploymentService.ts`)
   ```typescript
   // Deployment orchestration
   - deployToGit(branch: string): Promise<void>
   - deployToLive(environment: string): Promise<void>
   - rollback(version: string): Promise<void>
   - getDeploymentHistory(): Promise<Deployment[]>
   ```

2. **API Routes** (extend `server.js`)
   ```typescript
   app.post('/api/deploy/git', ...)
   app.post('/api/deploy/live', ...)
   app.post('/api/deploy/rollback', ...)
   app.get('/api/deploy/history', ...)
   ```

3. **Frontend Service** (`services/deploymentClient.ts`)
   ```typescript
   // Client for deployments
   - deployToGit(branch): Promise<void>
   - deployToLive(env): Promise<void>
   ```

4. **UI Component** (`components/DeploymentManager.tsx`)
   ```typescript
   // Deployment UI
   - Deployment targets
   - Deployment history
   - Rollback interface
   ```

**Files to Create:**
- `services/deploymentService.ts`
- `services/deploymentClient.ts`
- `components/DeploymentManager.tsx`
- `types/deployment.ts`

**Files to Modify:**
- `server.js` - Add API routes

---

### Phase 4: AI Agent Orchestrator (5-7 days)

**Goal:** Connect to local AI agents (Zed) and coordinate operations

**What to Build:**

1. **Backend Service** (`services/agentOrchestrator.ts`)
   ```typescript
   // Agent coordination
   - connectToAgent(agentId: string): Promise<void>
   - shareFileSystemAccess(agentId: string): Promise<void>
   - coordinateGitOperation(agentId: string, operation: GitOp): Promise<void>
   - getAgentStatus(agentId: string): Promise<AgentStatus>
   ```

2. **MCP Client for Agents** (`services/agentMCPClient.ts`)
   ```typescript
   // Connect to external agents via MCP
   - connect(agentUrl: string): Promise<void>
   - sendCommand(command: string): Promise<Response>
   - shareContext(context: Context): Promise<void>
   ```

3. **API Routes** (extend `server.js`)
   ```typescript
   app.post('/api/agents/connect', ...)
   app.post('/api/agents/command', ...)
   app.get('/api/agents/status', ...)
   ```

4. **Frontend Service** (`services/agentClient.ts`)
   ```typescript
   // Client for agent operations
   - connectToAgent(agentId): Promise<void>
   - sendCommand(command): Promise<Response>
   ```

5. **UI Component** (`components/AgentManager.tsx`)
   ```typescript
   // Agent management UI
   - Agent list
   - Connection status
   - Command interface
   - Shared context display
   ```

**Files to Create:**
- `services/agentOrchestrator.ts`
- `services/agentMCPClient.ts`
- `services/agentClient.ts`
- `components/AgentManager.tsx`
- `types/agent.ts`

**Files to Modify:**
- `server.js` - Add API routes

---

## Security Considerations

### File System Access
- **Path Validation:** Only allow access to project directory and specified paths
- **Sandboxing:** Restrict file operations to safe directories
- **Permissions:** Check file permissions before operations
- **Audit Logging:** Log all file operations

### Git Operations
- **Branch Protection:** Prevent force push to main/master
- **Commit Validation:** Validate commit messages
- **PR Review:** Require review for PRs to main
- **Authentication:** Use GitHub tokens securely

### Deployment
- **Environment Validation:** Validate deployment targets
- **Rollback Safety:** Ensure rollback doesn't break system
- **Deployment Logs:** Keep detailed deployment history

### Agent Coordination
- **Agent Authentication:** Verify agent identity
- **Command Validation:** Validate commands before execution
- **Context Isolation:** Isolate agent contexts
- **Rate Limiting:** Prevent abuse

---

## Integration with Existing Systems

### MCP Integration
- Reuse `config/mcpConfig.ts` patterns
- Extend `services/xibalbaService.ts` for agent connections
- Use `components/MCPSettings.tsx` for configuration

### File System Patterns
- Reuse patterns from `api/tasks.js`
- Use same error handling approach
- Follow same security patterns

### Backend Architecture
- Extend `server.js` with new routes
- Follow existing API patterns
- Use same middleware (CORS, security headers)

---

## Testing Strategy

### Unit Tests
- Test file system operations
- Test git operations
- Test deployment logic
- Test agent coordination

### Integration Tests
- Test MCP server connections
- Test API endpoints
- Test UI components
- Test end-to-end workflows

### Security Tests
- Test path validation
- Test permission checks
- Test authentication
- Test sandboxing

---

## Dependencies Summary

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "simple-git": "^3.20.0",
    "@octokit/rest": "^20.0.0",
    "chokidar": "^3.5.3",
    "glob": "^10.3.10"
  }
}
```

---

## Timeline

**Total: 14-22 days (2.5-4.5 weeks)**

- **Phase 1:** File System MCP Server (3-5 days)
- **Phase 2:** Git Operations MCP Server (3-5 days)
- **Phase 3:** Deployment Manager (3-5 days)
- **Phase 4:** AI Agent Orchestrator (5-7 days)

**MVP (Phases 1-2):** 6-10 days (1.5-2 weeks)
- File system access
- Basic git operations
- Enough for Zed to work

---

## Next Steps

1. **Start Phase 1:**
   - Create `services/fileSystemService.ts`
   - Add API routes to `server.js`
   - Create `services/fileSystemClient.ts`
   - Build `components/FileSystemBrowser.tsx`

2. **Test with Zed:**
   - Connect Zed to VectorForge MCP server
   - Test file reading/writing
   - Verify it works end-to-end

3. **Continue to Phase 2:**
   - Add git operations
   - Test git workflow
   - Verify deployment

---

**Last Updated:** January 27, 2025  
**Status:** Ready to implement - Phase 1 can start immediately

