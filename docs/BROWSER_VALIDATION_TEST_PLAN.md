# Browser Validation Test Plan

**Date:** January 27, 2025  
**Goal:** Extensive validation of components and templates in browser

---

## 🎯 Test Batches

### Batch 1: Core UI Components (Priority 1)
**Time:** 15 minutes

#### 1.1 DevChatbot Component
- [ ] **Visual Check:**
  - [ ] Component renders in Right Sidebar → "Dev Chat" tab
  - [ ] Header shows "💬 Dev Chat" and "Independent • Works Offline"
  - [ ] History button (📜 icon) visible in header
  - [ ] Message area scrollable
  - [ ] Input field at bottom
  - [ ] Send button visible

- [ ] **Functionality:**
  - [ ] Type message → See "💾 Saving..." indicator
  - [ ] After save → See "💾 Saved" indicator (green, fades after 2s)
  - [ ] Click history button → ConversationHistoryPanel opens
  - [ ] Messages persist after refresh
  - [ ] System message shows on load

- [ ] **Error States:**
  - [ ] Empty input → Send button disabled
  - [ ] Save error → See "⚠️ Save failed" indicator

---

#### 1.2 ConversationHistoryPanel Component
- [ ] **Visual Check:**
  - [ ] Modal opens when history button clicked
  - [ ] Header shows "Conversation History" with icon
  - [ ] Conversation count visible (e.g., "3 conversations total")
  - [ ] Search bar visible
  - [ ] Platform filter dropdown visible
  - [ ] Tag filter dropdown visible
  - [ ] Close button (X) visible

- [ ] **Functionality:**
  - [ ] Loading spinner shows while loading
  - [ ] Conversations appear in list
  - [ ] Each conversation shows:
    - [ ] Title
    - [ ] Platform badge
    - [ ] Summary (if available)
    - [ ] Message count
    - [ ] Date
    - [ ] Tags
    - [ ] Export button
    - [ ] Delete button
  - [ ] Search filters conversations
  - [ ] Platform filter works
  - [ ] Tag filter works
  - [ ] Export downloads JSON file
  - [ ] Delete removes conversation
  - [ ] Empty state shows helpful message

- [ ] **Error States:**
  - [ ] No conversations → Shows empty state
  - [ ] Search no results → Shows "No conversations found"
  - [ ] Loading error → Shows error message

---

### Batch 2: Template System (Priority 2)
**Time:** 15 minutes

#### 2.1 TemplateLibrary Component
- [ ] **Visual Check:**
  - [ ] Opens via File Menu → "New from Template"
  - [ ] Modal panel renders
  - [ ] Template cards visible
  - [ ] Search bar visible
  - [ ] Category filters visible
  - [ ] Preview area visible

- [ ] **Functionality:**
  - [ ] Templates load from service
  - [ ] Default templates show if none loaded
  - [ ] Search filters templates
  - [ ] Category filter works
  - [ ] Click template → Shows preview
  - [ ] Variables form shows if template has variables
  - [ ] "Use Template" button works
  - [ ] Template code generates correctly

- [ ] **Seed System (Backend):**
  - [ ] Template saves → Seed created (check localStorage)
  - [ ] Template loads from seed (faster)
  - [ ] Seed integrity verified (hash check)

---

#### 2.2 Template Components
- [ ] **Service Base Template:**
  - [ ] Code generates correctly
  - [ ] Variables substituted
  - [ ] File created in correct location

- [ ] **React Component Template:**
  - [ ] Code generates correctly
  - [ ] ErrorBoundary included
  - [ ] TypeScript types correct

- [ ] **API Route Template:**
  - [ ] Code generates correctly
  - [ ] Express router included
  - [ ] Error handling included

---

### Batch 3: File System Components (Priority 3)
**Time:** 10 minutes

#### 3.1 FileBrowser Component
- [ ] **Visual Check:**
  - [ ] Renders in Right Sidebar → "Files" tab
  - [ ] Directory tree visible
  - [ ] File list visible
  - [ ] Search bar visible
  - [ ] File content area visible

- [ ] **Functionality:**
  - [ ] Navigate directories
  - [ ] Click file → Shows content
  - [ ] Edit file → Saves changes
  - [ ] Create file → Works
  - [ ] Delete file → Works
  - [ ] Search files → Works

---

#### 3.2 Terminal Component
- [ ] **Visual Check:**
  - [ ] Renders in Right Sidebar → "Terminal" tab
  - [ ] Command input visible
  - [ ] Output area visible
  - [ ] Command history visible

- [ ] **Functionality:**
  - [ ] Execute command → Shows output
  - [ ] Error handling works
  - [ ] Command history works
  - [ ] Clear output works

---

