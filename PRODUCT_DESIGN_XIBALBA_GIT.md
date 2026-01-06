# Xibalba Git - Product Design Document
## Full-Stack Mixed Media Development Firm Perspective

**Date:** January 6, 2025  
**Product:** Xibalba Git (Git Management System)  
**Firm:** Xibalba, xi-io (Full-Stack Mixed Media Development)  
**Status:** 🎯 Strategic Product Design

---

## 🎯 Executive Summary

**Product Vision:** Xibalba Git is not just a Git tool—it's the **version control backbone** for the entire Xibalba ecosystem, solving VectorForge's UX issues while providing unified Git management across hundreds of repos.

**Strategic Position:**
- **Solves immediate problem:** VectorForge UX/UI issues (broken labels, unclear actions, no MAI framework)
- **Enables ecosystem:** Connects all Xibalba products (VectorForge, Intranet, Forge apps)
- **Leverages existing work:** Uses 90% of infrastructure already built
- **Differentiates:** AI-powered, self-modifying, replication-enabled Git management

---

## 🎨 Product Designer Approach

### **1. User-Centered Design Process**

#### **Phase 1: Empathy & Discovery**
**Who are our users?**
- **Primary:** Full-stack developers managing 100+ repos across 2 computers
- **Secondary:** Design teams collaborating on VectorForge projects
- **Tertiary:** AI agents needing Git operations via MCP

**What are their pain points?**
- ❌ **VectorForge UX:** Broken labels, duplicate UI, no clear actions
- ❌ **Multi-repo management:** Hundreds of repos, no unified view
- ❌ **Workflow friction:** Context switching between tools
- ❌ **Git complexity:** Worktrees, branches, PRs across repos

**What do they need?**
- ✅ **Clear actions:** MAI framework (Most Actionable Item)
- ✅ **Unified view:** All repos in one interface
- ✅ **Contextual help:** Progressive disclosure, tooltips
- ✅ **Workflow automation:** Commit → Push → PR workflows

---

### **2. Product Design Principles**

#### **Principle 1: Educational by Nature** (Fixes VectorForge UX)
**Problem:** VectorForge has broken labels ("Button" instead of "Generate Vector")

**Solution:** Xibalba Git teaches Git through:
- **Visual commit graph** (like GitKraken)
- **Contextual tooltips** (explain what each action does)
- **Progressive disclosure** (show advanced features only when needed)
- **Clear labels** (no "Button" fallbacks—always descriptive)

**Result:** Users learn Git while using it, fixing VectorForge's "NOT Discoverable" issue.

---

#### **Principle 2: MAI Framework** (Fixes VectorForge UX)
**Problem:** VectorForge has no clear primary action (everything has equal weight)

**Solution:** Xibalba Git surfaces the **Most Actionable Item**:
- **Context-aware actions:** "Commit changes" when files are staged
- **Visual hierarchy:** Orange accent for primary action (matches VectorForge)
- **Top-right placement:** Fixed position, always visible
- **Dynamic updates:** Changes based on workflow stage

**Result:** Users always know what to do next, fixing VectorForge's "NO Clear Primary Action" issue.

---

#### **Principle 3: Ecosystem Integration** (Connects Xibalba Products)
**Problem:** Xibalba products (VectorForge, Intranet, Forge apps) don't share Git workflows

**Solution:** Xibalba Git as the **unified version control layer**:
- **Single sign-on:** Same auth across all Xibalba products
- **Shared workflows:** Commit → Push → PR works everywhere
- **Cross-product visibility:** See VectorForge commits in Intranet dashboard
- **API Black Hole integration:** Unified API for all Git operations

**Result:** Seamless workflow across entire Xibalba ecosystem.

---

### **3. Product Features (User Needs)**

#### **Core Features (MVP)**

**1. Unified Repo View** ⭐⭐⭐
**Who:** Developers managing 100+ repos  
**What:** Single interface showing all repos  
**When:** Daily workflow  
**Where:** Main dashboard  
**Why:** Eliminate context switching

