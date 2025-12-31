# AI Agent File System Integration - What We Need to Build
**Date:** January 27, 2025  
**Purpose:** Enable Zed and other local AI agents to access files and manage deployments  
**Status:** 🔍 Investigation & Planning

---

## The Problem

**Current State:**
- Zed agents can't see local files directly
- User has to copy-paste everything into terminal
- No automated deployment management
- No integration between local AI agents and VectorForge

**What We Need:**
- ✅ Zed can read local files
- ✅ Zed can write/modify files
- ✅ Automated git operations (commit, push, PR)
- ✅ Deployment management (live + git)
- ✅ No manual copy-paste required

---

## What VectorForge Can Do (Current Capabilities)

### 1. MCP Integration ✅
- VectorForge has MCP (Model Context Protocol) integration
- `components/MCPSettings.tsx` - MCP server configuration
- `services/xibalbaService.ts` - MCP client usage
- Can connect to local MCP servers

### 2. File System Access (Potential)
- VectorForge runs in browser (limited file system access)
- But can use MCP servers for file operations
- Can use Node.js backend for file operations

### 3. Git Operations (Potential)
- Can use MCP servers for git
- Can use Node.js backend for git
- Can use GitHub API

---

## What We Need to Build

### Component 1: File System MCP Server

**Purpose:** Expose local file system to AI agents via MCP

**What It Does:**
- Read files from local filesystem
- Write files to local filesystem
- List directories
- Search files
- Watch for changes

**Implementation:**
- Create MCP server in VectorForge
- Use Node.js `fs` module
- Expose via MCP protocol
- Connect from VectorForge UI

**Files to Create:**
- `services/fileSystemMCPServer.ts` - MCP server for file operations
- `services/fileSystemService.ts` - File system operations
- `components/FileSystemBrowser.tsx` - UI for file browsing

---

### Component 2: Git Operations MCP Server

**Purpose:** Expose git operations to AI agents via MCP

**What It Does:**
- `git status` - Check status
- `git add` - Stage files
- `git commit` - Commit changes
- `git push` - Push to remote
- `git branch` - Manage branches
- `git pull` - Pull changes
- Create PRs via GitHub API

**Implementation:**
- Create MCP server for git
- Use `simple-git` or `nodegit` library
- Expose via MCP protocol
- Connect from VectorForge UI

**Files to Create:**
- `services/gitMCPServer.ts` - MCP server for git
- `services/gitService.ts` - Git operations
- `components/GitOperationsPanel.tsx` - UI for git operations

---

### Component 3: Deployment Manager

**Purpose:** Manage deployments to live and git

**What It Does:**
- Track deployment targets (live, git, staging)
- Manage deployment workflows
- Automated deployment pipelines
- Deployment history
- Rollback capabilities

**Implementation:**
- Service layer for deployment
- UI for deployment management
- Integration with git and live servers

**Files to Create:**
- `services/deploymentService.ts` - Deployment operations
- `components/DeploymentManager.tsx` - Deployment UI
- `types/deployment.ts` - Deployment types

---

### Component 4: AI Agent Orchestrator

**Purpose:** Coordinate between VectorForge and local AI agents (Zed)

**What It Does:**
- Connect to local AI agents
- Share file system access
- Coordinate git operations
- Manage deployment workflows
- Provide unified interface

**Implementation:**
- MCP client for connecting to agents
- Service layer for orchestration
- UI for agent management

**Files to Create:**
- `services/agentOrchestrator.ts` - Agent coordination
- `components/AgentManager.tsx` - Agent management UI
- `types/agent.ts` - Agent types

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│      VectorForge UI                     │
│  (React + TypeScript)                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   MCP Client Layer                      │
│   - File System MCP Client              │
│   - Git MCP Client                      │
│   - Agent Orchestrator                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   MCP Server Layer (Node.js)            │
│   - File System MCP Server              │
│   - Git MCP Server                      │
│   - Deployment MCP Server               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Local System                          │
│   - File System (fs)                   │
│   - Git (simple-git)                   │
│   - External Tools                      │
└─────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   External AI Agents (Zed)              │
│   - Connect via MCP                     │
│   - Share file system access            │
│   - Coordinate operations               │
└─────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: File System MCP Server (Week 1)
**Goal:** Enable file reading/writing via MCP

**Tasks:**
1. Create `services/fileSystemMCPServer.ts`
2. Implement file read/write operations
3. Create MCP client in VectorForge
4. Test with local files

**Deliverable:** Can read/write files via MCP

---

### Phase 2: Git Operations MCP Server (Week 1-2)
**Goal:** Enable git operations via MCP

**Tasks:**
1. Create `services/gitMCPServer.ts`
2. Implement git operations (status, add, commit, push)
3. Create MCP client in VectorForge
4. Test git operations

**Deliverable:** Can perform git operations via MCP

---

### Phase 3: Deployment Manager (Week 2-3)
**Goal:** Manage deployments

**Tasks:**
1. Create `services/deploymentService.ts`
2. Create deployment UI
3. Integrate with git and live servers
4. Test deployment workflows

**Deliverable:** Can manage deployments

---

### Phase 4: AI Agent Orchestrator (Week 3-4)
**Goal:** Connect to local AI agents (Zed)

**Tasks:**
1. Create `services/agentOrchestrator.ts`
2. Implement agent connection protocol
3. Create agent management UI
4. Test with Zed

**Deliverable:** Can coordinate with local AI agents

---

## Technical Requirements

### Dependencies Needed

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "simple-git": "^3.20.0",
    "chokidar": "^3.5.3",
    "glob": "^10.3.10"
  }
}
```

### Node.js Backend Required

VectorForge currently runs in browser, but MCP servers need Node.js:
- Option 1: Add Node.js backend to VectorForge
- Option 2: Use existing `server.js` and extend it
- Option 3: Create separate MCP server process

---

## What We've Explored (Need to Investigate)

### 00_framework Project
**Status:** Need to investigate
- Check if it has file system access patterns
- Check if it has MCP integration
- Check if it has deployment management

### Alpaca Variant
**Status:** Need to investigate
- Check if it has local file integration
- Check if it has git operations
- Check if it has agent coordination

---

## Next Steps

1. **Investigate existing projects:**
   - Check 00_framework for patterns
   - Check alpaca variant for integrations
   - Document what exists

2. **Design MCP servers:**
   - File system MCP server design
   - Git MCP server design
   - Agent orchestrator design

3. **Build Phase 1:**
   - File system MCP server
   - Test with VectorForge

4. **Build Phase 2:**
   - Git MCP server
   - Test git operations

---

**Last Updated:** January 27, 2025  
**Status:** Investigation in progress

