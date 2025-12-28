# Foundation Fix Plan: Reliable File Creation & Editing

**Date:** January 2025  
**Priority:** CRITICAL - Everything depends on this

## The Problem

**User's Insight:** "We can't test any features unless we can reliably create a new file and start editing it. Everything else is built upon that concept."

## Current State

### What Works:
- `FILE_NEW` action exists and resets state
- Canvas component exists
- Drawing tools (pen, rectangle, ellipse) have handlers
- Layer creation logic exists

### What's Broken/Unclear:
- Can we actually create a new file and see it?
- Can we draw on the canvas and see the result?
- Can we edit what we've drawn?
- Is the workflow: New → Draw → Edit → Save actually functional?

## Foundation Workflow (Must Work 100%)

### Step 1: Create New File
1. User clicks File → New (or Ctrl+N)
2. Canvas clears to initial state
3. Empty state shows helpful hints
4. User can immediately start drawing

### Step 2: Draw Something
1. User selects a tool (Pen, Rectangle, Ellipse)
2. User clicks and drags on canvas
3. New layer is created
4. Layer appears immediately on canvas
5. Layer appears in layers panel
6. Layer is selected automatically

### Step 3: Edit What Was Drawn
1. User can select the layer
2. User can modify properties (color, size, position)
3. Changes appear immediately on canvas
4. Changes persist

### Step 4: Save the File
1. User clicks File → Save (or Ctrl+S)
2. File is saved to localStorage
3. Toast confirms save
4. File can be reopened

## Testing Checklist

- [ ] FILE_NEW clears canvas completely
- [ ] FILE_NEW resets all state properly
- [ ] Empty state shows when no layers
- [ ] Tool selection works (V, P, M, L keys)
- [ ] Drawing on canvas creates a layer
- [ ] Layer appears on canvas immediately
- [ ] Layer appears in layers panel
- [ ] Layer is automatically selected
- [ ] Selected layer shows in inspector
- [ ] Can modify layer properties
- [ ] Changes appear on canvas
- [ ] Can select different layers
- [ ] Can delete layers
- [ ] Can save file
- [ ] Can open saved file
- [ ] Opened file displays correctly

## Implementation Plan

### Phase 1: Fix FILE_NEW (30 min)
- Ensure state reset is complete
- Verify canvas clears
- Test empty state display

### Phase 2: Fix Drawing (1 hour)
- Verify tool selection works
- Test canvas pointer events
- Ensure layer creation works
- Verify layer appears on canvas
- Verify layer appears in panel

### Phase 3: Fix Editing (1 hour)
- Test layer selection
- Test property modification
- Verify canvas updates
- Test layer deletion

### Phase 4: Fix Save/Load (30 min)
- Test save to localStorage
- Test load from localStorage
- Verify state restoration

### Phase 5: End-to-End Test (30 min)
- Full workflow: New → Draw → Edit → Save → Open
- Verify everything works together
- Fix any integration issues

## Success Criteria

**Must Have:**
1. Can create new file reliably
2. Can draw on canvas and see result
3. Can edit what was drawn
4. Can save and reopen file

**Nice to Have:**
1. Smooth interactions
2. Visual feedback
3. Error handling
4. Toast notifications

## Next Steps After Foundation Works

Once the foundation is solid:
1. Add more drawing tools
2. Add more editing features
3. Add export formats
4. Add transform operations
5. Add path operations

But NONE of that matters if we can't create and edit a basic file first.

