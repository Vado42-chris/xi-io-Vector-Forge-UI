# Templates Priority Plan - Function First
**Token Budget: 85% used, 15% remaining**

## 🎯 Core Directive

**User's Priority:** "Function first, make the components work. Make the templates work. Templates are priority right now."

**Approach:** Build and plan and test visually as we go.

---

## ✅ What Templates Exist & Status

### 1. **Template Components** (Shared Templates)
- ✅ `Button.tsx` - EXISTS, USED in 2 components (LeftSidebar, ProfessionalFileMenu)
- ✅ `Input.tsx` - EXISTS, NOT USED (RightSidebar uses custom inputs)
- ✅ `Panel.tsx` - EXISTS, NOT USED (components use custom panels)

### 2. **Template Library** (Project Templates)
- ✅ `TemplateLibrary.tsx` - EXISTS, RENDERS
- ✅ `templateService.ts` - EXISTS, loads templates
- ✅ File → New from Template - HANDLER EXISTS
- ❓ **UNKNOWN:** Does it actually create projects from templates?

### 3. **Our Maths** (Coordinate System)
- ✅ `lib/ourmaths/CoordinateFrame.ts` - IMPLEMENTED
- ✅ `lib/ourmaths/Vector2.ts` - IMPLEMENTED
- ✅ `lib/ourmaths/Matrix3.ts` - IMPLEMENTED
- ✅ `utils/coordinateConverter.ts` - WORKING (used in DraftsmanCanvas)
- **Status:** Already functional, can help with template positioning

### 4. **REAPER Space** (User Testing Simulation)
- ⚠️ DOCUMENTED but NOT IMPLEMENTED
- Found in: `docs/HALLBERG_MATHS_COMPREHENSIVE_ANALYSIS_WITH_ORIGINAL.md`
- Formula: `S_fractal = PHI^depth × β × r²`
- **Status:** Not priority for templates. Focus on templates first.

---

## ❌ What's NOT Working (Templates)

### 1. **Input Template Not Used** 🔴 CRITICAL
**Problem:** Input template exists but components use custom inputs
- `RightSidebar.tsx` uses `xibalba-input-professional` class directly
- `ToolPropertiesPanel.tsx` uses custom inputs
- No consistency, harder to maintain

**Files to Fix:**
- `components/RightSidebar.tsx` - Replace 18+ custom inputs
- `components/ToolPropertiesPanel.tsx` - Replace custom inputs

### 2. **Panel Template Not Used** 🔴 CRITICAL
**Problem:** Panel template exists but components use custom panels
- Components create custom panel structures
- No consistency, harder to maintain

**Files to Fix:**
- Various panel components

### 3. **Template Library Functionality** 🟡 HIGH
**Problem:** TemplateLibrary renders but functionality unclear
- Opens when File → New from Template clicked
- Shows templates
- But: Does `onSelectTemplate` actually create project?
- But: Does it insert code into editor?

**Need to Test:**
- Click template → verify code is generated/inserted
- Verify template variables work
- Verify template creates file/project

---

## 🚀 Functional Testing Plan (Test Visually)

### Step 1: Test Template Library (15 min)
1. Open app in browser
2. Click File → New from Template
3. **Verify:** TemplateLibrary opens
4. **Verify:** Templates are listed (should see default templates)
5. **Verify:** Can search templates
6. **Verify:** Can filter by category
7. **Verify:** Can select template
8. **Verify:** Preview shows code
9. **Verify:** Click "Use This Template"
10. **Verify:** Code is generated/inserted (or file created)

**If Broken:** Fix immediately

### Step 2: Test Template Components (15 min)
1. **Button Template:**
   - Verify: Used in LeftSidebar (already done)
   - Verify: Used in ProfessionalFileMenu (already done)
   - Test: All variants work
   - Test: All states work (hover, active, disabled, loading)

2. **Input Template:**
   - Test: Render in isolation
   - Test: All types work (text, number, etc.)
   - Test: Validation works
   - Test: onChange works

3. **Panel Template:**
   - Test: Render in isolation
   - Test: Collapsible works
   - Test: All variants work

**If Broken:** Fix immediately

### Step 3: Start Using Templates (1 hour)
1. **Replace Inputs in RightSidebar:**
   - Find all `xibalba-input-professional` usages
   - Replace with `Input` template
   - Test: All inputs still work
   - Test: Values update correctly

2. **Replace Panels:**
   - Find panel patterns
   - Replace with `Panel` template
   - Test: Panels still work

**Test Visually:** After each replacement, test in browser

---

## 📋 Component Replacement Checklist

### RightSidebar - Use Input Template
**Current:** 18+ custom inputs using `xibalba-input-professional`
**Replace With:** `Input` template from `shared/templates/Input.tsx`

**Locations:**
1. Line 151: `type="number"` for X position
2. Line 165: `type="number"` for Y position
3. Line 179: `type="number"` for Border Radius
4. Line 264: `type="text"` for layer name
5. Line 312: `type="text"` for various inputs
6. Line 343: `type="text"` for various inputs
7. Line 360: `type="number"` for various inputs
8. Line 380: `type="number"` for various inputs
9. Line 544: `type="text"` for terminal input

