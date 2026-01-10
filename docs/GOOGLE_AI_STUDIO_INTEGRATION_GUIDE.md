# External UI Integration Guide

**Created:** January 9, 2025  
**Status:** 🟡 **IN PROGRESS**  
**Purpose:** Guide for integrating external frontend UI with VectorForge backend

**Note:** This repository provides the backend APIs and kernel integration. The frontend UI can be built using any framework or tool.

---

## 🎯 **OBJECTIVE**

Enable external frontend tools to build the UI while this repository provides the backend APIs and kernel integration.

---

## 📊 **WORK SPLIT**

### **This Repository (Backend)**

- ✅ Backend API server (Express/Node.js)
- ✅ Service layer (77 services)
- ✅ Kernel bridge (integrates your existing kernel)
- ✅ Data persistence (file system, state)
- ✅ AI integration (Ollama, MCP, Gemini)
- ✅ Cross-window synchronization

### **External Frontend UI**

- ✅ UI components (Canvas, AIPanel, Sidebars, etc.)
- ✅ User interactions
- ✅ Visual rendering
- ✅ State display
- ✅ API client (calls backend)

---

## 🔌 **BACKEND SETUP FOR EXTERNAL FRONTEND**

### **1. Backend API Server**

**Location:** `server.js` (or `server.ts`)

**What it does:**

- Runs Express server on port 3000
- Provides REST API endpoints
- Connects to services
- Handles file operations
- Manages AI interactions
- Syncs state across windows

**Setup:**

```bash
# Install dependencies
npm install express cors

# Start server
npm run dev:server
```

**API Base URL:** `http://localhost:3000/api/v1`

---

### **2. API Endpoints External Frontend Needs**

#### **File Operations**

- `POST /api/v1/files/read` - Read file
- `POST /api/v1/files/write` - Write file
- `POST /api/v1/files/list` - List files

#### **AI Interactions**

- `POST /api/v1/ai/chat` - Send message to AI
- `POST /api/v1/ai/generate-vector` - Generate vector from prompt

#### **State Management**

- `GET /api/v1/state/:projectId` - Get project state
- `POST /api/v1/state/:projectId` - Update project state
- `POST /api/v1/state/:projectId/checkpoint` - Create checkpoint

#### **Project Management**

- `POST /api/v1/projects/create` - Create project
- `GET /api/v1/projects/:projectId` - Get project
- `GET /api/v1/projects/list` - List projects

#### **Component Registry**

- `GET /api/v1/registry/components` - Get components
- `POST /api/v1/registry/register` - Register component

#### **Kernel Operations**

- `POST /api/v1/kernel/execute` - Execute kernel operation
- `POST /api/v1/kernel/audit` - Run heuristic audit

#### **Cross-Window Sync**

- `POST /api/v1/sync/broadcast` - Broadcast state change
- `GET /api/v1/sync/subscribe/:channel` - Subscribe to updates (SSE)

---

## 📊 **DATA STRUCTURES EXTERNAL FRONTEND WORKS WITH**

### **Project State (AppState)**

```typescript
interface AppState {
  activeRole: WorkspaceRole;
  activeTool: ToolType;
  layers: VectorLayer[];
  selectedLayerId: string | null;
  selectedNodeId: string | null;
  zoom: number;
  pan: { x: number; y: number };
  views: SovereignViewConfig[];
  projectName: string;
  manifestId: string;
  shards: FileShard[];
  // ... other properties
}
```

### **Vector Layer**

```typescript
interface VectorLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  nodes: VectorNode[];
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}
```

### **Vector Node**

```typescript
interface VectorNode {
  id: string;
  x: number;
  y: number;
  type: 'move' | 'line' | 'curve' | 'close';
}
```

---

## 🔧 **GOOGLE AI STUDIO FRONTEND SETUP**

### **1. API Client**

Create an API client in Google AI Studio:

