# Debug: Why UI Won't Render

**Problem:** Can't see anything in Cursor's browser

---

## 🔍 Immediate Checks

### 1. Is Server Running?
```bash
curl http://localhost:3000
```

**If it works:** You'll see HTML  
**If it fails:** Server isn't running → `npm run dev`

### 2. Test Simple Page
Open in browser: `http://localhost:3000/test-simple.html`

**If this works:** Server is fine, app has issues  
**If this fails:** Server isn't running

### 3. Check Browser Console
1. Open browser (http://localhost:3000)
2. Press F12 (open DevTools)
3. Go to Console tab
4. **Tell me what errors you see**

---

## 🐛 Common Issues

### Issue: Blank White/Black Page
**Cause:** React app failed to render

**Check:**
- Browser console (F12) → Console tab
- Look for red errors
- Common errors:
  - "Cannot find module"
  - "localStorage is not defined"
  - "Service initialization failed"

### Issue: "Cannot find module"
**Fix:**
```bash
npm install
npm run dev
```

### Issue: localStorage Error
**Fix:** Services trying to access localStorage before DOM ready

### Issue: Service Initialization Error
**Fix:** Service constructor throwing error

---

## ✅ What Should Render

**If app works, you should see:**
1. Dark grey background
2. File menu at top (FILE, EDIT, VIEW, etc.)
3. Left sidebar (tools)
4. Right sidebar (panels)
5. Canvas in center

**If you see NONE of these:** App isn't rendering

---

## 🚨 Tell Me

1. **Does test-simple.html load?** (http://localhost:3000/test-simple.html)
2. **What do you see in browser?** (blank? error? something?)
3. **What errors in console?** (F12 → Console tab)

**I'll fix it immediately once I know what's wrong.**

