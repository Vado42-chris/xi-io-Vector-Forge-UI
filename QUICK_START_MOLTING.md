# 🐍 Quick Start - Molting System

## ✅ **What's Built**

1. **MoltingService** - Complete biological molting cycle
2. **AICodeEditor** - AI code generation via Ollama
3. **DevChatbot** - Self-modification integrated
4. **UI Access** - `Ctrl+K` or Right Sidebar → "Dev Chat"

---

## 🚀 **Make It Work (3 Steps)**

### **Step 1: Start Ollama**
```bash
# Check if running
curl http://localhost:11434/api/tags

# If not, start it:
ollama serve

# If not installed:
curl -fsSL https://ollama.com/install.sh | sh
ollama pull codellama:latest
```

### **Step 2: Open Dev Chat**
- **Option A:** Press `Ctrl+K` (or `Cmd+K` on Mac)
- **Option B:** Right Sidebar → Click "Dev Chat" tab

### **Step 3: Test It**
Type in Dev Chat:
```
Test molting system
```

**Expected Output:**
```
🧪 Molting System Test Results:

✅ File system access: Working
✅ Ollama connection: Working (1 models available)
✅ Self file exists: components/DevChatbot.tsx
```

---

## 🎯 **Try Self-Modification**

Once test passes, try:
```
Edit yourself to add a comment at the top saying "Updated via molting"
```

**What Happens:**
1. 🐍 Grows new body (creates working copy)
2. 🧬 AI generates new code
3. ✅ Validates new body
4. 🔄 Swaps bodies (atomic swap)
5. 🎉 Reloads with new body

---

## ⚠️ **If Test Fails**

### **"File system access: Failed"**
- Make sure dev server is running: `npm run dev`
- Check backend API: `curl http://localhost:3000/api/filesystem/stats?path=package.json`

### **"Ollama connection: Failed"**
- Start Ollama: `ollama serve`
- Install model: `ollama pull codellama:latest`
- Check: `curl http://localhost:11434/api/tags`

### **"Self file missing"**
- Verify file exists: `ls components/DevChatbot.tsx`
- Check you're in project root

---

## 📋 **Quick Commands**

**In Dev Chat:**
- `"Test molting system"` - Check if everything works
- `"read package.json"` - Test file system
- `"Edit yourself to [request]"` - Self-modify
- `"read components/DevChatbot.tsx"` - See current code

---

**Status:** System is built. Use "Test molting system" to verify it works!

