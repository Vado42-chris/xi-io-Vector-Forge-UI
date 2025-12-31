# VectorFORGE UI Component Map - What Exists and Where

**Date:** January 27, 2025  
**Status:** 📋 **REFERENCE GUIDE**

---

## Overview

This document explains **what components exist**, **what they do**, **where they are**, and **how they're organized** in the VectorFORGE application.

---

## Main Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ HEADER (Fixed at top, 48px height)                     │
│ - ProfessionalFileMenu (File/Edit/Object menus)        │
│ - Xibalba logo and branding                            │
│ - Window controls                                       │
├──────────┬──────────────────────────────┬──────────────┤
│          │                              │              │
│ LEFT     │      CANVAS AREA              │   RIGHT      │
│ SIDEBAR  │      (Main drawing area)      │   SIDEBAR    │
│          │                              │              │
│ (320px)  │                              │   (360px)    │
│          │                              │              │
│          │                              │              │
└──────────┴──────────────────────────────┴──────────────┘
│ FOOTER (Bottom, status info)                            │
└─────────────────────────────────────────────────────────┘
```

---

## Component Categories

### 1. **FIXED Components** (Always visible, positioned)

#### Header (Top Bar)
- **Component:** `ProfessionalFileMenu.tsx`
- **Location:** Fixed at top (0px), height 48px
- **Purpose:** Main menu bar with File, Edit, Object, Type, Select, Effect, View, Window, Help
- **Status:** ✅ Rendered
- **Z-index:** 400 (above everything except modals)

#### Left Sidebar
- **Component:** `LeftSidebar.tsx`
- **Location:** Fixed left (0px), starts at 48px (below header), width 320px
- **Purpose:** Tool selection (Select, Pen, Rectangle, Ellipse, Text, Pan, Zoom)
- **Status:** ✅ Rendered (if `panelVisibility['left-sidebar']` is true)
- **Z-index:** 100
- **Type:** **SIDEBAR** (fixed panel on the side)

#### Right Sidebar
- **Component:** `RightSidebar.tsx`
- **Location:** Fixed right (0px), starts at 48px, width 360px
- **Purpose:** Tool properties, Object inspector, Layers panel, Scripts, Chat, Terminal, etc.
- **Status:** ✅ Rendered (if `panelVisibility['right-sidebar']` is true)
- **Z-index:** 100
- **Type:** **SIDEBAR** (fixed panel on the side)

#### Footer
- **Component:** `Footer.tsx`
- **Location:** Fixed at bottom
- **Purpose:** Status information, node count, fill info
- **Status:** ✅ Rendered
- **Z-index:** 100

---

### 2. **FLOATING Components** (Can be moved, appear on top)

#### Power User Toolbar
- **Component:** `PowerUserToolbar.tsx`
- **Location:** Floating (can be dragged)
- **Purpose:** Snap to grid, show guides, grid size, onion skin controls
- **Status:** ✅ Rendered (inside canvas area)
- **Type:** **TOOLBAR** (floating toolbar)

#### XP Display
- **Component:** `XPDisplay.tsx`
- **Location:** Fixed bottom-right (floating)
- **Purpose:** Shows user XP, level, progress
- **Status:** ✅ Rendered
- **Z-index:** 300

---

### 3. **CANVAS Components** (Drawing area)

#### DraftsmanCanvas
- **Component:** `DraftsmanCanvas.tsx`
- **Location:** Main center area (between sidebars)
- **Purpose:** The main drawing canvas where you create vector graphics
- **Status:** ✅ Rendered
- **Features:**
  - Rulers (top and left)
  - Grid background
  - Guides
  - SVG rendering
  - Tool interactions (pen, rectangle, ellipse, etc.)
- **Type:** **CANVAS** (main drawing surface)

#### Professional Rulers
- **Component:** `ProfessionalRulers.tsx`
- **Location:** Top and left edges of canvas
- **Purpose:** Measurement rulers with real units
- **Status:** ✅ Rendered (inside DraftsmanCanvas)

#### Transform Handles
- **Component:** `TransformHandles.tsx`
- **Location:** Overlay on selected objects in canvas
- **Purpose:** Resize, rotate, move selected objects
- **Status:** ✅ Rendered (when object selected)

#### Node Editor
- **Component:** `NodeEditor.tsx`
- **Location:** Overlay on selected paths in canvas
- **Purpose:** Edit path nodes (anchor points, curves)
- **Status:** ✅ Rendered (when path selected with direct-select tool)

---

### 4. **PANEL Components** (Collapsible, tabbed interfaces)

#### Right Sidebar Panels (Tabs)
- **Component:** `RightSidebar.tsx` uses `TabSystem.tsx`
- **Tabs:**
  - **Tool:** Tool properties panel
  - **Object:** Object inspector
  - **Layers:** Layers panel (`ProfessionalLayersPanel.tsx`)
  - **Scripts:** Script editor (`ScriptEditor.tsx`)
  - **Chat:** AI Chatbot (`AIChatbot.tsx`)
  - **Console:** Console output
  - **Engine:** Engine status
  - **Registry:** Registry browser (`RegistryBrowser.tsx`)
  - **History:** History/undo
  - **Help:** Contextual help (`ContextualHelpPanel.tsx`)
  - **Files:** File browser (`FileBrowser.tsx`)
  - **Terminal:** Terminal (`Terminal.tsx`)
  - **Dev Chat:** Dev chatbot (`DevChatbot.tsx`)
  - **Tasks:** Task management
- **Type:** **TAB SYSTEM** (multiple panels in one container)

#### Professional Layers Panel
- **Component:** `ProfessionalLayersPanel.tsx`
- **Location:** Inside Right Sidebar, "Layers" tab
- **Purpose:** Manage layers (show/hide, lock, reorder, group)
- **Type:** **PANEL** (collapsible content area)

---

### 5. **DIALOG Components** (Modal windows)

#### Preferences Dialog
- **Component:** `PreferencesDialog.tsx`
- **Location:** Modal overlay (centered)
- **Purpose:** Application settings and preferences
- **Status:** ✅ Rendered (when `showPreferences` is true)
- **Type:** **DIALOG** (modal window)

#### Project Wizard
- **Component:** `ProjectWizard.tsx`
- **Location:** Modal overlay
- **Purpose:** Create new projects
- **Status:** ✅ Rendered (when `showProjectWizard` is true)
- **Type:** **DIALOG** (modal wizard)

#### Template Library
- **Component:** `TemplateLibrary.tsx`
- **Location:** Modal overlay
- **Purpose:** Browse and use templates
- **Status:** ✅ Rendered (when `showTemplateLibrary` is true)
- **Type:** **DIALOG** (modal library)

#### Welcome Screen
- **Component:** `WelcomeScreen.tsx`
- **Location:** Modal overlay (full screen)
- **Purpose:** First-time user welcome
- **Status:** ✅ Rendered (when `showWelcome` is true)
- **Type:** **DIALOG** (full-screen modal)

#### Error Prevention Dialog
- **Component:** `ErrorPreventionDialog.tsx`
- **Location:** Modal overlay
- **Purpose:** Warn before destructive actions
- **Status:** ✅ Rendered (when `showErrorPrevention` is true)
- **Type:** **DIALOG** (confirmation modal)

---

### 6. **DRAWER Components** (Slide-out panels)

**Note:** Currently, there are no dedicated "drawer" components. Sidebars act as fixed panels, not drawers.

**Potential Drawer Components:**
- Could be added for:
  - Settings drawer (slides from right)
  - History drawer (slides from left)
  - Notification drawer (slides from top)

---

### 7. **ACCORDION Components** (Expandable sections)

**Note:** Currently, there are no dedicated "accordion" components. Tabs in RightSidebar provide similar functionality.

**Potential Accordion Components:**
- Could be added for:
  - Collapsible sections in panels
  - Nested layer groups
  - Property groups

---

### 8. **PALETTE Components** (Tool collections)

#### Dockable Tool Palette
- **Component:** `DockableToolPalette.tsx`
- **Location:** Can be docked or floating
- **Purpose:** Collection of tools (similar to LeftSidebar but dockable)
- **Status:** ✅ Component exists (may not be rendered in main layout)
- **Type:** **PALETTE** (tool collection)

#### Tool Palette
- **Component:** `ToolPalette.tsx`
- **Location:** Can be floating or docked
- **Purpose:** Alternative tool palette
- **Status:** ✅ Component exists (may not be rendered in main layout)
- **Type:** **PALETTE** (tool collection)

---

### 9. **TOOLBAR Components** (Action bars)

#### Power User Toolbar
- **Component:** `PowerUserToolbar.tsx`
- **Location:** Floating in canvas area
- **Purpose:** Advanced canvas controls (snap, guides, grid)
- **Status:** ✅ Rendered
- **Type:** **TOOLBAR** (floating toolbar)

#### Floating Toolbar
- **Component:** `FloatingToolbar.tsx`
- **Location:** Floating (can be positioned anywhere)
- **Purpose:** Quick actions toolbar
- **Status:** ✅ Component exists (may not be rendered in main layout)
- **Type:** **TOOLBAR** (floating toolbar)

---

### 10. **SHARED Components** (Reusable UI elements)

#### ToolButton
- **Component:** `shared/ToolButton.tsx`
- **Purpose:** Consistent tool button styling
- **Used by:** LeftSidebar, DockableToolPalette, FloatingToolbar
- **Type:** **SHARED COMPONENT**

#### EmptyState
- **Component:** `shared/EmptyState.tsx`
- **Purpose:** "No content" placeholder
- **Used by:** LeftSidebar, RightSidebar
- **Type:** **SHARED COMPONENT**

#### StatusIndicator
- **Component:** `shared/StatusIndicator.tsx`
- **Purpose:** System status display (READY, PROCESSING, etc.)
- **Used by:** LeftSidebar
- **Type:** **SHARED COMPONENT**

#### TabSystem
- **Component:** `shared/TabSystem.tsx`
- **Purpose:** Tabbed interface
- **Used by:** RightSidebar
- **Type:** **SHARED COMPONENT**

#### IconButton
- **Component:** `shared/IconButton.tsx`
- **Purpose:** Icon-only buttons
- **Used by:** RightSidebar, various panels
- **Type:** **SHARED COMPONENT**

---

## Component Status in App.hardened.tsx

### ✅ Currently Rendered:
1. **ProfessionalFileMenu** - Header menu bar
2. **LeftSidebar** - Tool selection (if visible)
3. **RightSidebar** - Properties/inspector (if visible)
4. **DraftsmanCanvas** - Main drawing canvas
5. **PowerUserToolbar** - Canvas controls
6. **Footer** - Status bar
7. **XPDisplay** - XP indicator
8. **ToastContainer** - Notifications
9. **WelcomeScreen** - First-time welcome (if shown)
10. **ErrorDashboard** - Error display (if shown)
11. **ProjectWizard** - Project creation (if shown)
12. **TemplateLibrary** - Templates (if shown)
13. **PreferencesDialog** - Settings (if shown)
14. **ErrorPreventionDialog** - Confirmations (if shown)
15. **ConversationHistoryPanel** - Chat history (if shown)
16. **ErrorDisplay** - Error messages

### ⚠️ Components Exist But May Not Be Rendered:
- **DockableToolPalette** - Tool palette (may be conditionally rendered)
- **FloatingToolbar** - Floating toolbar (may be conditionally rendered)
- **AnimationTimeline** - Timeline (may be conditionally rendered)
- **SprintBoard** - Task board (may be conditionally rendered)
- **InspectorPanel** - Inspector (may be inside RightSidebar)
- **ToolPropertiesPanel** - Tool properties (may be inside RightSidebar)

---

## Template System

### What is a "Template"?
In this context, "templates" refer to:
1. **Layout Templates** - How components are arranged (header, sidebars, canvas)
2. **Component Templates** - Reusable component structures (panels, toolbars, dialogs)
3. **Project Templates** - Pre-configured project setups

### Current Template Structure:
```
Root Template (App.hardened.tsx)
├── Header Template (ProfessionalFileMenu)
├── Main Content Template
│   ├── Left Sidebar Template (LeftSidebar)
│   ├── Canvas Area Template
│   │   ├── Power Toolbar Template (PowerUserToolbar)
│   │   └── Canvas Template (DraftsmanCanvas)
│   └── Right Sidebar Template (RightSidebar)
└── Footer Template (Footer)
```

---

## Common UI Patterns

### 1. **Fixed vs Floating**
- **Fixed:** Positioned relative to viewport (header, sidebars, footer)
- **Floating:** Can be moved/dragged (toolbars, palettes)

### 2. **Panel vs Dialog**
- **Panel:** Part of main layout (sidebars, tabs)
- **Dialog:** Modal overlay (preferences, wizards)

### 3. **Sidebar vs Drawer**
- **Sidebar:** Always visible, fixed position
- **Drawer:** Slides in/out, can be hidden

### 4. **Toolbar vs Palette**
- **Toolbar:** Action buttons (save, undo, etc.)
- **Palette:** Tool collection (pen, rectangle, etc.)

---

## Where Components Are Located

### File Structure:
```
components/
├── ProfessionalFileMenu.tsx      # Header menu
├── LeftSidebar.tsx               # Left tool panel
├── RightSidebar.tsx               # Right properties panel
├── DraftsmanCanvas.tsx            # Main canvas
├── PowerUserToolbar.tsx           # Floating toolbar
├── Footer.tsx                     # Status footer
├── shared/                        # Reusable components
│   ├── ToolButton.tsx
│   ├── EmptyState.tsx
│   ├── StatusIndicator.tsx
│   ├── TabSystem.tsx
│   └── IconButton.tsx
└── [Other components...]
```

---

## Next Steps

1. **Verify all components render correctly**
2. **Check z-index hierarchy**
3. **Ensure proper positioning**
4. **Test interactivity**
5. **Fix any remaining layout issues**

---

## Questions Answered

**Q: What's meant to be fixed?**  
A: Header (top), Sidebars (left/right), Footer (bottom)

**Q: What's meant to be floating?**  
A: PowerUserToolbar, XPDisplay, tool palettes (if shown)

**Q: What is a drawer?**  
A: Currently none - sidebars are fixed, not drawers. Could add slide-out drawers.

**Q: What is an accordion?**  
A: Currently none - tabs provide similar functionality. Could add expandable sections.

**Q: What is a palette?**  
A: Tool collection (DockableToolPalette, ToolPalette) - groups of tools together.

**Q: What is a toolbar?**  
A: Action bar (PowerUserToolbar, FloatingToolbar) - buttons for actions.

**Q: Where are your templates?**  
A: Layout templates are in `App.hardened.tsx`. Component templates are in `components/` directory.

**Q: What am I missing?**  
A: Check browser console for errors. Verify all components are rendering. Check z-index conflicts.

---

## Current Issues to Fix

1. **Layout positioning conflicts** - Fixed
2. **Z-index overlay issues** - Fixed
3. **Component visibility** - Need to verify
4. **Template structure** - Need to verify
5. **Missing components** - Need to check what's not rendering

