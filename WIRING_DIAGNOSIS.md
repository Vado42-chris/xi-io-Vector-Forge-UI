# Wiring Diagnosis - What's Actually Connected

## 🎯 The Discovery

**You have a fully functional engine with no steering wheel.**

But actually... **the steering wheel exists, it just might not be connected properly.**

---

## ✅ What EXISTS

### The Engine (Backend)
**Location**: `components/DraftsmanCanvas.tsx`

**What Works**:
- ✅ Canvas rendering (SVG-based)
- ✅ Drawing tools (pen, pencil, brush, line, rectangle, ellipse)
- ✅ Drawing logic (`handlePointerDown`, `handlePointerMove`, `handlePointerUp`)
- ✅ Tool detection (`activeTool` prop)
- ✅ Layer management
- ✅ Coordinate conversion

**Key Code**:
```typescript
// Line 168: Drawing tools detection
if (['pen', 'pencil', 'brush', 'line', 'rectangle', 'ellipse', 'polygon', 'star', 'spiral'].includes(activeTool)) {
  setIsDrawing(true);
  setDrawStart({ x: snappedX, y: snappedY });
  setDrawPath([{ x: snappedX, y: snappedY }]);
}
```

---

### The UI (Frontend)
**Location**: `components/LeftSidebar.tsx`

**What Exists**:
- ✅ Tool dock (48px column)
- ✅ Tool buttons (select, pen, rectangle, ellipse, text, pan, zoom)
- ✅ Click handlers (`onClick={() => onToolChange && onToolChange(tool.id)}`)
- ✅ Icons and labels

**Key Code**:
```typescript
// Line 160: Button click handler
<button
  onClick={() => onToolChange && onToolChange(tool.id)}
  // ... button styling
>
```

---

## 🔌 The Connection

### How It Should Work

1. **User clicks button** in `LeftSidebar.tsx`
2. **Calls `onToolChange(tool.id)`**
3. **Updates `activeTool` in `App.tsx`**
4. **Passes `activeTool` to `DraftsmanCanvas`**
5. **Canvas uses `activeTool` to determine drawing behavior**

### The Wire

**LeftSidebar → App.tsx → DraftsmanCanvas**

---

## 🔍 What to Check

### 1. Is `onToolChange` being passed to LeftSidebar?

**Check**: `App.tsx` - Is `LeftSidebar` receiving `onToolChange` prop?

### 2. Is `activeTool` state being updated?

**Check**: `App.tsx` - Does clicking a tool button update `state.activeTool`?

### 3. Is `activeTool` being passed to DraftsmanCanvas?

**Check**: `App.tsx` - Is `DraftsmanCanvas` receiving `activeTool={state.activeTool}`?

### 4. Is DraftsmanCanvas using `activeTool` correctly?

**Check**: `DraftsmanCanvas.tsx` - Does it check `activeTool` in drawing handlers?

---

## 🎯 First Wire to Test

### Example: Rectangle Tool

**Function**: Drawing rectangle in `DraftsmanCanvas.tsx` (line 255-281)
**UI**: Rectangle button in `LeftSidebar.tsx` (line 74)
**Connection**: `onToolChange('rectangle')` → `setState({ activeTool: 'rectangle' })` → `DraftsmanCanvas` receives `activeTool='rectangle'`

**Test**:
1. Click rectangle button
2. Check if `activeTool` state updates
3. Click on canvas
4. Check if rectangle appears

---

## 📋 Immediate Action Plan

### Step 1: Verify the Wire (5 minutes)

1. Open `App.tsx`
2. Find where `LeftSidebar` is rendered
3. Check if `onToolChange` prop is passed
4. Check if it updates `state.activeTool`

### Step 2: Test One Tool (5 minutes)

1. Start dev server
2. Click rectangle button
3. Check browser console for state updates
4. Click on canvas
5. See if rectangle appears

### Step 3: Fix the Wire (if broken)

If the wire is broken:
- Add `onToolChange` handler in `App.tsx`
- Connect it to `setState({ activeTool: tool })`
- Pass it to `LeftSidebar`
- Test again

---

## 🚨 The Real Question

**Is the wire broken, or is it just not visible?**

Let's check `App.tsx` to see if `onToolChange` is actually connected...

---

**Status**: Diagnosis in progress. Let's find the actual connection point!

