---
name: VectorForge UI Strategic Overhaul Plan
overview: Transform VectorForge from functional wireframes (6/10) to competitive Flash-for-React product (9/10) by implementing industry-leading UI patterns from Adobe Flash, Apple Motion, and DaVinci Resolve. Focus on timeline depth, hashtag system prominence, 3D capabilities, and workflow optimization.
todos:
  - id: timeline_redesign
    content: Redesign timeline to 30% screen height, always visible, with keyframes, tweens, layer controls
    status: pending
  - id: stage_boundaries
    content: Add visible artboard/stage boundaries with pasteboard area
    status: pending
  - id: actions_panel
    content: Create Flash-style Actions panel for hashtag system with syntax highlighting, auto-complete, validation
    status: pending
  - id: command_palette_integration
    content: Integrate command palette into Actions panel with search, categories, drag-and-drop
    status: pending
    dependencies:
      - actions_panel
  - id: 3d_transform_panel
    content: Create 3D transform panel with position, rotation, perspective, camera controls
    status: pending
  - id: 3d_viewport
    content: Create 3D viewport with orbit, pan, zoom controls and axis gizmo
    status: pending
  - id: ai_modal
    content: Convert AI panel from permanent layout to modal/overlay that can be dismissed
    status: pending
  - id: workspace_presets
    content: Create workspace presets system (Design/Animate/Code/3D/Export/Classic) with keyboard shortcuts
    status: pending
  - id: unified_inspector
    content: Create Apple-style unified inspector panel with context-sensitive tabs (Object/Animation/Code/3D)
    status: pending
  - id: integration_testing
    content: Test all new UI components work together, verify keyboard shortcuts, verify context-sensitivity
    status: pending
    dependencies:
      - timeline_redesign
      - actions_panel
      - 3d_transform_panel
      - ai_modal
      - workspace_presets
      - unified_inspector
---

# VectorForge UI

Strategic Overhaul Plan

## Executive Summary

**Current State:** 6/10 - Functional but not competitive**Target State:** 9/10 - Industry-leading Flash-for-React product**Timeline:** 3-4 weeks for core improvements**Key Transformations:**

1. Timeline becomes primary interface (30% screen, always visible)
2. Hashtag system gets dedicated Actions panel (Flash-style)
3. 3D capabilities get dedicated UI and viewport
4. AI panel becomes modal/overlay (doesn't steal canvas space)
5. Stage gets clear boundaries (artboard metaphor)
6. Workspace presets (Design/Animate/Code/3D/Export)

---

## Phase 1: Timeline Depth & Prominence (Week 1)

### 1.1 Redesign Timeline Layout

**Current Problem:** Timeline is hidden in footer, lacks depth**Solution:** Make timeline 30% of screen, always visible**File:** `components/AnimationTimeline.tsx`**New Layout:**

```javascript
┌─────────────────────────────────────────────────────────────┐
│ TIMELINE (30% of screen height)                             │
├─────────────────────────────────────────────────────────────┤
│ Layer Controls: [🔒] [👁️] [📄] [📁] [+ Layer]            │
├─────────────────────────────────────────────────────────────┤
│ Layer 1  🔒 👁️  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│              │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │
│ Layer 2  🔒 👁️  ━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│              │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │
│ Layer 3  🔒 👁️  ━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━ │
│              0  5  10 15 20 25 30 35 40 45 50 55 60 65 70 75│
│              ↑                                               │
│           Playhead (draggable)                               │
│                                                              │
│ Controls: [◄] [►] [⏸] [▶] [⏹] [Loop] [Onion Skin: 3]     │
│ Frame: [0] / [100] @ [24] FPS                               │
└─────────────────────────────────────────────────────────────┘
```

**Features to Add:**

- Keyframe diamonds (●) on timeline
- Tween spans (shaded regions between keyframes)
- Layer lock/hide/outline controls
- Folder layers (organize complex animations)
- Mask layers (clipping)
- Guide layers (non-rendering helpers)
- Frame labels (named frames for hashtag system)
- Onion skinning controls (see previous/next frames)
- Playhead indicator (draggable, shows current frame)

**Implementation:**

- Move timeline from footer to dedicated bottom panel (30% height)
- Add keyframe visualization (diamonds)
- Add tween span rendering (shaded regions)
- Add layer controls (lock, hide, outline)
- Add folder/mask/guide layer support
- Add frame label system
- Add onion skinning controls

---

### 1.2 Stage Boundaries & Artboard

**Current Problem:** Infinite canvas, no clear stage boundaries**Solution:** Add visible artboard/stage boundaries**File:** `components/Canvas.tsx`**New Layout:**

```javascript
┌─────────────────────────────────────────────────────────────┐
│ STAGE (with visible boundaries)                            │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ Pasteboard (grey area around stage)                    │ │
│ │ ┌─────────────────────────────────────────────────┐   │ │
│ │ │                                                   │   │ │
│ │ │   [550x400 Stage - clearly defined]             │   │ │
│ │ │   [White/colored background]                    │   │ │
│ │ │   [Grid visible inside stage]                   │   │ │
│ │ │                                                   │   │ │
│ │ └─────────────────────────────────────────────────┘   │ │
│ │ Pasteboard (grey area around stage)                    │ │
│ └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Features to Add:**

- Visible stage boundaries (artboard)
- Pasteboard area (grey area around stage)
- Stage size controls (width/height)
- Stage background color picker
- Grid only visible inside stage (optional)
- Rulers aligned to stage boundaries

**Implementation:**

- Add artboard component (visible rectangle)
- Add pasteboard area (grey background outside artboard)
- Add stage size controls to properties panel
- Add stage background color picker
- Update grid rendering to respect stage boundaries
- Update rulers to align to stage

---

## Phase 2: Hashtag System Prominence (Week 1-2)

### 2.1 Actions Panel (Flash-Style)

**Current Problem:** Hashtag system is hidden, not prominent**Solution:** Add dedicated Actions panel (Flash-style)**File:** `components/ActionsPanel.tsx` (NEW)**Layout:**

```javascript
┌─────────────────────────────────────┐
│ ACTIONS (Hashtag System)             │
├─────────────────────────────────────┤
│ Frame: [1 ▼] Layer: [layer1 ▼]     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ // Frame 1                       │ │
│ │ #onEnter {                       │ │
│ │   #move layer1 x:100 y:50       │ │
│ │   #fade layer1 opacity:0.5      │ │
│ │ }                                │ │
│ │                                  │ │
│ │ #onClick {                       │ │
│ │   #goto frame:10                │ │
│ │ }                                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Snippets] [Behaviors] [Help]      │
│ [Validate] [Test] [Save]           │
└─────────────────────────────────────┘
```

**Features:**

- Syntax highlighting (hashtags, targets, parameters)
- Auto-complete (triggers on `#`)
- Frame/layer selector dropdowns
- Command palette integration
- Validation (red underline on errors)
- Test button (runs script)
- Snippets library
- Behaviors library (pre-built hashtag scripts)
- Help panel (command reference)

