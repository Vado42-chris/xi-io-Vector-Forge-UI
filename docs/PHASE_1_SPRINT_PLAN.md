# Phase 1 Sprint Plan - VectorForge UI/UX Fixes
**Duration:** 2 weeks  
**Goal:** Stable core UI for workflows so Phase 2 tools can be integrated without UX changes  
**Status:** Ready to start

---

## Executive Summary

Your approach is **100% still valid** - all core principles are modern best practices. We're adapting it to VectorForge's specific needs and leveraging existing components.

### What's Already Built ✅
- `ToolPalette.tsx` - Basic draggable palette (needs refinement)
- `DockableToolPalette.tsx` - Professional dockable palette
- `ActionCenter.tsx` - Exists but needs repurposing for vector editor context
- `workflowLayoutService.ts` - Layout persistence service
- `localStorage` persistence in `App.hardened.tsx`
- `ProfessionalFileMenu.tsx` - Menu system (needs fixes)

### What Needs Work 🔄
- Complete menu system fixes (construction paper layer, readability)
- Refine palette drag-drop and docking
- Wire up WINDOW_PALETTES menu
- Reorganize right sidebar information architecture
- Repurpose/remove Action Center (it's task-management focused, not vector editor)

---

## Sprint Backlog (2 Weeks)

### Task A: Menu System Fixes
**Owner:** Frontend dev  
**Estimate:** 1.5-2 days  
**Priority:** P0

**Acceptance Criteria:**
- [ ] Construction paper intermediary layer added to all menus
- [ ] Text contrast improved (text-primary, font-semibold)
- [ ] All inline styles removed (use CSS classes only)
- [ ] Keyboard-accessible menu open/close (Tab, Enter, Escape)
- [ ] Menu hover stability (150ms timeout, no premature closing)
- [ ] Xibalba logomark integrated in File menu header (optional)

**Files to Edit:**
- `components/ProfessionalFileMenu.tsx` - Add construction paper layer, improve readability
- `styles/xibalba-design-language.css` - Ensure `.construction-paper-layer-menu` is applied
- `styles/xibalba-theme.css` - Verify text color variables

**Current Status:** Partially done - hover fixes complete, readability improvements needed

---

### Task B: Tool Palette Drag-Drop & Docking
**Owner:** Frontend dev  
**Estimate:** 3-4 days (iterative)  
**Priority:** P0

**Acceptance Criteria:**
- [ ] Drag to dock/undock with zone hints (left/right/top/bottom/floating)
- [ ] Palette persists layout in workspace config (localStorage → API later)
- [ ] Right-click context menu includes Lock/Unlock
- [ ] Pin to left sidebar works
- [ ] WINDOW_PALETTES menu opens palettes correctly
- [ ] Multiple palettes can be open simultaneously

**Components to Update:**
- `components/ToolPalette.tsx` - Enhance drag-drop, add docking zones
- `components/DockableToolPalette.tsx` - Refine docking behavior
- `components/PaletteDockingSystem.tsx` - Add zone detection and hints
- `App.hardened.tsx` - Wire up WINDOW_PALETTES menu actions

**New Files to Create:**
- `services/paletteManager.ts` - Manage palette state, persistence
- `types/palette.ts` - Palette type definitions

**Current Status:** Components exist, need refinement and wiring

---

### Task C: Right Sidebar → Inspector Panels
**Owner:** Frontend dev + UX  
**Estimate:** 2-3 days  
**Priority:** P1

**Acceptance Criteria:**
- [ ] Sidebar supports nested panels: Inspector → Properties / Timeline / Help
- [ ] Panels collapsible, keyboard reachable, focus trap for modals
- [ ] Tab readability improved (text size, contrast, spacing)
- [ ] Information architecture reorganized for better UX
- [ ] All right sidebar interactions tested

**Files to Edit:**
- `components/RightSidebar.tsx` - Reorganize tabs, improve readability
- `components/InspectorPanel.tsx` - Enhance inspector functionality
- `styles/xibalba-design-language.css` - Tab styling improvements

**Current Status:** Needs UX review and reorganization

---

### Task D: Enhance Action Center for Team-Based Workflows
**Owner:** Frontend dev  
**Estimate:** 1-2 days  
**Priority:** P1 (High - Core team feature)

**Acceptance Criteria:**
- [ ] Action Center surfaces highest-priority team action (blocked tasks, reviews, approvals)
- [ ] Integrates with task management service (taskManagementService.ts)
- [ ] Shows sprint-related actions (baseline pending, sprint review needed)
- [ ] Links to VectorForge items (layers, keyframes, scripts) when tasks are linked
- [ ] Works for both solo and team workflows
- [ ] Displays document management actions (shared documents, pending reviews)

**Files to Edit:**
- `components/ActionCenter.tsx` - Enhance for team workflows
- `App.hardened.tsx` - Integrate Action Center into main UI
- `services/taskManagementService.ts` - Ensure proper integration
- `services/vectorForgeTaskLinkService.ts` - Link tasks to VectorForge items

**Current Status:** Exists and functional, needs enhancement for full team workflows

---

### Task E: Accessibility + Keyboard Interactions
**Owner:** QA + dev  
**Estimate:** 2 days (parallel)  
**Priority:** P1

**Acceptance Criteria:**
- [ ] All new components pass axe-core automated checks
- [ ] Keyboard interactions documented & tested
- [ ] Focus indicators visible
- [ ] ARIA labels on all interactive elements
- [ ] Tab order logical

**Files to Update:**
- All Phase 1 components
- Add `tests/accessibility.test.tsx` - axe-core tests

**Current Status:** Some ARIA labels exist, needs comprehensive audit

---

### Task F: Persistence and Workspace Config
**Owner:** Frontend dev  
**Estimate:** 1-2 days  
**Priority:** P1

**Acceptance Criteria:**
- [ ] Workspace layout (panels, lock states) persists locally
- [ ] Palette positions persist across sessions
- [ ] Workspace config hook created (localStorage for now, API-ready)
- [ ] Config can be reset to defaults

**Files to Create/Update:**
- `services/workspacePersistence.ts` - Persistence service
- `hooks/useWorkspacePersistence.ts` - React hook for workspace state
- `App.hardened.tsx` - Integrate persistence

**Current Status:** Partial - localStorage exists, needs workspace-specific persistence

---

## UI Deliverables (Design Track - Parallel)

### Low-Fidelity Wireframes Needed:
1. **Menu System** - Desktop & compact views
2. **Dockable Palettes** - Zone hints, docking states
3. **Right Inspector** - Nested panels, collapsible sections
4. **Palette Management** - WINDOW_PALETTES menu flow

### Mid-Fidelity Prototypes:
- Clickable prototypes (Figma or similar) for user testing
- Motion spec (drag physics, transitions, focus animations)
- Accessibility spec (tab order, ARIA roles)

**Note:** Since we're building incrementally, wireframes can be created in parallel with engineering. Design can refine as components are built.

**Team Collaboration Considerations:**
- Action Center must work for both solo users and team members
- Sprint planning UI integration
- Task-to-VectorForge item linking
- Document management workflows
- Multi-user real-time collaboration indicators

---

## Validation Plan

### Unit Tests:
- [ ] Components (panels, palette, menu)
- [ ] Utility functions (persist layout, palette manager)

### Integration Tests:
- [ ] Drag/drop across zones (Playwright)
- [ ] Panel docking/un-docking and persistence
- [ ] Menu keyboard navigation

### Visual Regression:
- [ ] Golden images for menu states
- [ ] Palette dock states
- [ ] Right sidebar variations

### Accessibility:
- [ ] axe-core in CI
- [ ] Manual keyboard & screen reader spot checks

### Acceptance Tests:
- [ ] Given user opens WINDOW_PALETTES → Typography palette opens
- [ ] Given user drags palette → Zone hints appear
- [ ] Given user pins palette → It docks to left sidebar
- [ ] Given user closes app → Palette positions persist

---

## CI / PR Checklist (GitHub Actions)

- [ ] Lint (ESLint + Prettier)
- [ ] Unit tests (Vitest/Jest)
- [ ] Visual regression (optional for PRs affecting major views)
- [ ] Accessibility checks (axe-core)
- [ ] Integration smoke (Playwright)
- [ ] Release gating: merge only after all pass

---

## Feature Flags Strategy

**Phase 1 Feature Flags:**
- `ENABLE_NEW_MENU_SYSTEM` - Toggle new menu fixes
- `ENABLE_PALETTE_DOCKING` - Toggle palette docking system
- `ENABLE_NEW_SIDEBAR_IA` - Toggle new sidebar organization

**Rollout:**
- Week 1: Internal testing with flags enabled
- Week 2: Enable for all users, remove old implementations

---

## Acceptance Metrics (End of Week 2)

- [ ] **Menu System:** Accessible, readable, stable hover - ✅ Pass
- [ ] **Palette:** Dock/undock + persist layout (local) - ✅ Pass
- [ ] **Right Inspector:** Shows properties + keyboard nav - ✅ Pass
- [ ] **WINDOW_PALETTES:** Opens palettes correctly - ✅ Pass
- [ ] **Action Center:** Surfaces team actions correctly (solo + team modes) - ✅ Pass
- [ ] **CI:** Unit tests + accessibility checks pass on PR - ✅ Pass

---

## Risks & Mitigations

### Risk 1: Drag/Drop Complexity
**Mitigation:** Start with snap-to-zone only, add smooth transitions later. Use existing `PaletteDockingSystem.tsx` as foundation.

### Risk 2: State Persistence Conflicts
**Mitigation:** Store in localStorage first, add backend sync later. Use `workspacePersistence.ts` service for single source of truth.

### Risk 3: Scope Creep
**Mitigation:** Restrict Phase 1 to items above. Any extra features queue for Phase 2. Use feature flags to isolate changes.

### Risk 4: Action Center Team Integration
**Mitigation:** Action Center is CORE to team-based workflows. Ensure it properly integrates with task management, sprint planning, and VectorForge item linking. Test both solo and team scenarios.

---

## Next Steps - Choose Your Starting Point

### Option 1: Engineering First (Recommended)
**Start with:** Complete menu system fixes + palette drag-drop refinement

**Why:** We have components, need to wire them properly. Engineering can proceed while design creates wireframes in parallel.

**Deliverables:**
- Menu system fixes (Task A)
- Palette drag-drop refinement (Task B)
- WINDOW_PALETTES menu wiring
- Small PRs with tests

### Option 2: Design First
**Start with:** Wireframes for menu, palette, sidebar

**Why:** If you want to validate UX before building.

**Deliverables:**
- Low-fi wireframes (3 flows)
- Mid-fi clickable prototype
- Motion/accessibility specs

### Option 3: Hybrid (Best for Speed)
**Start with:** Scaffold components + wireframes in parallel

**Why:** Fastest path - engineering builds while design validates.

**Deliverables:**
- Component scaffolding (no styling)
- Basic wiring
- Wireframes for polish

---

## Recommended: Option 3 (Hybrid)

**Week 1:**
- Day 1-2: Complete menu fixes (Task A) + start palette refinement (Task B)
- Day 3-4: Wire WINDOW_PALETTES menu + palette persistence (Task B, F)
- Day 5: Right sidebar reorganization (Task C)

**Week 2:**
- Day 1-2: Accessibility audit + fixes (Task E)
- Day 3-4: Polish, testing, documentation
- Day 5: Final validation, PR review

**Parallel:**
- Design creates wireframes Week 1
- Design refines based on Week 1 builds Week 2

---

## File Structure Reference

**Existing Components:**
- `components/ToolPalette.tsx` ✅
- `components/DockableToolPalette.tsx` ✅
- `components/PaletteDockingSystem.tsx` ✅
- `components/ProfessionalFileMenu.tsx` ✅
- `components/RightSidebar.tsx` ✅
- `components/ActionCenter.tsx` ✅ (core team feature - needs enhancement)
- `components/SprintBoard.tsx` ✅ (team collaboration)
- `components/TaskCard.tsx` ✅ (team collaboration)

**Services:**
- `services/workflowLayoutService.ts` ✅
- `services/taskManagementService.ts` ✅ (team collaboration)
- `services/vectorForgeTaskLinkService.ts` ✅ (team collaboration)
- `services/paletteManager.ts` ❌ (create)

**Hooks:**
- `hooks/useWorkspacePersistence.ts` ❌ (create)

**Types:**
- `types/palette.ts` ❌ (create)

---

## Conclusion

Your approach is **excellent and still relevant**. We're adapting it to:
1. Leverage existing components
2. Focus on vector editor context (not task management)
3. Use our actual file structure
4. Build incrementally with feature flags

**Recommendation:** Start with Option 3 (Hybrid) - scaffold + wireframes in parallel for fastest progress.

---

**Last Updated:** January 27, 2025  
**Next Action:** Choose starting option and begin Task A or B

