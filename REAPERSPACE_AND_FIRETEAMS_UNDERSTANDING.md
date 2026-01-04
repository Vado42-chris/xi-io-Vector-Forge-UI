# ReaperSpace & Fire Teams - Understanding

## 🔍 What I've Learned

### 1. **ReaperSpace** - Agent Workspace Management

**Purpose**: Manages workspace assignments for AI agents

**Location**: `REAPER_SPACE/` directory on Loki-PC

**Key Components**:
- **ReaperManager** (`core/reaper_integration.py`)
  - Creates Reaper spaces
  - Assigns agents to spaces
  - Manages capacity (max agents per space)
  - Tenant-based organization

**How It Works**:
```python
ReaperSpace:
  - space_id: Unique identifier
  - name: Human-readable name
  - tenant_id: Organization/tenant
  - capacity: Max agents (default: 1000)
  - assigned_agents: List of agent IDs
  - metadata: Additional info
```

**Use Cases**:
- Assign AI agents to workspaces
- Organize agents by tenant/project
- Manage agent capacity
- Track agent assignments

**Integration**:
- Part of Xibalba Intranet
- Used by agent registry
- Connects to agent management system

### 2. **HR Onboarding Process**

**Status**: Still exploring - need to find specific onboarding code

**Likely Components**:
- Employee/user creation
- Role assignment
- Access provisioning
- Training/onboarding workflow
- Integration with ReaperSpace (agent assignment?)

**Where to Look**:
- `core/user_manager.py` - User management
- `core/agent_registry.py` - Agent registration
- HR-related modules in intranet
- Onboarding workflows

### 3. **Fire Teams (ZR1s)** - Fast Reconnaissance

**Purpose**: Fast reconnaissance and waterfall planning

**Mission**:
- Scout ahead at maximum speed
- Map complete terrain
- Identify all issues, risks, requirements
- Create comprehensive waterfall plan
- Hand off intelligence to Sprint Teams

**Speed**: FAST (hours to days for recon)

**Operations**:
1. **Reconnaissance** - Scout problem space
2. **Issue Mapping** - Identify challenges
3. **Architecture** - Design complete system
4. **Requirements** - Document everything
5. **Risk Assessment** - Identify problems
6. **Planning** - Create roadmap

**Composition**:
- 2-5 team members
- Highly specialized expertise
- Autonomous decision-making
- Rapid communication
- Quick pivots

**Deliverables**:
- Requirements Document
- Architecture Document
- Risk Assessment
- Resource Plan
- Execution Roadmap

**Examples**:
- Technical Fire Team (architecture recon)
- UX Fire Team (user experience recon)
- Security Fire Team (security recon)
- Market Fire Team (market recon)
- Legal Fire Team (legal recon)

### 4. **Sprint Teams (Corvettes)** - Agile Execution

**Purpose**: Sustained delivery and continuous velocity

**Mission**:
- Execute on Fire Team intelligence
- Deliver features iteratively
- Maintain sustained velocity
- Adapt to feedback
- Continuous value delivery

**Speed**: SUSTAINED (features per sprint)

**Operations**:
1. **Sprint Planning** - Use Fire Team roadmap
2. **Development** - Build features iteratively
3. **Testing** - Validate as you go
4. **Demo** - Show working features
5. **Retrospective** - Learn and improve
6. **Repeat** - Next sprint begins

**Composition**:
- 5-12 team members
- Cross-functional skills
- Collaborative work
- Sustained effort
- Iterative delivery

**Roles**:
- Product Owner
- Scrum Master
- Developers
- Designers
- QA
- DevOps

**Deliverables**:
- Working features each sprint
- Incremental value
- Feedback incorporation
- Quality maintenance
- Velocity sustained

## 🎯 The Philosophy

**"We lift from the bottom to build the top"**

**Two-Tier System**:
- **Fire Teams (ZR1s)**: Fast reconnaissance → Complete planning
- **Sprint Teams (Corvettes)**: Sustained execution → Continuous delivery

**Together**: Systematic excellence + Continuous delivery

## 🔄 How They Work Together

```
1. Fire Team scouts → Maps terrain → Creates plan
2. Hand off to Sprint Team → Execute plan → Deliver features
3. Feedback loop → Fire Team adjusts → Sprint Team adapts
4. Repeat → Continuous improvement
```

## 📋 What I Still Need to Learn

1. **HR Onboarding**:
   - Specific onboarding workflow
   - Integration with ReaperSpace
   - Role assignment process
   - Training modules

2. **ReaperSpace Details**:
   - How agents are assigned
   - Capacity management
   - Tenant organization
   - Integration points

3. **Fire Teams Implementation**:
   - Tools and processes
   - How to create Fire Teams
   - Workflow management
   - Integration with framework

---

**Status**: Understanding ReaperSpace (agent workspace management) and Fire Teams (fast reconnaissance/planning). Still exploring HR onboarding process.

