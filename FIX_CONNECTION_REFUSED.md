# Fix Connection Refused Error

**Error:** `ERR_CONNECTION_REFUSED` on `http://localhost:5173`  
**Cause:** Dev server is not running OR wrong port

**⚠️ IMPORTANT:** VectorForge is configured to run on **port 3000**, not 5173!

---

## ✅ Solution: Start the Dev Server

### Method 1: Terminal Command

**Open a terminal and run:**

```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run dev
```

**What to expect:**

- Terminal will show: `VITE v5.x.x  ready in xxx ms`
- Then: `➜  Local:   http://localhost:3000/` (Note: port 3000, not 5173!)
- **Keep this terminal open** (server runs in foreground)

### Method 2: Background Process

**If you want to run in background:**

```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run dev > /tmp/vite.log 2>&1 &
```

**Check if running:**

```bash
curl http://localhost:5173
```

---

## 🔍 Verify Server is Running

### Check 1: Terminal Output

Look for:

```text
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Check 2: Browser

**Use the correct port:** `http://localhost:3000` (not 5173!)

- ✅ **Success:** VectorForge UI loads
- ❌ **Still fails:** See troubleshooting below

### Check 3: Port Check

```bash
lsof -i :3000
```

Should show a node/vite process (checking port 3000, not 5173)

---

## 🐛 Troubleshooting

### Issue: "npm: command not found"

**Solution:** Node.js/npm not installed

```bash
# Check if node is installed
node --version
npm --version

# If not installed, install Node.js first
```

### Issue: "Port 3000 already in use"

**Solution:** Kill existing process

```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Issue: "Cannot find module"

**Solution:** Install dependencies

```bash
npm install
npm run dev
```

### Issue: "Permission denied"

**Solution:** Check file permissions

```bash
chmod +x start-dev-server.sh
```

### Issue: Server starts but browser still shows error

**Solution:**

1. Wait 5-10 seconds after server starts
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache
4. Try incognito/private window

---

## 📋 Step-by-Step Checklist

- [ ] Open terminal
- [ ] Navigate to project: `cd /home/chrishallberg/xi-io-Vector-Forge-UI`
- [ ] Run: `npm run dev`
- [ ] Wait for: "Local: <http://localhost:5173/>"
- [ ] Open browser: `http://localhost:3000` (correct port!)
- [ ] See VectorForge UI (not error page)

---

## ✅ Success Indicators

When server is running correctly:

- ✅ Terminal shows "ready in xxx ms"
- ✅ Terminal shows "Local: <http://localhost:3000/>" (port 3000!)
- ✅ Browser loads VectorForge UI at <http://localhost:3000>
- ✅ No connection refused error
- ✅ Dark grey theme visible
- ✅ File menu visible at top

---

## 🚀 After Server Starts

1. **Browser should load** VectorForge UI
2. **Follow validation guide:** `START_VALIDATION.md`
3. **Test components:** DevChatbot, ConversationHistoryPanel, etc.

---

**Start the server with: `npm run dev` in terminal!**