**Test After Each:**
- Input renders correctly
- onChange works
- Value updates
- Validation works (if applicable)

---

## ⏱️ Time-Based Implementation Plan

### Phase 1: Test & Verify Templates Work (30 min) 🔴
**Goal:** Ensure templates are functional

1. **Test Template Library** (15 min)
   - Open in browser
   - Test all functionality
   - Fix any broken features

2. **Test Template Components** (15 min)
   - Test Button template
   - Test Input template
   - Test Panel template
   - Fix any broken features

### Phase 2: Start Using Templates (1.5 hours) 🔴
**Goal:** Replace custom implementations with templates

1. **Replace Inputs in RightSidebar** (1 hour)
   - Replace first 3 inputs (test)
   - Replace next 3 inputs (test)
   - Replace remaining inputs (test)
   - **Test visually after each batch**

2. **Replace Panels** (30 min)
   - Identify panel patterns
   - Replace with Panel template
   - **Test visually**

### Phase 3: Verify Everything Works (30 min) 🟢
**Goal:** Ensure no regressions

1. **Visual Testing** (15 min)
   - Test all replaced components
   - Test all workflows
   - Verify functionality

2. **Fix Issues** (15 min)
   - Fix any regressions
   - Improve as needed

**Total:** 2.5 hours

---

## 🎯 Most Efficient Fix (Quick Win)

### Replace First 3 Inputs in RightSidebar (20 min) ⚡
**Impact:** HIGH | **Effort:** LOW
1. Replace X position input (line 151)
2. Replace Y position input (line 165)
3. Replace Border Radius input (line 179)
4. Test visually in browser
5. Verify values update correctly

**Result:** Proof of concept, templates working

---

## 🎯 Most Important Fix (User Blocking)

### Make Template Library Functional (30 min) 🔴
**Impact:** CRITICAL | **Effort:** LOW
1. Test Template Library opens
2. Test templates load
3. Test template selection works
4. Test "Use This Template" creates/inserts code
5. Fix any broken functionality

**Result:** Template system is functional

---

## 🔧 Most Work (Complex)

### Full Template Adoption (4-6 hours)
**Impact:** HIGH | **Effort:** HIGH
1. Replace all inputs (2 hours)
2. Replace all panels (2 hours)
3. Replace all buttons (1 hour)
4. Test everything (1 hour)

**Result:** Complete template system

---

## 📊 REAPER Space & Our Maths

### REAPER Space
**Status:** Documented, not implemented
**Recommendation:** Not priority. Focus on templates first.

### Our Maths (Coordinate System)
**Status:** ✅ IMPLEMENTED and WORKING
**Current Usage:**
- Used in `DraftsmanCanvas.tsx` for coordinate conversion
- `screenToWorld()` function works
- Coordinate frames defined (WORLD, VIEWPORT, CANVAS, LOCAL)

**Can Help With:**
- Template positioning (if templates need spatial layout)
- Panel positioning (already working)
- Canvas coordinate conversion (already working)

**Recommendation:** Already functional. Use if needed for template positioning.

---

## ✅ Success Criteria

### Template Library
- [ ] File → New from Template opens library
- [ ] Templates are listed
- [ ] Can select template
- [ ] Preview shows code
- [ ] "Use This Template" works
- [ ] Code is generated/inserted

### Template Components
- [ ] Button template works (verified)
- [ ] Input template works (test)
- [ ] Panel template works (test)
- [ ] Templates are being used in components

### Functional Testing
- [ ] All replaced components still work
- [ ] No regressions
- [ ] Consistent behavior
- [ ] Better maintainability

---

## 🚀 Recommended Action (With 15% Tokens)

### Option A: Quick Template Fix (1 hour) ⚡ RECOMMENDED
**Focus:** Make templates functional
1. Test Template Library (15 min)
2. Test Template Components (15 min)
3. Replace first 3 inputs in RightSidebar (20 min)
4. Test visually (10 min)

**Result:** Templates work and are starting to be used

### Option B: Full Template Adoption (2.5 hours)
**Focus:** Complete template migration
1. All of Option A
2. Replace all inputs in RightSidebar (1 hour)
3. Replace panels (30 min)
4. Full testing (30 min)

**Result:** Complete template system

---

## 📝 Implementation Order

### Step 1: Test Template Library (15 min)
1. Open app
2. File → New from Template
3. Verify opens
4. Verify templates load
5. Test selection
6. Test "Use This Template"
7. Fix if broken

### Step 2: Test Template Components (15 min)
1. Test Input template
2. Test Panel template
3. Fix if broken

### Step 3: Start Using Templates (1 hour)
1. Replace first 3 inputs in RightSidebar
2. Test visually
3. Replace next batch
4. Test visually
5. Continue until all replaced

**Test Visually:** After each change, test in browser

---

**Status:** Ready to implement. Start with testing Template Library.

**Next Step:** Test Template Library functionality first, then start using Input template.