**Integration:**

- Add to Right Sidebar as new tab "Actions"
- Or make it floating/dockable panel
- Link to timeline (click keyframe → shows actions for that frame)
- Link to layers (select layer → shows actions for that layer)

---

### 2.2 Command Palette Integration

**Current Problem:** Command palette exists but not integrated into workflow**Solution:** Make command palette accessible from Actions panel**File:** `components/CommandPalette.tsx` (may exist, enhance)**Features:**

- Searchable command browser
- Categories (Animation, Interaction, Logic, Media)
- Drag-and-drop into Actions panel
- Syntax templates
- Examples for each command
- Recent commands
- Favorites

**Integration:**

- Button in Actions panel: "[Command Palette]"
- Keyboard shortcut: `Cmd/Ctrl + Shift + P`
- Context menu: Right-click timeline → "Add Command"

---

## Phase 3: 3D Capabilities UI (Week 2)

### 3.1 3D Transform Panel

**Current Problem:** 3D capabilities mentioned but no UI**Solution:** Add 3D transform panel and viewport**File:** `components/Transform3DPanel.tsx` (NEW)**Layout:**

```javascript
┌─────────────────────────────────────┐
│ 3D TRANSFORM                         │
├─────────────────────────────────────┤
│ [Enable 3D Layer]                    │
│                                     │
│ Position                             │
│ ┌─────────────────────────────────┐ │
│ │ X: [0] Y: [0] Z: [0]            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Rotation                             │
│ ┌─────────────────────────────────┐ │
│ │ X: [0°] Y: [0°] Z: [0°]        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Perspective                         │
│ ┌─────────────────────────────────┐ │
│ │ [1000px ▼]                      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ CAMERA                               │
│ ┌─────────────────────────────────┐ │
│ │ Position: [0, 0, -1000]         │ │
│ │ Target:   [0, 0, 0]             │ │
│ │ FOV:      [45°]                  │ │
│ │                                  │ │
│ │ [Add Camera] [Orbit] [Pan]      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Features:**

- Enable 3D layer toggle
- 3D position (X, Y, Z)
- 3D rotation (X, Y, Z)
- Perspective control
- Camera controls (position, target, FOV)
- 3D viewport controls (orbit, pan, zoom)
- Axis gizmo (X/Y/Z indicators)
- Depth sorting visualization

**Integration:**

- Add to Right Sidebar as "3D" tab (or sub-tab in Properties)
- Add 3D viewport toggle to canvas
- Add 3D tools to Left Sidebar

---

### 3.2 3D Viewport

**File:** `components/Viewport3D.tsx` (NEW)**Features:**

- 3D rendering (WebGL or CSS 3D transforms)
- Orbit controls (mouse drag to rotate)
- Pan controls (middle mouse or space+drag)
- Zoom controls (mouse wheel)
- Axis gizmo (X/Y/Z indicators)
- Grid floor (optional)
- Lighting controls (if doing 3D rendering)

**Integration:**

- Toggle between 2D and 3D viewport
- Keyboard shortcut: `Cmd/Ctrl + 3` to toggle 3D view
- Add to canvas area (replace 2D canvas when 3D mode enabled)

---

## Phase 4: AI Panel as Modal/Overlay (Week 2)

### 4.1 Remove AI Panel from Center Stack

**Current Problem:** AI panel steals canvas space, interrupts workflow**Solution:** Make AI panel a modal/overlay**File:** `App.hardened.tsx`**Changes:**

- Remove AI panel from center stack
- Add floating AI panel button (top-right corner)
- Or add to header menu: "AI" → "Generate Vector"

**New Layout:**

```javascript
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
│ [File] [Edit] ... [AI ▼] [Save] [Load] [Export]          │
│         └─ Generate Vector                                 │
│         └─ AI Chat                                         │
└─────────────────────────────────────────────────────────────┘
```

**Or Floating Button:**

```javascript
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                                    ┌─────────────┐          │
│                                    │ ✨ AI       │          │
│                                    │ Generate    │          │
│                                    └─────────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Modal Layout (when opened):**