```typescript
// api/vectorforge-api.ts
class VectorForgeAPI {
  private baseUrl = 'http://localhost:3000/api/v1';

  // File Operations
  async readFile(path: string) {
    const res = await fetch(`${this.baseUrl}/files/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
    return res.json();
  }

  async writeFile(path: string, content: string) {
    const res = await fetch(`${this.baseUrl}/files/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content }),
    });
    return res.json();
  }

  // AI Operations
  async sendAIMessage(message: string, context: any) {
    const res = await fetch(`${this.baseUrl}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context, provider: 'ollama' }),
    });
    return res.json();
  }

  async generateVector(prompt: string, options: any) {
    const res = await fetch(`${this.baseUrl}/ai/generate-vector`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, options }),
    });
    return res.json();
  }

  // State Management
  async getState(projectId: string) {
    const res = await fetch(`${this.baseUrl}/state/${projectId}`);
    return res.json();
  }

  async updateState(projectId: string, updates: any) {
    const res = await fetch(`${this.baseUrl}/state/${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates }),
    });
    return res.json();
  }

  // Project Management
  async createProject(name: string, template?: string) {
    const res = await fetch(`${this.baseUrl}/projects/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, template }),
    });
    return res.json();
  }

  async getProject(projectId: string) {
    const res = await fetch(`${this.baseUrl}/projects/${projectId}`);
    return res.json();
  }

  async listProjects() {
    const res = await fetch(`${this.baseUrl}/projects/list`);
    return res.json();
  }

  // Component Registry
  async getComponents() {
    const res = await fetch(`${this.baseUrl}/registry/components`);
    return res.json();
  }

  // Kernel Operations
  async executeKernelOperation(operation: string, input: any) {
    const res = await fetch(`${this.baseUrl}/kernel/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, input }),
    });
    return res.json();
  }

  async auditVector(vectorData: any) {
    const res = await fetch(`${this.baseUrl}/kernel/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vectorData }),
    });
    return res.json();
  }

  // Cross-Window Sync
  async broadcastStateChange(channel: string, event: string, data: any) {
    const res = await fetch(`${this.baseUrl}/sync/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, event, data }),
    });
    return res.json();
  }
}

export const api = new VectorForgeAPI();
```

---

### **2. Component Integration**

**Canvas Component:**

```typescript
// In Google AI Studio Canvas component
import { api } from './api/vectorforge-api';

const Canvas = ({ projectId }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Load state from backend
    api.getState(projectId).then(result => {
      if (result.success) {
        setState(result.state);
      }
    });
  }, [projectId]);

  const handleNodeMove = async (nodeId, newPosition) => {
    // Update state locally
    const updatedState = {
      ...state,
      layers: state.layers.map(layer => ({
        ...layer,
        nodes: layer.nodes.map(node =>
          node.id === nodeId
            ? { ...node, x: newPosition.x, y: newPosition.y }
            : node
        )
      }))
    };
    setState(updatedState);

    // Sync to backend
    await api.updateState(projectId, {
      layers: updatedState.layers
    });

    // Broadcast to other windows
    await api.broadcastStateChange('state-updates', 'node-moved', {
      projectId,
      nodeId,
      position: newPosition
    });
  };

  return (
    <svg>
      {state?.layers.map(layer => (
        <g key={layer.id}>
          {layer.nodes.map(node => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={5}
              onDrag={e => handleNodeMove(node.id, { x: e.x, y: e.y })}
            />
          ))}
        </g>
      ))}
    </svg>
  );
};
```

**AIPanel Component:**

```typescript
// In Google AI Studio AIPanel component
import { api } from './api/vectorforge-api';

const AIPanel = ({ projectId }) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    const result = await api.sendAIMessage(message, {
      projectId,
      currentState: state
    });

    if (result.success) {
      setResponse(result.response);

      // If AI generated vector, update state
      if (result.vector) {
        await api.updateState(projectId, {
          layers: [...state.layers, result.vector.layers[0]]
        });
      }
    }
  };

  return (
    <div>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSend}>Send</button>
      <div>{response}</div>
    </div>
  );
};
```

---

## 📋 **PAGE-BY-PAGE BACKEND SUPPORT**

### **SovereignEntry (Boot Screen)**

**Backend Support:**

- `POST /api/v1/projects/list` - List recent projects
- `POST /api/v1/projects/create` - Create new project

**Data Needed:**

- Recent projects list
- Project templates

---

### **HangarDashboard (Project Launcher)**

**Backend Support:**

- `GET /api/v1/projects/list` - List all projects
- `GET /api/v1/projects/:projectId` - Get project details
- `POST /api/v1/projects/create` - Create project

**Data Needed:**

- Project list
- Project metadata
- Recent manifests

---

### **Canvas (Vector Editor)**

**Backend Support:**

- `GET /api/v1/state/:projectId` - Get project state
- `POST /api/v1/state/:projectId` - Update state
- `POST /api/v1/files/write` - Save file
- `POST /api/v1/sync/broadcast` - Broadcast changes

**Data Needed:**

- VectorLayer[]
- VectorNode[]
- Current tool
- Zoom/pan state

---

### **AIPanel (AI Interaction)**

**Backend Support:**

- `POST /api/v1/ai/chat` - Send message
- `POST /api/v1/ai/generate-vector` - Generate vector
- `POST /api/v1/kernel/audit` - Audit vector

**Data Needed:**

- Conversation history
- AI responses
- Generated vectors

---

### **LeftSidebar (Tools)**

**Backend Support:**

- `GET /api/v1/registry/components` - Get components
- `POST /api/v1/state/:projectId` - Update active tool

**Data Needed:**

- Available tools
- Component registry
- Tool settings

---

### **RightSidebar (Properties)**

**Backend Support:**

- `GET /api/v1/state/:projectId` - Get selected layer/node
- `POST /api/v1/state/:projectId` - Update layer/node properties

**Data Needed:**

- Selected layer properties
- Selected node properties
- Layer stack

---

## 🔧 **BACKEND IMPLEMENTATION PRIORITY**

### **Phase 1: Core APIs (Day 1)**

1. File operations API
2. State management API
3. Project management API

### **Phase 2: AI Integration (Day 2)**

1. AI chat API
2. Vector generation API
3. Kernel operations API

### **Phase 3: Sync & Registry (Day 3)**

1. Cross-window sync API
2. Component registry API
3. Cognitive history API

---

## 📋 **NEXT STEPS**

### **For This Repository (Backend):**

1. ✅ Create backend API server (`server.js`)
2. ✅ Implement API endpoints
3. ✅ Connect to services
4. ✅ Create kernel bridge
5. ✅ Seed initial data

### **For Google AI Studio (Frontend):**

1. ✅ Create API client
2. ✅ Connect components to API
3. ✅ Handle state updates
4. ✅ Implement real interactions
5. ✅ Test with backend

---

**Last Updated:** January 9, 2025  
**Status:** 🟡 **IN PROGRESS** - Integration guide ready for Google AI Studio
