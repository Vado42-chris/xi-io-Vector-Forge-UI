# 🐍 Molting System - Troubleshooting Guide

## ✅ **System Status Check**

### **Quick Test Command:**
In Dev Chat, type: `"Test molting system"`

This will check:
- ✅ File system access
- ✅ Ollama connection
- ✅ Self file exists

---

## 🔧 **Common Issues & Fixes**

### **Issue 1: "AI Not Available" or "Cannot connect to Ollama"**

**Problem:** Ollama isn't running or not accessible

**Fix:**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running, start it:
ollama serve

# If not installed:
curl -fsSL https://ollama.com/install.sh | sh
ollama pull codellama:latest
```

**Verify:**
- Open Dev Chat
- Type: `"Test molting system"`
- Should see: "✅ Ollama connection: Working"

---

### **Issue 2: "Cannot read self" or "Self file missing"**

**Problem:** File path is wrong or file doesn't exist

**Fix:**
- Check that `components/DevChatbot.tsx` exists
- Verify you're in the project root directory
- Check file permissions

**Verify:**
```bash
ls -la components/DevChatbot.tsx
```

---

### **Issue 3: "File system access: Failed"**

**Problem:** Backend API not running or file system service broken

**Fix:**
1. Make sure dev server is running: `npm run dev`
2. Check backend is accessible: `curl http://localhost:3000/api/filesystem/stats?path=package.json`
3. Check browser console for errors

**Verify:**
- Open Dev Chat
- Type: `"read package.json"`
- Should read the file

---

### **Issue 4: "Molting Failed" or "Validation failed"**

**Problem:** Generated code has syntax errors

**Fix:**
1. Try a simpler request
2. Be more specific about what to change
3. Use manual editing instead: `"write components/DevChatbot.tsx with content: ..."`

**Example:**
Instead of: `"Edit yourself to add everything"`
Try: `"Edit yourself to add a comment at the top saying 'Updated via molting'"`

---

### **Issue 5: "Ctrl+K doesn't open Dev Chat"**

**Problem:** Keyboard shortcut not working

**Fix:**
1. Check if Right Sidebar is visible
2. Try clicking the "Dev Chat" tab manually
3. Check browser console for errors
4. Make sure you're not in an input field

**Verify:**
- Press `Ctrl+K` (or `Cmd+K` on Mac)
- Should switch to "Dev Chat" tab in Right Sidebar

---

## 🧪 **Step-by-Step Verification**

### **Step 1: Verify File System**
```
In Dev Chat:
"read package.json"
```
**Expected:** File contents displayed

### **Step 2: Verify Ollama**
```
In Dev Chat:
"Test molting system"
```
**Expected:** "✅ Ollama connection: Working"

### **Step 3: Test Self-Modification**
```
In Dev Chat:
"Edit yourself to add a comment at the top"
```
**Expected:** Molting process starts, new body created, swap happens

---

## 🚨 **Emergency Fallback**

If molting doesn't work, you can still edit manually:

```
"read components/DevChatbot.tsx"
```
(Copy the code, edit it, then:)
```
"write components/DevChatbot.tsx with content: [paste edited code]"
```

---

## 📋 **Checklist**

Before using self-modification:
- [ ] Dev server running (`npm run dev`)
- [ ] Ollama running (`ollama serve`)
- [ ] Code model installed (`ollama pull codellama:latest`)
- [ ] File system accessible (test with "read package.json")
- [ ] Right Sidebar visible
- [ ] Dev Chat tab accessible

---

## 🐛 **Debug Mode**

To see detailed errors:
1. Open browser DevTools (F12)
2. Check Console tab
3. Try self-modification
4. Look for error messages

Common errors:
- `Failed to fetch` → Backend not running
- `Cannot connect to Ollama` → Ollama not running
- `Path outside project directory` → File path issue
- `Validation failed` → Generated code has errors

---

**Status:** Use "Test molting system" command to diagnose issues quickly.