```javascript
┌─────────────────────────────────────────────────────────────┐
│ GENERATIVE VECTOR AI                              [×]       │
├─────────────────────────────────────────────────────────────┤
│ PROMPT                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Describe the vector you want to create...               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ STYLE                                                        │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                       │
│ │Line  │ │Flat  │ │Iso   │ │Abstr │                       │
│ │Art   │ │Icon  │ │metric│ │act   │                       │
│ └──────┘ └──────┘ └──────┘ └──────┘                       │
│                                                              │
│ [▶ Show Advanced]                                           │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [✨ Generate Vector]                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Features:**

- Modal overlay (doesn't steal canvas space)
- Can be dismissed quickly (ESC key or click outside)
- Can be minimized to floating button
- Keyboard shortcut: `Cmd/Ctrl + Shift + A`

---

## Phase 5: Workspace Presets (Week 3)

### 5.1 Workspace System

**Current Problem:** Single layout doesn't optimize for different workflows**Solution:** Add workspace presets (Adobe-style)**File:** `components/WorkspacePresets.tsx` (NEW)**Workspaces:**

1. **Design** - Canvas-focused (70% canvas, minimal panels)
2. **Animate** - Timeline-focused (50% canvas, 30% timeline, 20% panels)
3. **Code** - Script editor prominent (50% canvas, 30% Actions panel, 20% other)
4. **3D** - 3D viewport prominent (70% 3D viewport, 30% 3D controls)
5. **Export** - Export settings prominent (50% canvas, 30% export panel, 20% preview)
6. **Classic** - Flash CS6 layout (current layout)

**Implementation:**

- Add workspace selector to header: "Window" → "Workspace" → [Design/Animate/Code/3D/Export/Classic]
- Save workspace layouts to localStorage
- Allow custom workspace creation
- Keyboard shortcuts: `Cmd/Ctrl + 1-6` for workspaces

---

## Phase 6: Unified Inspector Panel (Week 3)

### 6.1 Apple-Style Inspector

**Current Problem:** Multiple panels (Properties, Layers, Scripts, etc.) scattered**Solution:** Unified inspector panel (Apple Motion-style)**File:** `components/UnifiedInspector.tsx` (NEW)**Layout:**

```javascript
┌─────────────────────────────────────┐
│ INSPECTOR                            │
├─────────────────────────────────────┤
│ [Object] [Animation] [Code] [3D]   │ ← Tabs
│                                     │
│ Object Tab                           │
│ ┌─────────────────────────────────┐ │
│ │ Transform                        │ │
│ │   Position: X [100] Y [200]     │ │
│ │   Scale:    X [100%] Y [100%]   │ │
│ │   Rotation: [0°]                 │ │
│ │   Opacity:  [100%]                │ │
│ │                                  │ │
│ │ Appearance                        │ │
│ │   Fill:     [🔴 #FF0000]        │ │
│ │   Stroke:   [⚫ #000000] [2px]   │ │
│ └─────────────────────────────────┘ │<h1>🎯 Product Lead: Strategic UI Assessment</h1>

<h2>Executive Summary</h2>

<p style="margin: 8px 0px;"><strong>Your wireframes are solid foundational work</strong>, but they need <strong>significant refinement</strong> before they're production-ready for a "Flash for React" product. Let me break this down from multiple industry perspectives.</p>

<hr>

<h2>1. Is This Good Enough? (Honest Assessment)</h2>

<h3>Current State: <strong>6/10</strong> - Functional but not competitive</h3>

<p style="margin: 8px 0px;"><strong>Strengths:</strong></p>

<ul style="padding-left: 20px; margin-bottom: 10px;">

<li>✅ Clear component hierarchy</li>

<li>✅ Comprehensive documentation</li>

<li>✅ Good technical foundation</li>

<li>✅ Thoughtful feature set</li>

</ul>

<p style="margin: 8px 0px;"><strong>Critical Gaps:</strong></p>

<ul style="padding-left: 20px; margin-bottom: 10px;">

<li>❌ <strong>No workflow optimization</strong> - How do users actually create animations?</li>

<li>❌ <strong>Missing timeline depth</strong> - Flash's timeline was its killer feature</li>

<li>❌ <strong>AI panel placement</strong> - Interrupts creative flow</li>

<li>❌ <strong>No stage/workspace metaphor</strong> - Flash had clear stage boundaries</li>

<li>❌ <strong>Hashtag system not visible</strong> - Your ActionScript equivalent is hidden</li>

<li>❌ <strong>3D capabilities not represented</strong> - Where's the 3D UI?</li>

</ul>

<hr>

<h2>2. How Would Industry Leaders Approach This?</h2>

<h3>🎨 <strong>Adobe's Approach</strong> (Flash/Animate/After Effects DNA)</h3>

<p style="margin: 8px 0px;"><strong>What they'd change:</strong></p>

<ol style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Timeline as Primary Interface</strong></li>

</ol>

<pre><code>┌─────────────────────────────────────────────────────────────┐

│ STAGE (Canvas) - 70% of screen                              │

│ ┌───────────────────────────────────────────────────────┐ │

│ │                                                         │ │

│ │   [Artboard with clear boundaries]                     │ │

│ │   [Playhead indicator]                                  │ │

│ │   [Frame markers visible on stage]                      │ │

│ │                                                         │ │

│ └───────────────────────────────────────────────────────┘ │

├─────────────────────────────────────────────────────────────┤

│ TIMELINE - 30% of screen (ALWAYS VISIBLE)                  │

│ ┌───────────────────────────────────────────────────────┐ │

│ │ Layer 1  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ │

│ │ Layer 2  ━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ │

│ │ Layer 3  ━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━ │ │

│ │          0    5    10   15   20   25   30   35   40   │ │

│ │          [Keyframes visible inline]                    │ │

│ └───────────────────────────────────────────────────────┘ │

└─────────────────────────────────────────────────────────────┘

</code></pre>

<p style="margin: 8px 0px;"><strong>Key Changes:</strong></p>

<ul style="padding-left: 20px; margin-bottom: 10px;">

<li>Timeline is <strong>always visible</strong> (not hidden in footer)</li>

<li>Stage has <strong>clear boundaries</strong> (artboard metaphor)</li>

<li><strong>Playhead</strong> visible on stage during scrubbing</li>

<li><strong>Onion skinning</strong> controls prominent</li>

<li><strong>Properties panel</strong> context-sensitive (changes based on selection)</li>

</ul>

<ol style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Workspace Presets</strong></li>

</ol>

<pre><code>File &gt; Workspace &gt; 

    - Animation (Timeline-focused)

    - Design (Canvas-focused)

    - Code (Script editor prominent)

    - Classic (Flash CS6 layout)

</code></pre>

<ol style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>AI Panel as Modal/Overlay</strong></li>

</ol>

<ul style="padding-left: 20px; margin-bottom: 10px;">

<li>Not permanent in layout</li>

<li>Opens as <strong>floating panel</strong> or <strong>modal</strong></li>

<li>Doesn't steal canvas space</li>

<li>Can be dismissed quickly</li>

</ul>

<hr>

<h3>🍎 <strong>Apple's Approach</strong> (Motion/Final Cut Pro DNA)</h3>

<p style="margin: 8px 0px;"><strong>What they'd change:</strong></p>

<ol style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Unified Inspector Panel</strong> (Right sidebar)</li>

</ol>

<pre><code>┌─────────────────────────────────────┐

│ INSPECTOR                            │

├─────────────────────────────────────┤

│ [Object] [Animation] [Code]         │ ← Tabs

│                                     │

│ Transform                            │

│ ┌─────────────────────────────────┐ │

│ │ Position: X [100] Y [200]       │ │

│ │ Scale:    X [100%] Y [100%]     │ │

│ │ Rotation: [0°]                   │ │

│ │ Opacity:  [100%]                 │ │

│ └─────────────────────────────────┘ │

│                                     │

│ Animation                            │

│ ┌─────────────────────────────────┐ │

│ │ [+ Add Behavior]                 │ │

│ │ [+ Add Keyframe]                 │ │

│ │                                  │ │

│ │ Easing: [Ease In Out ▼]        │ │

│ └─────────────────────────────────┘ │

│                                     │

│ Code (Hashtag System)                │

│ ┌─────────────────────────────────┐ │

│ │ #onEnter { ... }                 │ │

│ │ #onClick { ... }                 │ │

│ │ [+ Add Behavior]                 │ │

│ └─────────────────────────────────┘ │

└─────────────────────────────────────┘

</code></pre>

<p style="margin: 8px 0px;"><strong>Key Changes:</strong></p>

<ul style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Single inspector</strong> replaces multiple panels</li>

<li><strong>Context-sensitive</strong> (shows relevant properties)</li>

<li><strong>Hashtag system integrated</strong> into inspector</li>

<li><strong>Minimal chrome</strong> (more canvas space)</li>

<li><strong>Gestures</strong> for common actions (pinch to zoom, two-finger pan)</li>

</ul>

<ol style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Library Browser</strong> (Bottom panel)</li>

</ol>

<pre><code>┌─────────────────────────────────────────────────────────────┐

│ LIBRARY                                                      │

│ [Symbols] [Components] [Templates] [Assets]                 │

│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐             │

│ │Icon1 │ │Icon2 │ │Logo  │ │Btn   │ │Anim  │             │

│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘             │

└─────────────────────────────────────────────────────────────┘

</code></pre>

<hr>

<h3>🎬 <strong>Blackmagic (DaVinci Resolve) Approach</strong></h3>

<p style="margin: 8px 0px;"><strong>What they'd change:</strong></p>

<ol style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Page-Based Workflow</strong></li>

</ol>

<pre><code>[Edit] [Fusion] [Color] [Fairlight] [Deliver]

  ↓

Each "page" is a complete workspace optimized for that task

</code></pre>

<p style="margin: 8px 0px;"><strong>For VectorForge:</strong></p>

<pre><code>[Design] [Animate] [Code] [3D] [Export]

</code></pre>

<ul style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Design Page:</strong> Vector drawing tools prominent</li>

<li><strong>Animate Page:</strong> Timeline takes 50% of screen</li>

<li><strong>Code Page:</strong> Script editor + console prominent</li>

<li><strong>3D Page:</strong> 3D viewport + depth controls</li>

<li><strong>Export Page:</strong> Export settings + preview</li>

</ul>

<ol style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Node-Based Compositing</strong> (for complex animations)</li>

</ol>

<pre><code>┌─────────────────────────────────────────────────────────────┐

│ NODE EDITOR (Alternative to timeline for complex work)      │

│                                                              │

│   [Shape] ──→ [Transform] ──→ [Blur] ──→ [Output]         │

│                    ↓                                         │

│               [Animate]                                      │

│                                                              │

└─────────────────────────────────────────────────────────────┘

</code></pre>

<p style="margin: 8px 0px;"><strong>Key Changes:</strong></p>

<ul style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Dual timeline modes:</strong> Linear (traditional) + Node-based (advanced)</li>

<li><strong>Scopes/Meters</strong> for animation curves</li>

<li><strong>Playback controls</strong> always accessible (J/K/L keys)</li>

<li><strong>Render queue</strong> for exports</li>

</ul>

<hr>

<h3>🎮 <strong>Macromedia Flash Team Approach</strong> (Original Vision)</h3>

<p style="margin: 8px 0px;"><strong>What they'd prioritize:</strong></p>

<ol style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Stage-First Design</strong></li>

</ol>

<pre><code>┌─────────────────────────────────────────────────────────────┐

│ STAGE (with visible boundaries)                              │

│ ┌───────────────────────────────────────────────────────┐ │

│ │ ┌─────────────────────────────────────────────────┐   │ │

│ │ │                                                   │   │ │

│ │ │   [550x400 Stage - clearly defined]             │   │ │

│ │ │   [Pasteboard visible around stage]              │   │ │

│ │ │                                                   │   │ │

│ │ └─────────────────────────────────────────────────┘   │ │

│ └───────────────────────────────────────────────────────┘ │

└─────────────────────────────────────────────────────────────┘

</code></pre>

<ol style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Symbol-Based Workflow</strong></li>

</ol>

<pre><code>┌─────────────────────────────────────┐

│ LIBRARY                              │

│ ┌─────────────────────────────────┐ │

│ │ 📁 Symbols                       │ │

│ │   ├─ MovieClip1                 │ │

│ │   ├─ Button1                    │ │

│ │   └─ Graphic1                   │ │

│ │                                  │ │

│ │ 📁 Components                    │ │

│ │   ├─ UIButton                   │ │

│ │   └─ UIScrollbar                │ │

│ └─────────────────────────────────┘ │

│                                     │

│ [Convert to Symbol]                 │

│ [Edit Symbol]                       │

└─────────────────────────────────────┘

</code></pre>

<ol style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>ActionScript Panel</strong> (Your Hashtag System)</li>

</ol>

<pre><code>┌─────────────────────────────────────┐

│ ACTIONS (Hashtag System)             │

│ ┌─────────────────────────────────┐ │

│ │ // Frame 1                       │ │

│ │ #onEnter {                       │ │

│ │   this.play();                   │ │

│ │ }                                │ │

│ │                                  │ │

│ │ #onClick {                       │ │

│ │   this.gotoAndPlay(10);         │ │

│ │ }                                │ │

