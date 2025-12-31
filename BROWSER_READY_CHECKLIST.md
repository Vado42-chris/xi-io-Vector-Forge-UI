# Browser Ready Checklist
**Status:** ✅ Code Ready - Need Manual Steps

---

## ✅ What's Ready

1. **Setup Script:** `setup-local-ai.sh` - Sets up Ollama
2. **Dev Server Script:** `START_DEV_AND_VERIFY.sh` - Starts server
3. **Configuration:** Code defaults to local Ollama
4. **Auto-detection:** VectorForge auto-detects Ollama

---

## 🔴 What You Need to Do

### Terminal 1: Setup Local AI (if needed)
```bash
./setup-local-ai.sh
```

### Terminal 2: Start Dev Server
```bash
npm run dev
```

### Browser:
1. Open: `http://localhost:3000`
2. Left Sidebar → Engine tab
3. Configure Local AI (see MANUAL_VERIFICATION_STEPS.md)

---

## 🎯 End Goal

**See VectorForge running in browser with local AI configured.**

**Full steps:** See `MANUAL_VERIFICATION_STEPS.md`

