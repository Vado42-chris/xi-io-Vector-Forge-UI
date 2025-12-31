# Manual Testing Guide - VectorForge Components

**Date:** January 27, 2025  
**Quick Start:** Follow this guide step-by-step to validate all components

---

## 🚀 Quick Start

### 1. Start Dev Server
```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run dev
```

### 2. Open Browser
Navigate to: `http://localhost:5173`

### 3. Open Browser Console
Press `F12` or `Ctrl+Shift+I` to open DevTools
- Watch for console errors
- Check Network tab for failed requests

---

## 📋 Test Sequence (Follow in Order)

### TEST 1: DevChatbot Component (5 minutes)

#### Step 1: Navigate to DevChatbot
1. Look at Right Sidebar (right side of screen)
2. Find "Dev Chat" tab (should be in secondary tabs section)
3. Click "Dev Chat" tab
4. **Expected:** DevChatbot interface appears

#### Step 2: Visual Check
- [ ] Header shows "💬 Dev Chat"
- [ ] Subtitle shows "Independent • Works Offline"
- [ ] History button (📜 icon) visible in header
- [ ] System message visible (welcome message)
- [ ] Input field at bottom
- [ ] Send button visible

#### Step 3: Test Save Indicator
1. Type a message: "Test message 1"
2. Press Enter or click Send
3. **LOOK FOR:** "💾 Saving..." appears in header
4. Wait 1-2 seconds
5. **LOOK FOR:** "💾 Saved" appears (should be green/orange)
6. Wait 2 more seconds
7. **LOOK FOR:** "💾 Saved" fades away

#### Step 4: Test History Button
1. Click history button (📜 icon) in header
2. **Expected:** ConversationHistoryPanel modal opens
3. **LOOK FOR:** Your conversation appears in list
4. Close panel (click X or outside)

#### Step 5: Test Persistence
1. Refresh page (F5)
2. Open DevChatbot again
3. **Expected:** Your previous message still there

**Result:** [✅ PASS / ❌ FAIL] - [Notes]

---

### TEST 2: ConversationHistoryPanel (5 minutes)

#### Step 1: Open History Panel
1. In DevChatbot, click history button (📜)
2. **Expected:** Modal panel opens

#### Step 2: Visual Check
- [ ] Header shows "Conversation History" with icon
- [ ] Conversation count visible (e.g., "1 conversation total")
- [ ] Search bar visible
- [ ] Platform filter dropdown visible
- [ ] Tag filter dropdown visible
- [ ] Close button (X) visible

#### Step 3: Check Conversation List
- [ ] Your conversation appears in list
- [ ] Shows title (first message or auto-generated)
- [ ] Shows platform badge ("devchat")
- [ ] Shows message count
- [ ] Shows date
- [ ] Export button visible
- [ ] Delete button visible

#### Step 4: Test Search
1. Type "test" in search bar
2. **Expected:** Conversation filters (if matches)
3. Clear search
4. **Expected:** All conversations show

#### Step 5: Test Filters
1. Select "devchat" from platform filter
2. **Expected:** Only devchat conversations show
3. Select "all" from platform filter
4. **Expected:** All conversations show

#### Step 6: Test Export
1. Click Export button on a conversation
2. **Expected:** JSON file downloads
3. Open downloaded file
4. **Expected:** Valid JSON with conversation data

#### Step 7: Test Empty State
1. Delete all conversations (if possible)
2. **Expected:** Shows "Start chatting..." message

**Result:** [✅ PASS / ❌ FAIL] - [Notes]

---

### TEST 3: Template Library (5 minutes)

#### Step 1: Open Template Library
1. Click File Menu (top left)
2. Click "New from Template" or "New Template"
3. **Expected:** TemplateLibrary modal opens

#### Step 2: Visual Check
- [ ] Template cards visible in grid
- [ ] Search bar visible
- [ ] Category filters visible
- [ ] Preview area visible (if template selected)