│ │                                  │ │

│ │ // Behaviors                     │ │

│ │ #tween(x: 100, duration: 1s)    │ │

│ └─────────────────────────────────┘ │

│                                     │

│ [Snippets] [Behaviors] [Help]      │

└─────────────────────────────────────┘

</code></pre>

<p style="margin: 8px 0px;"><strong>Key Changes:</strong></p>

<ul style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Stage has visible boundaries</strong> (not infinite canvas)</li>

<li><strong>Library is central</strong> (symbol-based workflow)</li>

<li><strong>Actions panel</strong> for hashtag system (not hidden)</li>

<li><strong>Properties panel</strong> shows instance properties</li>

<li><strong>Timeline shows tweens visually</strong> (motion paths on stage)</li>

</ul>

<hr>

<h2>3. Critical Missing Features</h2>

<h3>❌ <strong>Timeline Depth</strong></h3>

<p style="margin: 8px 0px;">Your current timeline:</p>

<pre><code>[◄ Prev] [► Next] [▶ Play] Frame 0/100 @ 24 FPS

</code></pre>

<p style="margin: 8px 0px;"><strong>What it should be:</strong></p>

<pre><code>┌─────────────────────────────────────────────────────────────┐

│ TIMELINE                                                     │

├─────────────────────────────────────────────────────────────┤

