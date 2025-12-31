# Start Dev Server - Quick Guide

**Issue:** Connection Refused (ERR_CONNECTION_REFUSED)  
**Solution:** Start the dev server

---

## 🚀 Quick Start

### Option 1: Use Startup Script
```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
./start-dev-server.sh
```

### Option 2: Manual Start
```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run dev
```

---

## ✅ Verify Server is Running

### Check 1: Look for Output
You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Check 2: Test Connection
Open browser and go to: **http://localhost:5173**

Or test in terminal:
```bash
curl http://localhost:5173
```

---

## 🐛 Troubleshooting

### Issue: Port 5173 Already in Use
**Solution:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 5174
```

### Issue: node_modules Missing
**Solution:**
```bash
npm install
```

### Issue: npm Command Not Found
**Solution:**
```bash
# Install Node.js/npm first
# Or use nvm if installed
nvm use node
```

### Issue: Permission Denied
**Solution:**
```bash
chmod +x start-dev-server.sh
```

---

## 📋 After Server Starts

1. **Wait for:** "Local: http://localhost:5173"
2. **Open browser:** Navigate to http://localhost:5173
3. **Start testing:** Follow `START_VALIDATION.md`

---

## ✅ Success Indicators

- ✅ Server output shows "ready in xxx ms"
- ✅ Browser loads VectorForge UI
- ✅ No connection refused error
- ✅ Console shows no errors

---

**Once server is running, proceed with browser validation tests!**

