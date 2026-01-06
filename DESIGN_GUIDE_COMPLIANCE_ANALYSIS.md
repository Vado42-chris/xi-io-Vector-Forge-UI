# Design Guide Compliance Analysis

## Current State vs Design Guide Requirements

### ✅ COMPLIANT

1. **Timeline (ProfessionalTimeline)**
   - ✅ Always visible (40% height)
   - ✅ Layers with keyframes
   - ✅ Frame navigation
   - ✅ Playback controls
   - ✅ Onion skinning controls
   - **Status:** Matches design guide spec

2. **Library Panel**
   - ✅ Created with symbol system
   - ✅ F11 toggle shortcut
   - **Issue:** Placement wrong (see below)

3. **Actions Panel (Hashtag System)**
   - ✅ Created with hashtag editor
   - ✅ F9 toggle shortcut
   - **Issue:** Placement wrong (see below)

### ❌ NON-COMPLIANT (Critical Gaps)

#### 1. AI Panel Placement (P0 - Critical)
**Design Guide Says:**
> "AI Panel should be modal/floating, not permanent in layout. Doesn't steal canvas space."

**Current Implementation:**
- ❌ Permanent in center stack (line 2287: `app-ai-panel`)
- ❌ Takes vertical space permanently
- ❌ Interrupts creative flow

**Required Fix:**
- Move to modal/floating panel
- Add button in header: `[✨ Generate with AI]`
- Opens as draggable floating panel or modal

#### 2. Library Panel Placement (P0 - Critical)
**Design Guide Says:**
> "Library panel in left sidebar (symbol-based workflow)"

**Current Implementation:**
- ❌ Fixed overlay positioned after RightSidebar (line 2640)
- ❌ Not integrated into left sidebar
- ❌ Should be part of LeftSidebar component

**Required Fix:**
- Integrate into LeftSidebar component
- Below tools, above or replace template library
- Always visible or collapsible section

#### 3. Actions Panel Placement (P0 - Critical)
**Design Guide Says:**
> "Hashtag system in Inspector > Code tab" OR "Actions Panel (F9) - dedicated panel"

**Current Implementation:**
- ❌ Fixed overlay (line 2797)
- ❌ Not in Inspector
- ✅ F9 shortcut works

**Required Fix:**
- Option A: Add to RightSidebar as "Code" tab
- Option B: Keep as floating panel but make it Inspector-style
- Should show context (Frame/Object/Timeline)

#### 4. Stage Boundaries (P0 - Critical)
**Design Guide Says:**
> "Stage has clear boundaries (artboard metaphor). Pasteboard visible around stage."

**Current Implementation:**
- ❌ Infinite canvas (no boundaries)
- ❌ No artboard system
- ❌ No pasteboard area

**Required Fix:**
- Add visible artboard/stage boundaries
- Add pasteboard (grey area around stage)
- Add stage size controls
- Add playhead indicator on stage

#### 5. Timeline Integration (P1 - Important)
**Current Implementation:**
- ✅ Timeline component built correctly
- ⚠️ May need visual improvements (tween spans, motion paths)

**Required Fix:**
- Verify tween spans are visible
- Add motion path visualization
- Add frame labels

#### 6. Workspace Presets (P2 - Nice to Have)
**Design Guide Says:**
> "File > Workspace > Animation/Design/Code/3D"

**Current Implementation:**
- ❌ No workspace presets
- ❌ No layout switching

**Required Fix:**
- Add workspace preset system
- Animation/Design/Code/3D layouts
- Save/load custom layouts

---

## Priority Fixes

### P0 - Critical (Ship Blockers)

1. **Move AI Panel to Modal/Floating** (2 hours)
   - Remove from center stack
   - Add button in header
   - Create floating panel component

2. **Integrate Library into LeftSidebar** (1 hour)
   - Move Library component into LeftSidebar
   - Position below tools
   - Make collapsible

3. **Move Actions to Inspector or Better Placement** (1 hour)
   - Option A: Add "Code" tab to RightSidebar
   - Option B: Improve floating panel positioning
   - Show context (Frame/Object/Timeline)

4. **Add Stage Boundaries (Artboard)** (4 hours)
   - Add artboard component
   - Add pasteboard area
   - Add stage size controls
   - Add playhead indicator

### P1 - Important (Competitive Features)

5. **Timeline Visual Enhancements** (2 hours)
   - Tween span visualization
   - Motion paths on stage
   - Frame labels

6. **Behaviors Panel** (3 hours)
   - Drag-and-drop behaviors
   - Behavior library
   - Visual scripting option

### P2 - Nice to Have

7. **Workspace Presets** (4 hours)
   - Animation/Design/Code/3D layouts
   - Save/load custom layouts

---

## Implementation Plan

### Phase 1: Critical Fixes (Today - 8 hours)

1. ✅ Move AI Panel to floating/modal
2. ✅ Integrate Library into LeftSidebar
3. ✅ Move Actions to Inspector (Code tab)
4. ✅ Add stage boundaries (artboard)

### Phase 2: Enhancements (Tomorrow - 6 hours)

5. Timeline visual improvements
6. Behaviors panel

### Phase 3: Advanced (Next Week)

7. Workspace presets
8. 3D UI visibility
9. Motion paths
10. Onion skinning UI

---

## Files to Modify

### Critical Fixes

1. `App.hardened.tsx`
   - Remove AI panel from center stack (line 2287)
   - Move Library integration to LeftSidebar
   - Move Actions to RightSidebar Inspector

2. `components/LeftSidebar.tsx`
   - Add Library section
   - Integrate below tools

3. `components/RightSidebar.tsx`
   - Add "Code" tab for Actions panel
   - Show hashtag editor in Code tab

4. `components/Canvas.tsx`
   - Add artboard/stage boundaries
   - Add pasteboard area
   - Add playhead indicator

5. `components/AIFloatingPanel.tsx` (NEW)
   - Floating AI generation panel
   - Draggable, dismissible

6. `components/Artboard.tsx` (NEW)
   - Stage boundaries component
   - Stage size controls
   - Pasteboard area

---

## Compliance Score

**Current: 4/10**
- Timeline: ✅ 10/10
- Library: ⚠️ 5/10 (wrong placement)
- Actions: ⚠️ 5/10 (wrong placement)
- AI Panel: ❌ 0/10 (wrong placement)
- Stage: ❌ 0/10 (missing)
- Workspace: ❌ 0/10 (missing)

**Target: 9/10** (after fixes)

---

## Next Steps

1. Review this analysis
2. Approve priority fixes
3. Implement P0 fixes (8 hours)
4. Test compliance
5. Move to P1 enhancements