│ Layer 1  🔒 👁️  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │

│              │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │

│ Layer 2  🔒 👁️  ━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │

│              │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  │

│ Layer 3  🔒 👁️  ━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━ │

│              0  5  10 15 20 25 30 35 40 45 50 55 60 65 70 75│

│              ↑                                               │

│           Playhead                                           │

│                                                              │

│ [+ Layer] [Folder] [Mask] [Guide]                          │

└─────────────────────────────────────────────────────────────┘

</code></pre>

<p style="margin: 8px 0px;"><strong>Features needed:</strong></p>

<ul style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Keyframe visualization</strong> (diamonds on timeline)</li>

<li><strong>Tween spans</strong> (shaded regions between keyframes)</li>

<li><strong>Layer controls</strong> (lock, hide, outline mode)</li>

<li><strong>Folder layers</strong> (organize complex animations)</li>

<li><strong>Mask layers</strong> (clipping)</li>

<li><strong>Guide layers</strong> (non-rendering helpers)</li>

<li><strong>Frame labels</strong> (named frames for hashtag system)</li>

<li><strong>Onion skinning controls</strong> (see previous/next frames)</li>

</ul>

<hr>

<h3>❌ <strong>3D Capabilities Not Visible</strong></h3>

<p style="margin: 8px 0px;">You mention "3D vector editing" but there's no UI for it.</p>

