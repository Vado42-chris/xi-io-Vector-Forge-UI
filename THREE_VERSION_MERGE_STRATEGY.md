# Three-Version Parallel Development & Merge Strategy

## 🎯 The Vision: Universal Business Hub

**Xibalba Intranet = The Operating System for Running a Business**

Not just an intranet. A **universal hub** that manages:
- Server infrastructure (replacing Virtualmin/cPanel)
- Business operations (integrating dotProject)
- Websites (nginx/SSL/domains)
- Products/services (Forge apps)
- Employees/teams (HR/role management)
- Files/documents (document management)
- Communication (team chat/email)
- **Everything** - unified in one interface

## 🔄 Three Parallel Versions

### 1. **Loki-PC Version** (Internal Intranet)
**Location**: `internal.xi-io.com` (Loki-PC)
**Focus**: 
- ✅ Offline-first architecture
- ✅ Standalone operation ("cut the cord")
- ✅ Internal intranet setup
- ✅ Local AI integration
- ✅ Server-level management
- ✅ Business operations integration

**Unique Strengths**:
- Fully offline capable
- Internal network routing
- Self-contained deployment
- Server management focus
- Integration with existing tools (dotProject, etc.)

**What It's Building**:
- Server management module (replacing Virtualmin)
- Business operations hub
- Multi-tenant architecture
- Role-based provisioning
- Integration layer for existing tools

### 2. **Zed Agents Version** (Agent-Based Workflows)
**Location**: Zed IDE with agent system
**Focus**:
- ✅ IDE-native integration
- ✅ Agent-based development workflows
- ✅ Automated task execution
- ✅ Agent collaboration system
- ✅ Workflow automation

**Unique Strengths**:
- Deep IDE integration
- Agent orchestration
- Automated workflows
- Development-focused
- Native editor features

**What It's Building**:
- Agent framework for business automation
- Workflow orchestration
- Task automation
- Development tooling integration
- Agent-to-agent communication

### 3. **Aries-PC/Cursor Version** (Current - Web/React)
**Location**: This repository (`xi-io-Vector-Forge-UI`)
**Focus**:
- ✅ Web-based architecture
- ✅ React/TypeScript stack
- ✅ Browser-based UI
- ✅ Cursor AI integration
- ✅ Cross-platform compatibility

**Unique Strengths**:
- Modern web stack
- Browser accessibility
- Cursor-specific features
- Cross-platform
- Web-first architecture

**What It's Building**:
- Web-based hub interface
- React component framework
- Browser-based modules
- Web API integrations
- Frontend architecture

## 🎯 The Merge Goal

**Combine all three into unified framework:**

```
┌─────────────────────────────────────────────────┐
│  Unified Xibalba Hub                            │
├─────────────────────────────────────────────────┤
│  Loki-PC: Server Management + Offline Capability│
│  Zed: Agent Workflows + Automation              │
│  Aries: Web Interface + React Framework         │
└─────────────────────────────────────────────────┘
```

### What Each Version Contributes:

**Loki-PC Version**:
- Server management module
- Offline/standalone capabilities
- Internal intranet architecture
- Business operations integration
- Multi-tenant provisioning

**Zed Version**:
- Agent framework
- Workflow automation
- Task orchestration
- Development tooling
- Agent collaboration

**Aries Version**:
- Web UI framework
- React component library
- Browser-based modules
- Frontend architecture
- Cross-platform compatibility

## 🔍 How to Access Loki-PC Work

### Current Status:
- ✅ `internal.xi-io.com` resolves to `127.0.0.1` (localhost)
- ✅ SSH server is accessible (requires password)
- ✅ Web server running on port 3000
- ✅ Host key added to known_hosts (no more hanging)

### Access Methods:

#### Method 1: SSH Access (Direct)
```bash
# SSH into Loki-PC
ssh user@internal.xi-io.com

# Navigate to framework directory
cd /path/to/xibalba-framework

# Compare with current version
ls -la
cat package.json
cat README.md
```

#### Method 2: Web Access (If Framework is Served)
```bash
# Check if framework is accessible via web
curl http://internal.xi-io.com:3000
curl http://internal.xi-io.com:8000
```

#### Method 3: File Comparison
```bash
# Copy framework files from Loki-PC
scp -r user@internal.xi-io.com:/path/to/framework/* ./loki-framework/

# Compare structures
diff -r ./loki-framework ./current-framework
```

#### Method 4: Git Repository (If Shared)
```bash
# Check for Loki-PC branch
git fetch origin
git branch -r | grep -i loki

# Or check for shared repo
git remote -v
```

## 📋 What to Compare

### Architecture Differences:
- [ ] File structure
- [ ] Service organization
- [ ] Component patterns
- [ ] Module system
- [ ] Integration approach

### Feature Differences:
- [ ] Server management implementation
- [ ] dotProject integration method
- [ ] Role-based provisioning
- [ ] Multi-tenant architecture
- [ ] Offline capabilities

### Configuration Differences:
- [ ] Environment setup
- [ ] Service configurations
- [ ] Database schemas
- [ ] API endpoints
- [ ] Module loading

## 🎯 The "Between-the-Lines" Principle

**Core Design Principle**: Every system must have a human-facing UI.

This means:
- ✅ Server management → Web UI (not just CLI)
- ✅ dotProject integration → Visual interface (not just API)
- ✅ Agent workflows → Dashboard showing agent status
- ✅ Module management → UI to enable/disable modules
- ✅ Role provisioning → Visual role editor

**Why This Matters**:
- Visual understanding (dyslexia/autism-friendly)
- Trust through visibility (see what's happening)
- Professional appearance (not just CLI)
- Human control (not black box automation)

## 🔄 Merge Strategy

### Phase 1: Document Differences (Now)
1. Access Loki-PC work
2. Compare implementations
3. Document unique features
4. Identify complementary strengths
5. Map integration points

### Phase 2: Extract Core Framework (Next)
1. Identify common core
2. Design unified API
3. Plan module system
4. Design role-based provisioning
5. Create integration layer

### Phase 3: Merge Implementation (Future)
1. Merge Loki-PC's server management
2. Integrate Zed's agent framework
3. Combine Aries' web framework
4. Unify module system
5. Test unified framework

## 🚀 Next Steps

1. **Access Loki-PC Work**
   - SSH into `internal.xi-io.com`
   - Document framework structure
   - Compare with current version

2. **Document Differences**
   - Create comparison document
   - List unique features per version
   - Identify merge conflicts

3. **Plan Merge**
   - Design unified architecture
   - Plan integration strategy
   - Create merge roadmap

---

**Status**: Understanding the three-version strategy. Need to access Loki-PC work to compare implementations and plan merge.

