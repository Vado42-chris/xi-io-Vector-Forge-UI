# Start Browser Validation - Quick Reference

**Date:** January 27, 2025  
**Purpose:** Execute comprehensive component validation

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start Server
```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run dev
```

**Wait for:** "Local: http://localhost:5173"

### Step 2: Open Browser
Navigate to: **http://localhost:5173**

### Step 3: Follow Test Guide
Open: **`docs/MANUAL_TESTING_GUIDE.md`**

---

## ✅ What to Test (Priority Order)

### 1. DevChatbot (5 min) - CRITICAL
**Location:** Right Sidebar → "Dev Chat" tab

**Test:**
1. Type message → See "💾 Saving..." → See "💾 Saved"
2. Click history button (📜) → Panel opens
3. Refresh page → Message persists

**Expected:**
- ✅ Save indicator appears
- ✅ History panel opens
- ✅ Messages persist

---

### 2. ConversationHistoryPanel (5 min) - CRITICAL
**Location:** Opens via history button

**Test:**
1. Panel opens with loading spinner
2. Conversations appear in list
3. Search works
4. Export downloads JSON

**Expected:**
- ✅ Loading spinner shows
- ✅ Conversations appear
- ✅ Search filters
- ✅ Export works

---

### 3. Template Library (5 min) - HIGH
**Location:** File Menu → "New from Template"

**Test:**
1. Templates load
2. Search filters templates
3. Click template → Preview shows
4. "Use Template" generates code

**Expected:**
- ✅ Templates appear
- ✅ Search works
- ✅ Preview shows
- ✅ Code generates

---

### 4. Design System (3 min) - HIGH
**Visual Check:**
- [ ] NO white borders
- [ ] Dark grey theme
- [ ] Orange accent only
- [ ] Selected states use backgrounds

**Expected:**
- ✅ No borders visible
- ✅ Colors correct
- ✅ Selected states correct

---

## 📊 Test Results

**Date:** _____________  
**Server Running:** [✅/❌]

### Results
- DevChatbot: [✅/❌] - [Notes]
- ConversationHistoryPanel: [✅/❌] - [Notes]
- TemplateLibrary: [✅/❌] - [Notes]
- Design System: [✅/❌] - [Notes]

### Issues
1. [Issue]
2. [Issue]

---

## 📚 Full Documentation

- **Detailed Checklist:** `docs/COMPONENT_VALIDATION_CHECKLIST.md`
- **Test Matrix:** `docs/COMPONENT_TEST_MATRIX.md`
- **Manual Guide:** `docs/MANUAL_TESTING_GUIDE.md`
- **Test Plan:** `docs/BROWSER_VALIDATION_TEST_PLAN.md`

---

## 🎯 Success Criteria

**All tests pass if:**
1. ✅ DevChatbot save indicator works
2. ✅ History panel opens and shows conversations
3. ✅ Templates load and generate
4. ✅ No console errors
5. ✅ Design system compliant

---

**Ready to test! Start with Step 1 above.**

