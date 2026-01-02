# Jules - Simple Debugging Steps

## 🎯 The Real Problem

The dev server isn't running. Let's fix this step by step.

## Step 1: Clean Start

```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI

# Kill any existing processes
kill $(lsof -t -i :5173) 2>/dev/null || true
kill $(lsof -t -i :3000) 2>/dev/null || true

# Clear any build artifacts
rm -rf dist node_modules/.vite
```

## Step 2: Start Dev Server (Choose ONE method)

### Option A: Vite Only (Simplest - Recommended)
```bash
npm run dev:vite
```

This will start Vite on `http://localhost:5173`

### Option B: Full Server (If you need backend)
```bash
npm run dev
```

This starts both Vite and the Express server.

## Step 3: Verify Server is Running

**In a NEW terminal window**, run:
```bash
curl http://localhost:5173 | head -20
```

You should see HTML output. If you get "Connection refused", the server isn't running.

## Step 4: Open in Browser

1. Open your browser
2. Go to: `http://localhost:5173`
3. Open DevTools (F12)
4. Check the Console tab for errors

## Step 5: Check What's Actually Rendering

In the browser console, run:
```javascript
// Check if React mounted
console.log(document.getElementById('root')?.innerHTML?.substring(0, 200));

// Check for errors
console.log('React:', typeof React);
```

## Step 6: If You See Errors

### Error: "Cannot find module"
```bash
npm install
```

### Error: "Port already in use"
```bash
# Find what's using the port
lsof -i :5173
# Kill it
kill -9 <PID>
```

### Error: White screen / Nothing renders
1. Check browser console for JavaScript errors
2. Check Network tab - are CSS/JS files loading?
3. Try hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

## Step 7: Verify Layout (Once App Loads)

1. Open DevTools (F12)
2. Click the Elements/Inspector tab
3. Find the left sidebar element
4. Look for `.sidebar-two-column-layout`
5. In Computed Styles, check:
   - `display` should be `grid` (not `flex`)
   - `grid-template-columns` should be `48px 1fr`

## 🐛 Common Issues & Fixes

### Issue: "npm run dev" doesn't work
**Check**: Look at `package.json` - `dev` script runs `server.js`, not Vite directly.

**Solution**: Use `npm run dev:vite` instead.

### Issue: Server starts but browser shows nothing
**Check**: Browser console for errors.

**Solution**: 
1. Check if `index.tsx` is importing `App.tsx` correctly
2. Check if there are any runtime errors in console
3. Try opening `http://localhost:5173` in incognito mode (rules out cache)

### Issue: CSS not applying
**Check**: Network tab - are CSS files loading?

**Solution**:
1. Hard refresh: Ctrl+Shift+R
2. Check if `styles/xibalba-design-language.css` is in the Network tab
3. Verify the CSS file actually contains the grid rules

## 📋 Quick Verification Checklist

- [ ] Server is running (`curl http://localhost:5173` returns HTML)
- [ ] Browser opens `http://localhost:5173`
- [ ] No console errors (check DevTools Console tab)
- [ ] App renders (you see the VectorForge UI)
- [ ] Left sidebar is visible
- [ ] DevTools shows `.sidebar-two-column-layout` with `display: grid`

## 🎯 What Success Looks Like

When it's working:
- ✅ Browser shows the VectorForge UI
- ✅ Left sidebar has tool dock (48px) on left
- ✅ AI panel is to the right of tool dock
- ✅ No overlap between them
- ✅ DevTools shows `display: grid` on `.sidebar-two-column-layout`

## 💡 Pro Tip

**Don't use Python scripts to verify** - just open the browser and look. The browser DevTools will tell you everything you need to know.

## 🚨 If Still Stuck

1. **Share the browser console errors** - copy/paste them
2. **Share what you see** - screenshot or description
3. **Share the server output** - what does `npm run dev:vite` print?

The CSS is already fixed. The issue is just getting the app to run and render. Focus on that first, then verify the layout.