<p style="margin: 8px 0px;"><strong>What's needed:</strong></p>

<pre><code>┌─────────────────────────────────────┐

│ 3D TRANSFORM                         │

│ ┌─────────────────────────────────┐ │

│ │ Position                         │ │

│ │   X: [0] Y: [0] Z: [0]          │ │

│ │                                  │ │

│ │ Rotation                         │ │

│ │   X: [0°] Y: [0°] Z: [0°]       │ │

│ │                                  │ │

│ │ Perspective: [1000px]            │ │

│ │                                  │ │

│ │ [Enable 3D Layer]                │ │

│ └─────────────────────────────────┘ │

│                                     │

│ CAMERA                               │

│ ┌─────────────────────────────────┐ │

│ │ Position: [0, 0, -1000]         │ │

│ │ Target:   [0, 0, 0]             │ │

│ │ FOV:      [45°]                  │ │

│ │                                  │ │

│ │ [Add Camera] [Orbit] [Pan]      │ │

│ └─────────────────────────────────┘ │

└─────────────────────────────────────┘

</code></pre>

<p style="margin: 8px 0px;"><strong>Also needed:</strong></p>

<ul style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>3D viewport controls</strong> (orbit, pan, zoom)</li>

<li><strong>Axis gizmo</strong> (X/Y/Z indicators)</li>