**Features:**
- Repo list with status indicators (clean, modified, conflicts)
- Quick actions (commit, push, pull) per repo
- Search/filter repos
- Group repos by project/client

**UX Fix:** Solves VectorForge's "duplicate UI" issue by consolidating Git operations.

---

**2. Visual Commit Graph** ⭐⭐⭐
**Who:** All users  
**What:** Interactive commit history visualization  
**When:** Understanding project history  
**Where:** Repo detail view  
**Why:** Educational—learn Git through visualization

**Features:**
- Branch visualization (like GitKraken)
- Commit details on hover
- Diff viewer
- Merge conflict visualization

**UX Fix:** Solves VectorForge's "NOT Learnable" issue by making Git history visual.

---

**3. MAI Action Center** ⭐⭐⭐
**Who:** All users  
**What:** Contextual primary action button  
**When:** Always visible  
**Where:** Top-right (fixed position)  
**Why:** Always know what to do next

**Features:**
- Dynamic action based on context:
  - "Commit changes" (when files staged)
  - "Push to remote" (when commits ready)
  - "Create PR" (when branch ready)
  - "Enter a prompt" (when nothing to do)
- Orange accent (matches VectorForge)
- Tooltip explaining action

**UX Fix:** Solves VectorForge's "NO Clear Primary Action" issue directly.

---

**4. Progressive Disclosure** ⭐⭐
**Who:** Beginners and experts  
**What:** Hide advanced features by default  
**When:** First-time users  
**Where:** Settings/Advanced panel  
**Why:** Reduce cognitive load

**Features:**
- Basic mode (commit, push, pull only)
- Advanced mode (worktrees, rebase, cherry-pick)
- Expert mode (hooks, submodules, LFS)
- Toggle in settings

**UX Fix:** Solves VectorForge's "High Cognitive Load" issue.

---

**5. Contextual Help & Tooltips** ⭐⭐⭐
**Who:** All users  
**What:** Inline help and tooltips  
**When:** On hover/click  
**Where:** Every button/action  
**Why:** Educational—learn while using

**Features:**
- Tooltip on every button (explains what it does)
- "?" icons for detailed help
- Contextual hints (e.g., "This will commit all staged files")
- Keyboard shortcuts shown

**UX Fix:** Solves VectorForge's "NOT Understandable" issue (broken labels).

---

**6. Multi-Repo Batch Operations** ⭐⭐⭐
**Who:** Developers managing 100+ repos  
**What:** Batch Git operations across repos  
**When:** Updating all repos  
**Where:** Batch operations panel  
**Why:** Efficiency—update all repos at once

**Features:**
- Select multiple repos
- Batch operations (pull, push, status check)
- Progress indicators
- Error handling per repo

**Leverages:** Fire Team Orchestrator patterns from 00_framework.

---

**7. Workflow Automation** ⭐⭐
**Who:** Teams and AI agents  
**What:** Automated Git workflows  
**When:** After code changes  
**Where:** Background automation  
**Why:** Reduce manual work

**Features:**
- Auto-commit on save (optional)
- Auto-push on commit (optional)
- Auto-create PR on push (optional)
- Custom workflow scripts

**Leverages:** Workflow Orchestrator patterns from 00_framework.

---

**8. MCP Integration** ⭐⭐⭐
**Who:** AI agents and developers  
**What:** Git operations via MCP protocol  
**When:** AI agent workflows  
**Where:** MCP server endpoint  
**Why:** Enable AI agents to do Git operations

**Features:**
- MCP server for Git operations
- AI agents can commit, push, create PRs
- VectorForge DevChatbot integration
- Unified API for all Git operations

**Leverages:** Existing MCP infrastructure in VectorForge.

---

#### **Advanced Features (Post-MVP)**

**9. Git Worktree Management** ⭐⭐
- Visual worktree manager
- Create/remove worktrees
- Switch between worktrees
- Multi-branch development

