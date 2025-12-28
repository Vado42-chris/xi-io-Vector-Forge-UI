# Tooltip Implementation Plan

**Date:** 2025-01-27  
**Server Timestamp:** 2025-12-27 19:05:00 UTC  
**Local Timestamp:** 2025-12-27 13:05:00 CST  
**Blockchain Seed:** seed001  
**Work Tracking ID:** WT-2025-01-27-011  
**Patent Tracking:** VF-TOOLTIP-IMPL-001

## Purpose

This document outlines the tooltip implementation strategy for VectorForge, ensuring all UI elements have helpful tooltips with keyboard shortcuts and contextual information, following MAI principles.

---

## I. Tooltip Requirements

### 5Ws Analysis

**Who:** All users (especially new users)  
**What:** Contextual help text on hover/focus (tool names, keyboard shortcuts, feature descriptions)  
**When:** On hover/focus, after delay (300ms default), when feature is first used  
**Where:** Near the UI element, positioned to not obscure content  
**Why:** Discoverability and learning - users need to understand what features do  
**How to Validate:**
- ✅ Tooltips appear after reasonable delay (300ms)
- ✅ Tooltips are readable (contrast, font size)
- ✅ Tooltips don't obscure important content
- ✅ Tooltips include keyboard shortcuts when available
- ✅ Tooltips can be disabled in preferences
- ✅ Tooltips work with keyboard navigation

**MAI Score:** 75 (P1 - Contextually Visible)

---

## II. Tooltip Categories

### Priority 1: Core Tools (P0 - Always Visible)
- **Tools in Left Sidebar:** Pen, Rectangle, Ellipse, Select, Pan, Zoom, etc.
- **Toolbar Buttons:** Canvas settings, snap, guides, onion skin
- **File Menu Items:** New, Save, Open, Export, etc.

### Priority 2: Property Controls (P1 - Contextually Visible)
- **Tool Properties Panel:** All input fields (fill, stroke, corner radius, etc.)
- **Object Inspector:** All property inputs (color, stroke width, opacity, etc.)
- **Layer Panel:** Layer actions (visibility, lock, delete, etc.)

### Priority 3: Advanced Features (P2 - Discoverable)
- **Timeline Controls:** Playback, keyframe, non-linear toggle
- **Script Editor:** Syntax help, command reference
- **AI Chat:** Feature descriptions, usage tips

### Priority 4: Business Features (P2 - Discoverable)
- **Marketplace:** Feature descriptions
- **Subscription:** Tier benefits, upgrade prompts
- **Social Media:** Platform-specific tips

---

## III. Tooltip Content Standards

### Format
```
[Icon] [Feature Name] ([Keyboard Shortcut])
[Brief Description]
[Contextual Help Link (if available)]
```

### Examples

**Tool Button:**
```
✏️ Pen Tool (P)
Draw freeform paths and shapes
Press P to select, click and drag to draw
```

**Menu Item:**
```
💾 Save (Ctrl+S)
Save your current document
Saves to browser storage
```

**Property Input:**
```
🎨 Fill Color
Set the fill color for new shapes
Click to open color picker
```

**Advanced Feature:**
```
🎬 Non-Linear Editing
Switch to node-based animation editor
Learn more about non-linear editing
```

---

## IV. Implementation Strategy

### Phase 1: Core Tools (Week 1)
1. **Left Sidebar Tools**
   - All tool buttons
   - Tab buttons
   - Quick tool selector

2. **File Menu**
   - All menu items
   - Submenu items
   - Keyboard shortcuts

3. **Toolbar**
   - Canvas settings
   - Snap/guides
   - Onion skin

### Phase 2: Property Controls (Week 2)
1. **Tool Properties Panel**
   - All input fields
   - Checkboxes
   - Dropdowns

2. **Object Inspector**
   - Color pickers
   - Number inputs
   - Shape properties

3. **Layer Panel**
   - Layer actions
   - Visibility toggle
   - Lock toggle

### Phase 3: Advanced Features (Week 3)
1. **Timeline**
   - Playback controls
   - Keyframe actions
   - Mode toggles

2. **Script Editor**
   - Syntax help
   - Command reference
   - Error messages

3. **AI Chat**
   - Feature descriptions
   - Usage tips
   - Example prompts