#### Step 3: Test Template Loading
- [ ] Templates appear in list
- [ ] Default templates show (Service Base, React Component, etc.)
- [ ] Each template shows:
  - [ ] Name
  - [ ] Description
  - [ ] Category
  - [ ] Icon
  - [ ] Tags

#### Step 4: Test Search
1. Type "service" in search
2. **Expected:** Service-related templates filter
3. Clear search
4. **Expected:** All templates show

#### Step 5: Test Template Selection
1. Click a template card
2. **Expected:** Preview shows in side panel
3. **Expected:** Template code visible
4. **Expected:** "Use Template" button visible

#### Step 6: Test Template Generation
1. Click "Use Template" button
2. **Expected:** Template code generated
3. **Expected:** File created or code shown

**Result:** [✅ PASS / ❌ FAIL] - [Notes]

---

### TEST 4: File Browser (3 minutes)

#### Step 1: Navigate to File Browser
1. Right Sidebar → "Files" tab
2. **Expected:** FileBrowser component appears

#### Step 2: Visual Check
- [ ] Directory tree visible
- [ ] File list visible
- [ ] Search bar visible
- [ ] File content area visible

#### Step 3: Test Navigation
1. Click a directory
2. **Expected:** Directory expands/shows files
3. Click a file
4. **Expected:** File content shows

#### Step 4: Test File Operations
1. Try creating a file (if button available)
2. Try editing a file (if editable)
3. Try deleting a file (if button available)

**Result:** [✅ PASS / ❌ FAIL] - [Notes]

---

### TEST 5: Design System Compliance (5 minutes)

#### Step 1: Check for Borders
- [ ] NO white borders on buttons
- [ ] NO white borders on inputs
- [ ] NO white borders on panels
- [ ] Subtle background differences instead

#### Step 2: Check Colors
- [ ] Dark grey-on-grey theme throughout
- [ ] Orange accent (#ff9800) only
- [ ] NO white backgrounds
- [ ] Text readable on all backgrounds

#### Step 3: Check Selected States
- [ ] Selected items use background colors (not borders)
- [ ] Subtle glow effect visible
- [ ] Orange tint for selected items

#### Step 4: Check Material Icons
- [ ] Icons render correctly
- [ ] NO icon text visible (just icons)
- [ ] Proper sizing

**Result:** [✅ PASS / ❌ FAIL] - [Notes]

---

### TEST 6: Error Handling (3 minutes)

#### Step 1: Test ErrorBoundary
1. Look for any error messages
2. **Expected:** No uncaught errors in console
3. **Expected:** User-friendly error messages if errors occur

#### Step 2: Test Error States
1. Disconnect network (if possible)
2. Try saving conversation
3. **Expected:** Error message shows
4. **Expected:** "⚠️ Save failed" indicator appears

**Result:** [✅ PASS / ❌ FAIL] - [Notes]

---

## 📊 Test Results Summary

### Components Tested
- [ ] DevChatbot
- [ ] ConversationHistoryPanel
- [ ] TemplateLibrary
- [ ] FileBrowser
- [ ] Design System
- [ ] Error Handling

### Overall Status
- **Passing:** [Count]
- **Failing:** [Count]
- **Blocked:** [Count]

### Critical Issues
1. [Issue]
2. [Issue]

### Next Steps
1. [Action]
2. [Action]

---

## 🐛 Common Issues & Fixes

### Issue: DevChatbot doesn't show save indicator
**Check:**
- Console for errors
- `saveStatus` state in component
- `conversationHistoryService` import

### Issue: History panel doesn't open
**Check:**
- Button click handler
- `onShowHistory` prop passed correctly
- Modal z-index

### Issue: Conversations don't appear
**Check:**
- localStorage for `vectorforge-conversations`
- `conversationHistoryService.getAllConversations()`
- Console for errors

### Issue: Design system violations
**Check:**
- `xibalba-no-borders.css` loaded
- No inline styles
- CSS variables used

---

**Ready for manual testing!**