### Batch 4: UI Automation Components (Priority 4)
**Time:** 20 minutes

#### 4.1 ProjectWizard
- [ ] Opens via Action Center or keyboard shortcut
- [ ] Steps render correctly
- [ ] Navigation works
- [ ] Form validation works
- [ ] Project creation works

#### 4.2 BatchOperationsPanel
- [ ] Opens via Action Center
- [ ] Operation selection works
- [ ] File selection works
- [ ] Batch processing works
- [ ] Progress indicator shows

#### 4.3 SchemaBuilder
- [ ] Opens via Action Center
- [ ] Schema editor works
- [ ] Export works
- [ ] Validation works

#### 4.4 TestGeneratorPanel
- [ ] Opens via Action Center
- [ ] Test generation works
- [ ] Progress indicator shows
- [ ] Tests created correctly

#### 4.5 GuidedWorkflowPanel
- [ ] Opens via Action Center
- [ ] Steps render correctly
- [ ] Progress tracking works
- [ ] Navigation works

---

### Batch 5: Design System Validation (Priority 5)
**Time:** 15 minutes

#### 5.1 Xibalba Design System
- [ ] **No Borders:**
  - [ ] No white borders visible
  - [ ] No border-white classes
  - [ ] Subtle background differences instead

- [ ] **Colors:**
  - [ ] Dark grey-on-grey theme
  - [ ] Orange accent only (#ff9800)
  - [ ] No white backgrounds
  - [ ] Text readable on backgrounds

- [ ] **Selected States:**
  - [ ] Background colors, not borders
  - [ ] Subtle glow effect
  - [ ] Orange tint for selected

- [ ] **Material Icons:**
  - [ ] Icons render correctly
  - [ ] No text visible (data-icon attribute)
  - [ ] Proper sizing

---

#### 5.2 Z-Stack System
- [ ] **Layering:**
  - [ ] Modals above content
  - [ ] Dropdowns above panels
  - [ ] Tooltips above everything
  - [ ] No z-index conflicts

---

### Batch 6: Error Handling (Priority 6)
**Time:** 10 minutes

#### 6.1 ErrorBoundary
- [ ] Component errors caught
- [ ] Error message displayed
- [ ] Recovery options shown

#### 6.2 Error States
- [ ] Network errors handled
- [ ] File system errors handled
- [ ] Service errors handled
- [ ] User-friendly error messages

---

## 📊 Test Execution Plan

### Phase 1: Quick Smoke Tests (5 min)
1. Navigate to app
2. Check main UI loads
3. Check no console errors
4. Check key components render

### Phase 2: Component Deep Dive (60 min)
1. Batch 1: Core UI (15 min)
2. Batch 2: Templates (15 min)
3. Batch 3: File System (10 min)
4. Batch 4: UI Automation (20 min)

### Phase 3: Design System (15 min)
1. Batch 5: Design System Validation

### Phase 4: Error Handling (10 min)
1. Batch 6: Error Handling

---

## 🐛 Bug Tracking

### Critical (Blocks Usage)
- [ ] Component doesn't render
- [ ] Feature completely broken
- [ ] Data loss

### High (Major UX Issue)
- [ ] Feature partially broken
- [ ] Visual glitches
- [ ] Performance issues

### Medium (Minor Issues)
- [ ] Styling inconsistencies
- [ ] Minor bugs
- [ ] Edge cases

### Low (Polish)
- [ ] Text typos
- [ ] Minor styling tweaks
- [ ] Accessibility improvements

---

## ✅ Success Criteria

**All tests pass if:**
1. ✅ All components render
2. ✅ All functionality works
3. ✅ No console errors
4. ✅ Design system consistent
5. ✅ Error handling works
6. ✅ Performance acceptable

---

## 📝 Test Results Template

```markdown
## Test Results - [Date]

### Batch 1: Core UI Components
- DevChatbot: ✅/❌
- ConversationHistoryPanel: ✅/❌

### Batch 2: Template System
- TemplateLibrary: ✅/❌
- Template Components: ✅/❌

### Batch 3: File System
- FileBrowser: ✅/❌
- Terminal: ✅/❌

### Batch 4: UI Automation
- ProjectWizard: ✅/❌
- BatchOperationsPanel: ✅/❌
- SchemaBuilder: ✅/❌
- TestGeneratorPanel: ✅/❌
- GuidedWorkflowPanel: ✅/❌

### Batch 5: Design System
- Xibalba Design: ✅/❌
- Z-Stack: ✅/❌

### Batch 6: Error Handling
- ErrorBoundary: ✅/❌
- Error States: ✅/❌

### Issues Found:
1. [Issue description]
2. [Issue description]

### Next Steps:
1. [Action item]
2. [Action item]
```

---

**Ready to execute tests in browser.**