### Phase 4: Business Features (Week 4)
1. **Marketplace**
   - Feature descriptions
   - Purchase flow
   - Seller tools

2. **Subscription**
   - Tier benefits
   - Upgrade prompts
   - Usage tracking

3. **Social Media**
   - Platform tips
   - Format requirements
   - Best practices

---

## V. Tooltip Component Usage

### Basic Usage
```tsx
import Tooltip from './Tooltip';

<Tooltip content="Pen Tool (P) - Draw freeform paths">
  <button>Pen</button>
</Tooltip>
```

### With Keyboard Shortcut
```tsx
<Tooltip content="Save (Ctrl+S) - Save your current document">
  <button>Save</button>
</Tooltip>
```

### With Contextual Help
```tsx
<Tooltip 
  content={
    <>
      <strong>Fill Color</strong>
      <br />
      Set the fill color for new shapes
      <br />
      <a href="/help/colors">Learn more</a>
    </>
  }
  position="top"
  delay={300}
>
  <input type="color" />
</Tooltip>
```

---

## VI. Keyboard Shortcut Reference

### File Operations
- **New:** Ctrl+N
- **Open:** Ctrl+O
- **Save:** Ctrl+S
- **Save As:** Ctrl+Shift+S
- **Close:** Ctrl+W
- **Exit:** Ctrl+Q

### Edit Operations
- **Undo:** Ctrl+Z
- **Redo:** Ctrl+Shift+Z
- **Cut:** Ctrl+X
- **Copy:** Ctrl+C
- **Paste:** Ctrl+V
- **Delete:** Delete/Backspace

### Tools
- **Select:** V
- **Direct Select:** A
- **Pen:** P
- **Rectangle:** M
- **Ellipse:** L
- **Text:** T
- **Pan:** H
- **Zoom:** Z

### Object Operations
- **Group:** Ctrl+G
- **Ungroup:** Ctrl+Shift+G
- **Lock:** Ctrl+2
- **Unlock:** Ctrl+Alt+2
- **Clipping Mask:** Ctrl+7
- **Release Clipping Mask:** Ctrl+Alt+7

### View Operations
- **Zoom In:** Ctrl+Plus
- **Zoom Out:** Ctrl+Minus
- **Fit to Window:** Ctrl+0
- **Actual Size:** Ctrl+1

---

## VII. Accessibility Considerations

### Keyboard Navigation
- Tooltips appear on focus (not just hover)
- Tooltips can be dismissed with Escape
- Tooltips don't trap keyboard focus

### Screen Readers
- Tooltips are announced by screen readers
- Tooltips include ARIA labels
- Tooltips don't duplicate button labels

### Visual Accessibility
- High contrast text
- Readable font size (minimum 11px)
- Clear positioning (doesn't obscure content)

---

## VIII. Implementation Checklist

### Core Tools
- [ ] Left sidebar tool buttons
- [ ] File menu items
- [ ] Toolbar buttons
- [ ] Canvas settings

### Property Controls
- [ ] Tool properties panel inputs
- [ ] Object inspector inputs
- [ ] Layer panel actions

### Advanced Features
- [ ] Timeline controls
- [ ] Script editor
- [ ] AI chat

### Business Features
- [ ] Marketplace
- [ ] Subscription
- [ ] Social media

---

## IX. Testing Checklist

### Functional
- ✅ Tooltips appear on hover (300ms delay)
- ✅ Tooltips appear on focus
- ✅ Tooltips dismiss on mouse leave/blur
- ✅ Tooltips don't obscure content
- ✅ Tooltips work with keyboard navigation

### Usability
- ✅ Tooltips are readable
- ✅ Tooltips include keyboard shortcuts
- ✅ Tooltips provide helpful information
- ✅ Tooltips can be disabled

### Accessibility
- ✅ Tooltips work with screen readers
- ✅ Tooltips have proper ARIA labels
- ✅ Tooltips don't trap focus
- ✅ Tooltips have high contrast

---

**This document is part of the legal evidence chain for patent processes and work tracking.**

**Patent:** VF-TOOLTIP-IMPL-001  
**Blockchain Seed:** seed001  
**Work Tracking ID:** WT-2025-01-27-011

