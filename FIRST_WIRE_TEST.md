# First Wire Test - Rectangle Tool

## 🎯 The Discovery

**THE WIRE EXISTS!** It's already connected:

1. ✅ **LeftSidebar** has button: `onClick={() => onToolChange && onToolChange(tool.id)}`
2. ✅ **App.tsx** passes handler: `onToolChange={t => setState(p => ({ ...p, activeTool: t }))}`
3. ✅ **DraftsmanCanvas** receives: `activeTool={state.activeTool}`
4. ✅ **DraftsmanCanvas** uses it: `if (activeTool === 'rectangle' && drawPath.length === 2)`

**The wire is there. The question is: Is it working?**

---

## 🔍 What to Test

### Test 1: Button Click Updates State

1. Open browser DevTools
2. Click rectangle button in LeftSidebar
3. Check console for state update
4. Verify `activeTool` changes to `'rectangle'`

### Test 2: Canvas Drawing Works

1. Click rectangle button
2. Click on canvas (start point)
3. Drag mouse (end point)
4. Release mouse
5. **Expected**: Rectangle appears on canvas

---

## 🚨 Potential Issues

### Issue 1: `onToolChange` Not Passed to LeftSidebar

**Check**: `App.tsx` line ~1170 - Is `LeftSidebar` receiving `onToolChange` prop?

### Issue 2: State Not Updating

**Check**: Does clicking button actually call `setState`?

### Issue 3: Canvas Not Receiving `activeTool`

**Check**: Does `DraftsmanCanvas` receive the updated `activeTool`?

### Issue 4: Drawing Logic Broken

**Check**: Does the drawing logic in `DraftsmanCanvas` actually work?

---

## 🎯 Immediate Action

### Step 1: Verify the Wire (2 minutes)

Check `App.tsx` where `LeftSidebar` is rendered:
- Is `onToolChange` prop passed?
- Is `activeTool` prop passed?

### Step 2: Test in Browser (5 minutes)

1. Start dev server: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Open DevTools console
4. Click rectangle button
5. Check if state updates
6. Click on canvas
7. Drag and release
8. See if rectangle appears

### Step 3: Report Findings

Tell me:
- ✅ Does button click update state?
- ✅ Does rectangle appear when drawing?
- ❌ What's broken (if anything)?

---

## 📋 The Actual Code Path

### Button Click Flow:

```
User clicks rectangle button
  ↓
LeftSidebar.tsx line 161: onClick={() => onToolChange && onToolChange('rectangle')}
  ↓
App.tsx line 1136: onToolChange={t => setState(p => ({ ...p, activeTool: t }))}
  ↓
State updates: state.activeTool = 'rectangle'
  ↓
App.tsx line 1144: activeTool={state.activeTool} → DraftsmanCanvas
  ↓
DraftsmanCanvas.tsx line 168: if (['rectangle'].includes(activeTool))
  ↓
Drawing starts: setIsDrawing(true), setDrawStart(...)
  ↓
User drags mouse: handlePointerMove updates drawPath
  ↓
User releases: handlePointerUp creates rectangle layer
  ↓
Rectangle appears on canvas!
```

---

## 🎯 Next Steps

1. **Verify the wire is connected** (check App.tsx)
2. **Test in browser** (click button, draw rectangle)
3. **Report findings** (what works, what's broken)
4. **Fix if needed** (connect missing wire or fix bug)

---

**Status**: Wire exists! Let's test if it works!