**10. PR Management** ⭐⭐
- View PRs from all repos
- Create PRs from interface
- Review comments
- Merge PRs

**11. Conflict Resolution** ⭐⭐
- Visual merge conflict resolver
- Side-by-side diff
- Auto-resolution suggestions
- Manual resolution tools

**12. Git Hooks Management** ⭐
- Visual hook editor
- Pre-commit hooks
- Pre-push hooks
- Custom hooks

---

## 🎨 Visual Design

### **Design System Integration**

**Uses Xibalba Design System:**
- **Colors:** Orange accent (#ff9800) for primary actions
- **Typography:** Xibalba font stack
- **Spacing:** Xibalba spacing scale
- **Components:** Reuses VectorForge components

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Header (48px) - Xibalba Git                    │
├──────────┬──────────────────────────┬───────────┤
│          │                          │           │
│ Repo     │  Main Content            │  Details  │
│ List     │  (Commit Graph/          │  Panel    │
│ (240px)  │   Diff Viewer/           │  (320px)  │
│          │   File Browser)          │           │
│          │                          │           │
│          │                          │           │
│          │  [MAI Action Center]     │           │
│          │  (Top-right, fixed)      │           │
└──────────┴──────────────────────────┴───────────┘
```

**Key Visual Elements:**
- **MAI Action Center:** Top-right, orange accent, fixed position
- **Repo Status Indicators:** Color-coded (green=clean, yellow=modified, red=conflict)
- **Commit Graph:** Visual branch visualization
- **Progressive Disclosure:** Collapsible advanced panels

---

## 🔗 Ecosystem Integration

### **How It Connects to Xibalba Products**

#### **1. VectorForge Integration**
**Problem:** VectorForge has UX issues (broken labels, no MAI)

**Solution:** Xibalba Git fixes VectorForge UX:
- **MAI Framework:** Implemented in Xibalba Git, reused in VectorForge
- **Progressive Disclosure:** Pattern from Xibalba Git, applied to VectorForge
- **Contextual Help:** Tooltip system from Xibalba Git, added to VectorForge
- **Clear Labels:** No "Button" fallbacks—always descriptive

**Result:** VectorForge UX improves while Xibalba Git is built.

---

#### **2. Xibalba Intranet Integration**
**Problem:** Intranet manages business operations but not version control

**Solution:** Xibalba Git as Intranet module:
- **Git Module:** Add to Intranet's module system
- **Project Integration:** Link repos to Intranet projects
- **Team Visibility:** Show Git activity in Intranet dashboard
- **Role-Based Access:** Intranet roles control Git access

**Result:** Unified business operations + version control.

---

#### **3. Forge Apps Integration**
**Problem:** Forge apps (VectorForge, Animation Studio, etc.) need version control

**Solution:** Xibalba Git as shared service:
- **Shared Git Service:** All Forge apps use same Git backend
- **Cross-App Visibility:** See VectorForge commits in Animation Studio
- **Unified Workflows:** Same commit → push → PR workflow everywhere
- **API Black Hole:** Unified API for all Git operations

**Result:** Consistent version control across all Forge apps.

---

#### **4. API Black Hole Integration**
**Problem:** Xibalba products need unified API

**Solution:** Xibalba Git via API Black Hole:
- **Unified API:** All Git operations through API Black Hole
- **Service Discovery:** Rosetta Stone finds Git services
- **Lexicon:** Shared vocabulary for Git operations
- **Handshaking:** Auto-discovery of Git capabilities

**Result:** Xibalba Git becomes part of unified ecosystem API.

---

## 🚀 Best Play to Build This Now

### **Strategic Approach**

#### **Phase 1: Fix VectorForge UX (Week 1-2)**
**Goal:** Solve immediate UX issues while building Xibalba Git

**Actions:**
1. **Implement MAI Framework** in Xibalba Git
2. **Reuse MAI Framework** in VectorForge (fixes "NO Clear Primary Action")
3. **Add tooltips** to Xibalba Git
4. **Reuse tooltip system** in VectorForge (fixes "NOT Understandable")
5. **Fix labels** in both products (no "Button" fallbacks)

**Result:** VectorForge UX improves immediately, Xibalba Git gets core features.

---

#### **Phase 2: Core Git Operations (Week 3-4)**
**Goal:** Basic Git management working

**Actions:**
1. **Git MCP Server** (uses existing MCP infrastructure)
2. **Terminal execution** (uses existing `/api/terminal/execute`)
3. **File system operations** (uses existing file system service)
4. **Basic UI** (repo list, commit graph, MAI action center)

**Result:** Functional Git management system.

---

#### **Phase 3: Multi-Repo Management (Week 5-6)**
**Goal:** Manage 100+ repos efficiently

**Actions:**
1. **Multi-repo scanner** (finds all repos)
2. **Batch operations** (uses Fire Team Orchestrator patterns)
3. **Workflow automation** (uses Workflow Orchestrator patterns)
4. **Advanced UI** (batch panel, workflow editor)

**Result:** Efficient multi-repo management.

---

#### **Phase 4: Ecosystem Integration (Week 7-8)**
**Goal:** Connect to all Xibalba products

**Actions:**
1. **Intranet module** (add Git to Intranet)
2. **Forge apps integration** (shared Git service)
3. **API Black Hole** (unified API)
4. **Cross-product visibility** (see Git activity everywhere)

**Result:** Unified version control across entire ecosystem.

---

## 💡 How It Helps VectorForge UX Issues

### **Direct Fixes**

**1. Broken Labels** ✅
- **Problem:** "Button" instead of "Generate Vector"
- **Solution:** Xibalba Git has clear labels, pattern reused in VectorForge
- **Result:** No more "Button" fallbacks

**2. Duplicate UI** ✅
- **Problem:** AI panel in left sidebar AND center
- **Solution:** Xibalba Git consolidates Git operations, pattern applied to VectorForge
- **Result:** No duplicate panels

**3. No Clear Primary Action** ✅
- **Problem:** Everything has equal visual weight
- **Solution:** MAI Framework in Xibalba Git, reused in VectorForge
- **Result:** Always know what to do next

**4. No Progressive Disclosure** ✅
- **Problem:** All features visible at once (overwhelming)
- **Solution:** Progressive disclosure in Xibalba Git, pattern applied to VectorForge
- **Result:** Reduced cognitive load

**5. No Contextual Help** ✅
- **Problem:** No tooltips, unclear what things do
- **Solution:** Tooltip system in Xibalba Git, reused in VectorForge
- **Result:** Educational by nature

---

## 📊 Success Metrics

### **Product Metrics**
- **Adoption:** 80% of repos managed via Xibalba Git within 3 months
- **Efficiency:** 50% reduction in time spent on Git operations
- **UX Score:** VectorForge UX score improves from 35/100 to 80/100

### **Ecosystem Metrics**
- **Integration:** All Xibalba products using Xibalba Git within 6 months
- **API Usage:** 1000+ Git operations/day via API Black Hole
- **User Satisfaction:** 90%+ satisfaction with unified workflow

---

## 🎯 Conclusion

**Xibalba Git is the strategic play because:**

1. ✅ **Solves immediate problem:** Fixes VectorForge UX issues
2. ✅ **Enables ecosystem:** Connects all Xibalba products
3. ✅ **Leverages existing work:** Uses 90% of infrastructure already built
4. ✅ **Differentiates:** AI-powered, self-modifying, replication-enabled
5. ✅ **Strategic position:** Version control backbone for entire ecosystem

**Build it now because:**
- VectorForge UX needs fixing (broken labels, no MAI)
- Multi-repo management is painful (100+ repos)
- Ecosystem needs unified version control
- Infrastructure already exists (MCP, terminal, file system)

**Result:** Professional Git management system that fixes VectorForge UX while enabling the entire Xibalba ecosystem.

---

**Status:** 🚀 **READY TO BUILD**

