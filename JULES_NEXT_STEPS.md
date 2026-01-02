# Next Steps for Jules - VectorForge UI Fix

## ✅ What's Been Fixed

1. **Build Error Fixed**: Changed `const systemPrompt` to `let systemPrompt` in `components/DevChatbot.tsx` (line 717)
   - This was preventing the app from building/running
   - The error was: "This assignment will throw because 'systemPrompt' is a constant"

2. **CSS Layout**: The CSS Grid rules are already in place in `styles/xibalba-design-language.css`
   - Grid layout is defined (lines 850-918)
   - Tool dock column: 48px fixed width
   - AI panel column: Takes remaining space

## 🎯 What You Need to Do Next

### Step 1: Verify Build Works
```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run build
```

If this succeeds without errors, proceed to Step 2.

### Step 2: Start Dev Server
```bash
npm run dev
```

The app should start on `http://localhost:5173` (Vite default) or `http://localhost:3000` (if configured).

### Step 3: Open in Browser
1. Navigate to the dev server URL
2. Open browser DevTools (F12)
3. Inspect the `.sidebar-two-column-layout` element in the left sidebar

### Step 4: Verify CSS Grid is Applied
In DevTools Computed Styles tab, check:
- `display: grid` should be applied (not `flex`)
- `grid-template-columns: 48px 1fr` should be present
- `.tool-dock-column` should have `width: 48px`
- `.ai-panel-column` should have `grid-column: 2 / -1`

### Step 5: Visual Verification
- Tool dock (48px) should be on the far left
- AI panel should be to the right of tool dock
- **NO OVERLAP** between them
- Both should be clearly visible and separated

## 🔍 If Layout Still Overlaps

### Check CSS Specificity
The issue might be that `.xibalba-sidebar` in `styles/panel-layout-fixes.css` is overriding the grid.

**Solution**: Add this to `styles/xibalba-design-language.css` (after line 864):

```css
/* Override any flex rules on the sidebar container when it contains grid */
aside.sidebar-fixed-left .sidebar-two-column-layout,
.xibalba-sidebar .sidebar-two-column-layout {
  display: grid !important;
  grid-template-columns: 48px 1fr !important;
  flex-direction: unset !important;
}
```

### Check for Conflicting CSS
Look for any CSS rules that set `display: flex` on `.sidebar-two-column-layout` or `.xibalba-sidebar` and either:
1. Remove them, or
2. Make them more specific to exclude the grid layout

## 📋 Quick Checklist

- [ ] Build succeeds (`npm run build`)
- [ ] Dev server starts (`npm run dev`)
- [ ] App loads in browser (no console errors)
- [ ] Left sidebar visible
- [ ] Tool dock (48px) visible on far left
- [ ] AI panel visible to the right of tool dock
- [ ] No visual overlap between tool dock and AI panel
- [ ] Layout matches the design concept

## 🐛 Common Issues

### Issue: "Cannot find module"
**Solution**: Run `npm install` first

### Issue: Port already in use
**Solution**: 
```bash
kill $(lsof -t -i :5173) 2>/dev/null || true
npm run dev
```

### Issue: CSS not applying
**Solution**: 
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check DevTools Network tab - ensure CSS files are loading

### Issue: Still seeing overlap
**Solution**: 
1. Check browser DevTools Computed Styles
2. Look for any `display: flex` rules overriding `display: grid`
3. Add more specific CSS selectors with `!important` if needed

## 📝 Files to Check

1. **`components/LeftSidebar.tsx`** (lines 118-196)
   - Verify the `sidebar-two-column-layout` div has inline styles matching CSS

2. **`styles/xibalba-design-language.css`** (lines 850-918)
   - Verify grid rules are present and correct

3. **`styles/panel-layout-fixes.css`**
   - Check if `.xibalba-sidebar` has `display: flex` that might conflict

4. **`App.tsx`**
   - Verify LeftSidebar is being rendered correctly

## 🎉 Success Criteria

The layout is fixed when:
- ✅ Tool dock is exactly 48px wide on the left
- ✅ AI panel takes the remaining space on the right
- ✅ No visual overlap or z-stacking issues
- ✅ Both sections are clearly separated
- ✅ Layout matches the design concept image

## 💡 Pro Tips

1. **Use Browser DevTools**: The Computed Styles tab shows what CSS is actually applied
2. **Check Specificity**: More specific selectors win over less specific ones
3. **Use `!important` Sparingly**: Only when absolutely necessary (like here for grid layout)
4. **Test Incrementally**: Make one change, test, then make the next

Good luck! The CSS is already in place, you just need to verify it's working. 🚀