<li><strong>Depth sorting</strong> visualization</li>

<li><strong>Lighting controls</strong> (if doing 3D rendering)</li>

</ul>

<hr>

<h3>❌ <strong>Hashtag System Not Prominent</strong></h3>

<p style="margin: 8px 0px;">Your "ActionScript-like" hashtag system is <strong>your killer feature</strong> but it's hidden.</p>

<p style="margin: 8px 0px;"><strong>Where it should be:</strong></p>

<ol style="padding-left: 20px; margin-bottom: 10px;">

<li><strong>Actions Panel</strong> (dedicated panel)</li>

</ol>

<pre><code>┌─────────────────────────────────────┐

│ ACTIONS                              │

│ ┌─────────────────────────────────┐ │

│ │ Frame 1                          │ │

│ │ ┌─────────────────────────────┐ │

</code></pre>
│                                     │
│ Animation Tab                        │
│ ┌─────────────────────────────────┐ │
│ │ [+ Add Behavior]                 │ │
│ │ [+ Add Keyframe]                 │ │
│ │                                  │ │
│ │ Easing: [Ease In Out ▼]        │ │
│ │                                  │ │
│ │ Keyframes:                       │ │
│ │   Frame 0:  x:0, y:0            │ │
│ │   Frame 30: x:100, y:50          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Code Tab (Hashtag System)            │
│ ┌─────────────────────────────────┐ │
│ │ #onEnter { ... }                 │ │
│ │ #onClick { ... }                 │ │
│ │ [+ Add Behavior]                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 3D Tab                                │
│ ┌─────────────────────────────────┐ │
│ │ [Enable 3D Layer]                 │ │
│ │ Position: X [0] Y [0] Z [0]      │ │
│ │ Rotation: X [0°] Y [0°] Z [0°]   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Features:**

- Context-sensitive (shows relevant properties based on selection)
- Tabbed interface (Object, Animation, Code, 3D)
- Replaces multiple scattered panels
- More canvas space (single panel instead of multiple)

**Integration:**

- Replace Right Sidebar tabs with unified inspector
- Or add as new panel that can replace existing panels
- Context-sensitive: changes based on what's selected

---

## Success Criteria

### Week 1 Success:

- [ ] Timeline is 30% of screen, always visible
- [ ] Timeline shows keyframes, tweens, layer controls
- [ ] Stage has visible boundaries (artboard)
- [ ] Actions panel exists and is accessible

### Week 2 Success:

- [ ] 3D transform panel exists
- [ ] 3D viewport works (orbit, pan, zoom)
- [ ] AI panel is modal/overlay (doesn't steal canvas space)
- [ ] Command palette integrated into Actions panel

### Week 3 Success:

- [ ] Workspace presets work (Design/Animate/Code/3D/Export)
- [ ] Unified inspector panel exists
- [ ] All panels are context-sensitive
- [ ] Keyboard shortcuts work for all new features

### Final Success:

- [ ] UI feels competitive with Adobe Flash/Animate
- [ ] Hashtag system is prominent and accessible
- [ ] 3D capabilities have dedicated UI
- [ ] Workflow is optimized for different use cases
- [ ] Timeline is the primary interface for animation

---

## Files to Create/Modify

### New Files:

- `components/ActionsPanel.tsx` - Flash-style Actions panel
- `components/Transform3DPanel.tsx` - 3D transform controls
- `components/Viewport3D.tsx` - 3D viewport rendering
- `components/WorkspacePresets.tsx` - Workspace system
- `components/UnifiedInspector.tsx` - Apple-style inspector
- `components/Artboard.tsx` - Stage boundaries component
- `components/CommandPalette.tsx` - Enhanced command palette

### Modified Files:

- `App.hardened.tsx` - Remove AI panel from center stack, add workspace system
- `components/AnimationTimeline.tsx` - Redesign to 30% screen, add depth
- `components/Canvas.tsx` - Add artboard/stage boundaries
- `components/RightSidebar.tsx` - Add Actions tab, integrate unified inspector
- `components/LeftSidebar.tsx` - Add 3D tools

---

## Key Principles

1. **Timeline is Primary** - Always visible, 30% of screen
2. **Hashtag System is Prominent** - Dedicated Actions panel, not hidden
3. **3D Capabilities Visible** - Dedicated UI, not buried
4. **AI Doesn't Interrupt** - Modal/overlay, not permanent in layout
5. **Stage Has Boundaries** - Artboard metaphor, not infinite canvas
6. **Workflow Optimization** - Workspace presets for different use cases
7. **Context-Sensitive** - Panels change based on selection

8. **Industry Standards** - Follow Adobe Flash, Apple Motion, DaVinci Resolve patterns

---

## IMMEDIATE EXECUTION PLAN: From 6/10 to 9/10 to Release

### Phase 0: Canvas Visibility Blocker (TODAY - 2 hours)

**Status:** Canvas may be broken - this blocks everything**Action:** Run verification first, then apply fix**Steps:**

1. **Run Verification (10 min)**
   ```bash
      npm run dev
      # Open http://localhost:3000
      # Answer: Canvas: [Yes/No], Save: [Yes/No], Load: [Yes/No], Export: [Yes/No]
   ```




2. **If Canvas = No:**

- Apply emergency CSS fix (already exists in `src/styles/emergency-canvas-fix.css`)
- Verify canvas container has proper flex properties
- Check z-index stacking
- Fix container template issues

3. **If Canvas = Yes:**

- Document hotfix state
- Proceed to Phase 1

**Files to Check:**

- `App.hardened.tsx` line 2475-2514 (canvas area container)
- `components/Canvas.tsx` (canvas component)
- `styles/emergency-canvas-fix.css` (emergency CSS)
- `index.css` (base layout rules)

---

### Phase 1: Critical Ship Blockers (Week 1)

**Goal:** Get to 7/10 - Functional and usable**Priority Order:**

1. **Canvas Visibility** (P0 - blocks everything)
2. **Timeline Depth** (P0 - core feature)
3. **Library Panel** (P0 - symbol system)
4. **Actions Panel** (P0 - hashtag system)
5. **Stage Boundaries** (P1 - UX improvement)

**Success Criteria:**

- Canvas visible and functional
- Timeline shows layers and keyframes
- Users can create and reuse symbols
- Users can write hashtag scripts
- Stage has clear boundaries

---

### Phase 2: Professional Features (Week 2-3)

**Goal:** Get to 8/10 - Competitive with Flash**Priority Order:**

1. **Motion Paths** (P1 - animation workflow)
2. **Onion Skinning** (P1 - animation workflow)
3. **Shape Tweening** (P1 - animation workflow)
4. **Mask Layers** (P1 - effects)
5. **Workspace Presets** (P1 - workflow optimization)
6. **Unified Inspector** (P1 - UX improvement)
7. **AI Modal** (P1 - doesn't interrupt)

**Success Criteria:**

- Professional animation workflow works
- Users can create complex animations
- Workspace optimized for different tasks
- AI doesn't interrupt creative flow

---

### Phase 3: Advanced Features (Week 4)

**Goal:** Get to 9/10 - Industry-leading**Priority Order:**

1. **3D Transform Panel** (P2 - 3D capabilities)
2. **3D Viewport** (P2 - 3D capabilities)
3. **Bone Tool (IK)** (P2 - character animation)
4. **Node-Based Scripting** (P2 - advanced users)
5. **Camera System** (P2 - 3D capabilities)

**Success Criteria:**

- 3D capabilities visible and functional
- Advanced animation features work
- Power users have advanced tools

---

### Path to Full Release

**Current State:** 6/10 - Functional but not competitive**Release Criteria:**

- ✅ Canvas visible and functional
- ✅ Timeline shows layers/keyframes/tweens
- ✅ Library panel (symbol system)
- ✅ Actions panel (hashtag system)
- ✅ Stage boundaries (artboard)
- ✅ Basic animation workflow works
- ✅ Save/Load/Export functional
- ✅ No critical bugs

**Timeline to Release:**

- **Week 1:** Phase 0 + Phase 1 (Canvas + Timeline + Library + Actions + Stage)
- **Week 2-3:** Phase 2 (Professional features)
- **Week 4:** Phase 3 (Advanced features) + Polish
- **Week 5:** Testing + Bug fixes
- **Week 6:** Release candidate

**Total:** 6 weeks from current state to release---

## Immediate Next Steps (TODAY)

1. **Run Canvas Verification (10 min)**

- Start dev server
- Check canvas visibility
- Test Save/Load/Export
- Report results

2. **Fix Canvas If Broken (30 min)**

- Apply emergency CSS
- Fix container templates
- Verify in browser

3. **Begin Phase 1 Implementation (Rest of Week 1)**

- Timeline redesign
- Library panel
- Actions panel
- Stage boundaries