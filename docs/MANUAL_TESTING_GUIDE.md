# Manual Testing Guide - VectorForge Components

**Quick Start:** Follow this guide to validate all components

---

## 🚀 Quick Start

1. Start dev server: `npm run dev`
2. Open browser: `http://localhost:5173`
3. Open DevTools: `F12` (watch for console errors)
4. Follow test sequence below

---

## 📋 Test Sequence

### TEST 1: DevChatbot (5 min)
1. Right Sidebar → "Dev Chat" tab
2. **Check:** Header shows "💬 Dev Chat" + history button (📜)
3. **Type message:** "Test message"
4. **Look for:** "💾 Saving..." → "💾 Saved" (green, fades)
5. **Click history button** → Panel opens
6. **Refresh page** → Message persists

**Result:** [✅/❌] - [Notes]

---

### TEST 2: ConversationHistoryPanel (5 min)
1. Open via history button in DevChatbot
2. **Check:** Header shows count, search bar, filters
3. **Check:** Your conversation appears in list
4. **Test search:** Type "test" → Filters conversations
5. **Test export:** Click export → Downloads JSON
6. **Test filters:** Platform/Tag dropdowns work

**Result:** [✅/❌] - [Notes]

---

### TEST 3: Template Library (5 min)
1. File Menu → "New from Template"
2. **Check:** Templates appear in grid
3. **Test search:** Filters templates
4. **Click template:** Preview shows
5. **Click "Use Template":** Code generates

**Result:** [✅/❌] - [Notes]

---

### TEST 4: Design System (3 min)
- [ ] NO white borders
- [ ] Dark grey theme
- [ ] Orange accent only
- [ ] Selected states use backgrounds (not borders)
- [ ] Material icons render (no text)

**Result:** [✅/❌] - [Notes]

---

## 📊 Results Template

**Date:** _____________  
**Tester:** _____________

### Components
- DevChatbot: [✅/❌]
- ConversationHistoryPanel: [✅/❌]
- TemplateLibrary: [✅/❌]
- Design System: [✅/❌]

### Issues Found
1. [Issue]
2. [Issue]

---

**Ready for testing!**

