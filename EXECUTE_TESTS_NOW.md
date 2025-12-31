# Execute Browser Validation Tests - Action Plan

**Date:** January 27, 2025  
**Status:** Ready to Execute

---

## 🎯 3-Step Execution Plan

### Step 1: Start Server (2 minutes)
```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run dev
```

**Wait for:**
```
➜  Local:   http://localhost:3000/
```

**Keep terminal open!**

---

### Step 2: Open Browser (30 seconds)
1. Open browser
2. Navigate to: **http://localhost:3000**
3. **DO NOT use port 5173** - that's wrong!

**Expected:**
- VectorForge UI loads
- Dark grey theme
- File menu at top
- No connection errors

---

### Step 3: Execute Tests (18 minutes)

#### Test 1: DevChatbot Save Indicator (5 min)
1. **Navigate:** Right Sidebar → "Dev Chat" tab
2. **Type:** "Test message 1"
3. **Press Enter** or click Send
4. **LOOK FOR:**
   - "💾 Saving..." appears in header
   - After 1-2 seconds: "💾 Saved" appears (green/orange)
   - After 2 more seconds: Indicator fades
5. **Click history button** (📜 icon in header)
6. **Expected:** ConversationHistoryPanel opens

**Result:** [✅ PASS / ❌ FAIL] - [Notes: _______________]

---

#### Test 2: ConversationHistoryPanel (5 min)
1. **Panel should be open** from Test 1
2. **LOOK FOR:**
   - Loading spinner (brief)
   - Conversation count in header (e.g., "1 conversation total")
   - Your conversation in list
3. **Test Search:**
   - Type "test" in search bar
   - **Expected:** Conversation filters
4. **Test Export:**
   - Click Export button
   - **Expected:** JSON file downloads
5. **Close panel** (click X)

**Result:** [✅ PASS / ❌ FAIL] - [Notes: _______________]

---

#### Test 3: Template Library (5 min)
1. **Navigate:** File Menu (top) → "New from Template"
2. **LOOK FOR:**
   - TemplateLibrary modal opens
   - Templates appear in grid
3. **Test Search:**
   - Type "service" in search
   - **Expected:** Service templates filter
4. **Test Selection:**
   - Click a template card
   - **Expected:** Preview shows in side panel
5. **Test Generation:**
   - Click "Use Template" button
   - **Expected:** Code generates

**Result:** [✅ PASS / ❌ FAIL] - [Notes: _______________]

---

#### Test 4: Design System (3 min)
**Visual Check:**
- [ ] NO white borders on buttons
- [ ] NO white borders on inputs
- [ ] Dark grey theme throughout
- [ ] Orange accent (#ff9800) only
- [ ] Selected states use background colors (not borders)
- [ ] Material icons render (no text visible)

**Result:** [✅ PASS / ❌ FAIL] - [Notes: _______________]

---

## 📊 Test Results Summary

**Date:** _____________  
**Tester:** _____________  
**Server Port:** 3000 (correct) / 5173 (wrong)

### Component Tests
- DevChatbot: [✅/❌] - [Notes: _______________]
- ConversationHistoryPanel: [✅/❌] - [Notes: _______________]
- TemplateLibrary: [✅/❌] - [Notes: _______________]
- Design System: [✅/❌] - [Notes: _______________]

### Issues Found
1. [Issue: _______________]
2. [Issue: _______________]

### Next Steps
1. [Action: _______________]
2. [Action: _______________]

---

## 🐛 If Tests Fail

### DevChatbot Issues
- **Save indicator doesn't show:**
  - Check browser console (F12) for errors
  - Verify `conversationHistoryService` import
  - Check `saveStatus` state

- **History button doesn't work:**
  - Check `onShowHistory` prop passed correctly
  - Verify button click handler
  - Check modal z-index

### ConversationHistoryPanel Issues
- **Panel doesn't open:**
  - Check `isOpen` state
  - Verify modal rendering
  - Check z-index

- **Conversations don't appear:**
  - Check localStorage: `vectorforge-conversations`
  - Verify `conversationHistoryService.getAllConversations()`
  - Check console for errors

### Template Library Issues
- **Templates don't load:**
  - Check `templateService.loadTemplates()`
  - Verify seed system
  - Check console for errors

---

## ✅ Success Indicators

**All tests pass if:**
1. ✅ DevChatbot shows save indicator
2. ✅ History panel opens and shows conversations
3. ✅ Templates load and generate
4. ✅ No console errors
5. ✅ Design system compliant

---

## 📚 Full Documentation

- **Quick Start:** `START_VALIDATION.md`
- **Port Info:** `CORRECT_PORT.md`
- **Troubleshooting:** `FIX_CONNECTION_REFUSED.md`
- **Detailed Checklist:** `docs/COMPONENT_VALIDATION_CHECKLIST.md`
- **Manual Guide:** `docs/MANUAL_TESTING_GUIDE.md`

---

**Ready to execute! Start with Step 1 above.**

