# 🐍 Verify Molting System is Working

## ✅ **Step-by-Step Verification**

### **Step 1: Open Dev Chat**

**Option A: Keyboard Shortcut**
- Press `Ctrl+K` (or `Cmd+K` on Mac)
- Should open Right Sidebar → "Dev Chat" tab

**Option B: Manual**
- Look for Right Sidebar on the right side of screen
- Click "Dev Chat" tab

**If you don't see Right Sidebar:**
- Check if it's collapsed (look for a resize handle)
- Check `panelVisibility['right-sidebar']` in App state

---

### **Step 2: Test Basic Connectivity**

Type in Dev Chat:
```
test
```

**Expected Response:**
```
✅ System Status: ONLINE

- File system: ✅ Working
- Dev Chat: ✅ Ready
- Self-modification: ✅ Available
```

**If Error:**
- Check dev server is running: `npm run dev`
- Check browser console for errors
- Check backend API is accessible

---

### **Step 3: Test File Operations**

Type:
```
read package.json
```

**Expected:** File contents displayed

**If Error:**
- Backend API not running
- File system service issue
- Check browser console

---

### **Step 4: Test Molting System**

Type:
```
Test molting system
```

**Expected:**
```
🧪 Molting System Test Results:

✅ File system access: Working
✅ Ollama connection: Working (X models available)
✅ Self file exists: components/DevChatbot.tsx
```

**If Ollama Fails:**
- Start Ollama: `ollama serve`
- Install model: `ollama pull codellama:latest`

---

### **Step 5: Try Self-Modification**

Type:
```
Edit yourself to add a comment at the top saying "Updated via molting"
```

**Expected:**
1. 🐍 "Growing new body..." message
2. 🧬 AI generates new code
3. ✅ Validation check
4. 🔄 "Bodies swapped" message
5. 🎉 Auto-reload

**If Fails:**
- Check error message
- Verify Ollama is running
- Check file permissions

---

## 🔧 **Troubleshooting**

### **"Cannot connect to backend"**
- Dev server not running: `npm run dev`
- Check port: Should be on `http://localhost:3000` (or 3006, etc.)
- Check browser console for CORS errors

### **"Ollama connection: Failed"**
- Start Ollama: `ollama serve`
- Check: `curl http://localhost:11434/api/tags`
- Install model: `ollama pull codellama:latest`

### **"File system access: Failed"**
- Backend API not accessible
- Check `server.js` is running
- Check `/api/filesystem/read` endpoint

### **"Self file missing"**
- File path wrong
- Check `components/DevChatbot.tsx` exists
- Verify you're in project root

---

## ✅ **Success Indicators**

You'll know it's working when:
1. ✅ Dev Chat opens with `Ctrl+K`
2. ✅ "test" command returns "ONLINE"
3. ✅ "read package.json" shows file contents
4. ✅ "Test molting system" shows all green checkmarks
5. ✅ Self-modification triggers molting process

---

**Status:** Use these steps to verify everything works!

