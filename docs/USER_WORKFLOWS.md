# User Workflows - VectorForge

**Date:** January 2025  
**Server Timestamp:** 1737955680000  
**Patent Tracking:** VF-UI-003  
**Status:** Living Document - Updated as features evolve

## Core User Workflows

### 1. Create New File Workflow

**5Ws:**
- **Who:** All users starting a new project
- **What:** Create a new blank document
- **When:** At start of work session or when starting new project
- **Where:** File menu → New (or Ctrl+N)
- **Why:** Need clean canvas to start creating

**Steps:**
1. User clicks File → New (or presses Ctrl+N)
2. Confirmation dialog appears (if there's unsaved work)
3. User confirms
4. Canvas clears to empty state
5. Empty state hint shows helpful tips
6. User can immediately start drawing

**Validation (Hows):**
- **How does user discover this?** File menu is standard location
- **How does user use this?** Click menu item or keyboard shortcut
- **How does user know it worked?** Canvas clears, toast notification shows "New file created"
- **How can user undo?** Can't undo file creation, but can reopen previous file
- **How does this integrate?** Resets all state (layers, history, pan, zoom)

**Success Criteria:**
- User can create new file in < 5 seconds
- Canvas clears completely
- User sees helpful empty state

---

### 2. Draw Rectangle Workflow

**5Ws:**
- **Who:** All users creating vector shapes
- **What:** Draw a rectangle on canvas
- **When:** When user wants to add rectangular shape
- **Where:** Tool selector (left sidebar) or keyboard shortcut (M)
- **Why:** Rectangles are common design element

**Steps:**
1. User selects Rectangle tool (click tool button or press M)
2. Tool highlights to show it's active
3. User clicks and drags on canvas
4. Rectangle preview appears as user drags
5. User releases mouse
6. Rectangle layer is created
7. Layer appears on canvas
8. Layer appears in layers panel
9. Layer is auto-selected
10. Toast shows "Created Rectangle 1"

**Validation (Hows):**
- **How does user discover this?** Tool selector in left sidebar, keyboard shortcut (M)
- **How does user use this?** Select tool, click and drag on canvas
- **How does user know it worked?** Rectangle appears, layer in panel, toast notification
- **How can user undo?** Ctrl+Z removes rectangle
- **How does this integrate?** Creates layer, updates SVG, adds to history

**Success Criteria:**
- User can draw rectangle in < 10 seconds
- Rectangle appears immediately
- Layer is selectable and editable

---

### 3. Edit Layer Properties Workflow

**5Ws:**
- **Who:** All users modifying existing layers
- **What:** Change layer properties (color, size, position, etc.)
- **When:** After creating layer or when modifying existing design
- **Where:** Right sidebar → Inspector tab
- **Why:** Need to customize appearance and position

**Steps:**
1. User selects layer (click on canvas or in layers panel)
2. Right sidebar automatically switches to Inspector tab
3. User sees layer properties (name, color, stroke, etc.)
4. User modifies property (e.g., changes color)
5. Change appears immediately on canvas
6. SVG updates automatically
7. Change is added to history

**Validation (Hows):**
- **How does user discover this?** Layer selection highlights inspector tab
- **How does user use this?** Select layer, modify properties in inspector
- **How does user know it worked?** Canvas updates immediately
- **How can user undo?** Ctrl+Z reverts change
- **How does this integrate?** Updates layer state, syncs with SVG, maintains history

**Success Criteria:**
- User can modify properties in < 5 seconds
- Changes appear immediately
- All properties are editable

---

### 4. Add Keyframe Workflow

**5Ws:**
- **Who:** Animators creating frame-based animations
- **What:** Add keyframe to layer at current frame
- **When:** When setting animation points
- **Where:** Timeline header → Keyframe button
- **Why:** Need to mark animation states

**Steps:**
1. User selects layer to animate
2. User scrubs timeline to desired frame
3. User positions/transforms layer on canvas
4. User clicks "Keyframe" button in timeline
5. Keyframe marker appears on timeline
6. Keyframe appears in layer track
7. Layer properties are saved for this frame

**Validation (Hows):**
- **How does user discover this?** Timeline header has Keyframe button
- **How does user use this?** Select layer, set frame, position layer, click Keyframe
- **How does user know it worked?** Keyframe marker appears on timeline
- **How can user undo?** Delete keyframe (double-click marker)
- **How does this integrate?** Saves layer state for frame, enables animation playback

**Success Criteria:**
- User can add keyframe in < 10 seconds
- Keyframe appears immediately
- Animation plays correctly

---

### 5. Save File Workflow

**5Ws:**
- **Who:** All users preserving their work
- **What:** Save current document
- **When:** Periodically during work or before closing
- **Where:** File menu → Save (or Ctrl+S)
- **Why:** Need to preserve work for later

**Steps:**
1. User clicks File → Save (or presses Ctrl+S)
2. If file is new, Save As dialog appears
3. User enters filename
4. File is saved to localStorage (or file system in standalone)
5. Toast shows "File saved"
6. File appears in recent files list

**Validation (Hows):**
- **How does user discover this?** Standard File menu location, keyboard shortcut
- **How does user use this?** Click menu or press Ctrl+S
- **How does user know it worked?** Toast notification, file in recent list
- **How can user undo?** Can't undo save, but can revert to previous save
- **How does this integrate?** Preserves all state (layers, SVG, history)

**Success Criteria:**
- User can save file in < 3 seconds
- File saves successfully
- File can be reopened

---

## Advanced Workflows

### 6. Non-Linear Editing Workflow

**5Ws:**
- **Who:** Power users, professional animators
- **What:** Switch between Timeline Mode and Node Editor Mode
- **When:** When user prefers node-based workflow
- **Where:** Timeline header → Mode toggle
- **Why:** Different workflows need different editing paradigms

**Steps:**
1. User clicks "Node Editor Mode" toggle in timeline header
2. Timeline transforms into node graph view
3. User can create animation nodes
4. User can connect nodes to create animation flow
5. User can switch back to Timeline Mode

**Status:** Not yet implemented

---

### 7. Export Animation Workflow

**5Ws:**
- **Who:** Users exporting finished animations
- **What:** Export animation to file format (GIF, MP4, WebM)
- **When:** When animation is complete
- **Where:** File menu → Export → Animation formats
- **Why:** Need to share or use animation elsewhere

**Steps:**
1. User completes animation
2. User clicks File → Export → Export as GIF/MP4/WebM
3. Export dialog appears
4. User sets export options (frame rate, quality, etc.)
5. User clicks Export
6. File downloads

**Status:** Not yet implemented

---

## Workflow Patterns

### Common Patterns:
1. **Create → Edit → Save** - Most common workflow
2. **Create → Animate → Export** - Animation workflow
3. **Open → Modify → Save** - Editing existing file
4. **Create → Duplicate → Modify** - Creating variations

### Pain Points to Address:
1. **Discovery** - Users may not know all available tools
2. **Feedback** - Users need clear confirmation of actions
3. **Undo/Redo** - Users need reliable history
4. **Integration** - Features should work together seamlessly

## Success Metrics

**Workflow Completion:**
- Create New File: < 5 seconds
- Draw Rectangle: < 10 seconds
- Edit Properties: < 5 seconds
- Add Keyframe: < 10 seconds
- Save File: < 3 seconds

**User Satisfaction:**
- Users can complete workflows without confusion
- Users understand what each step does
- Users can recover from mistakes (undo)
- Users can discover features naturally

