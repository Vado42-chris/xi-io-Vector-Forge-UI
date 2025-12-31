# Functional First Plan - Templates Priority
**Token Budget: 85% used, 15% remaining**

## 🎯 Core Principle: Function First

**User's Directive:** "Usability is not just about a pretty UI. Function first, make the components work. Make the templates work. Templates are priority right now."

---

## ✅ What Templates Exist

### 1. **Template Components** (Shared Templates)
- ✅ `components/shared/templates/Button.tsx` - Unified button
- ✅ `components/shared/templates/Input.tsx` - Unified input
- ✅ `components/shared/templates/Panel.tsx` - Unified panel

### 2. **Template Library** (Project Templates)
- ✅ `components/TemplateLibrary.tsx` - Template browser
- ✅ `services/templateService.ts` - Template service
- ✅ File → New from Template (handler exists)

### 3. **Template Frame System**
- ✅ `services/templateFrameService.ts` - Frame management
- ✅ `components/TemplateFrameContainer.tsx` - Frame rendering

---

## ❌ What's NOT Working

### 1. **Templates Not Being Used** 🔴 CRITICAL
**Problem:** Template components exist but aren't used
- Button template exists but components use custom buttons
- Input template exists but components use custom inputs
- Panel template exists but components use custom panels

**Impact:** Code duplication, inconsistent behavior, maintenance burden

### 2. **Template Library May Not Work** 🔴 CRITICAL
**Problem:** TemplateLibrary component exists but functionality unclear
- Opens when File → New from Template clicked
- But: Does it actually load templates?
- But: Does it actually create projects from templates?

**Impact:** Feature exists but may not be functional

### 3. **Template Service May Not Work** 🟡 HIGH
**Problem:** TemplateService exists but may not be connected
- Service has `loadTemplates()` method
- But: Are templates actually loaded?
- But: Are templates actually used?

**Impact:** Template system may be decorative

---

## 🎯 Priority: Templates First

### Phase 1: Make Templates Work (2-3 hours) 🔴 CRITICAL

#### 1.1 Verify Template Library Works (30 min)
**Files:**
- `components/TemplateLibrary.tsx`
- `services/templateService.ts`
- `App.hardened.tsx` (handler)

**Tasks:**
1. Test: File → New from Template opens library
2. Test: Templates actually load
3. Test: Clicking template creates project
4. Fix: Any broken functionality

#### 1.2 Make Template Components Functional (1.5 hours)
**Files:**
- `components/shared/templates/Button.tsx`
- `components/shared/templates/Input.tsx`
- `components/shared/templates/Panel.tsx`

**Tasks:**
1. Verify templates have all needed props
2. Verify templates handle all states (loading, disabled, active)
3. Test templates in isolation
4. Fix any broken functionality

#### 1.3 Start Using Templates (1 hour)
**Files:**
- Replace custom buttons with Button template
- Replace custom inputs with Input template
- Replace custom panels with Panel template

**Priority Components:**
1. `RightSidebar.tsx` - Use Input template for properties
2. `ToolPropertiesPanel.tsx` - Use Input template
3. `PowerUserToolbar.tsx` - Use Button template
4. `ProfessionalFileMenu.tsx` - Already uses Button (verify)

---

## 🔧 Functional Testing Plan

### Test Template Library
1. **Open:** File → New from Template
2. **Verify:** TemplateLibrary opens
3. **Verify:** Templates are listed
4. **Verify:** Can click template
5. **Verify:** Template creates project
6. **Verify:** Project opens correctly

### Test Template Components
1. **Button Template:**
   - Test: All variants render
   - Test: All states work (hover, active, disabled, loading)
   - Test: onClick works
   - Test: Keyboard navigation works

2. **Input Template:**
   - Test: All types render
   - Test: Validation works
   - Test: onChange works
   - Test: Focus states work

3. **Panel Template:**
   - Test: All variants render
   - Test: Collapsible works
   - Test: Content renders correctly

---

## 📊 REAPER Space & Our Maths

### REAPER Space (Found in Docs)
**Status:** Documented but not implemented
- Fractal structure formula: `S_fractal = PHI^depth × β × r²`
- Chaos component: `H_chaos = initial_disorder`
- **Use Case:** User testing simulation, spatial organization

**Recommendation:** Not priority for templates. Focus on templates first.

### Our Maths (Coordinate System)
**Status:** ✅ IMPLEMENTED
- `lib/ourmaths/CoordinateFrame.ts` - Coordinate frames
- `lib/ourmaths/Vector2.ts` - Vector math
- `lib/ourmaths/Matrix3.ts` - Matrix math
- `utils/coordinateConverter.ts` - Canvas coordinate conversion

**Current Usage:**
- ✅ Used in `DraftsmanCanvas.tsx` for coordinate conversion
- ✅ `screenToWorld()` function works
- ✅ Coordinate frames defined (WORLD, VIEWPORT, CANVAS, LOCAL)

**Recommendation:** Already working. Can help with template positioning if needed.

---

## 🚀 Implementation Plan (Function First)

### Step 1: Test Template Library (30 min)
1. Open app
2. Click File → New from Template
3. Verify library opens
4. Verify templates load
5. Test creating project from template
6. Fix any broken functionality

### Step 2: Test Template Components (1 hour)
1. Test Button template in isolation
2. Test Input template in isolation
3. Test Panel template in isolation
4. Fix any broken functionality
5. Verify all states work

### Step 3: Start Using Templates (1.5 hours)
1. Replace buttons in RightSidebar
2. Replace inputs in ToolPropertiesPanel
3. Replace panels where appropriate
4. Test functionality after replacement
5. Fix any regressions

---

## ✅ Success Criteria

### Template Library
- [ ] File → New from Template opens library
- [ ] Templates are listed
- [ ] Can select template
- [ ] Template creates project
- [ ] Project opens correctly

### Template Components
- [ ] Button template works (all variants, all states)
- [ ] Input template works (all types, validation)
- [ ] Panel template works (all variants, collapsible)
- [ ] Templates are being used in components

### Functional Testing
- [ ] All replaced components still work
- [ ] No regressions
- [ ] Consistent behavior
- [ ] Better maintainability

---

## 📋 Component Replacement Priority

### High Priority (Use Templates)
1. **RightSidebar** - Use Input template for properties
2. **ToolPropertiesPanel** - Use Input template
3. **PowerUserToolbar** - Use Button template
4. **ProfessionalFileMenu** - Verify Button template usage

### Medium Priority
5. **LeftSidebar** - Already uses Button (verify)
6. **InspectorPanel** - Use Input template
7. **LayersPanel** - Use Panel template

### Low Priority
8. Other components as needed

---

## ⏱️ Time Estimates

### Phase 1: Make Templates Work (2-3 hours)
- Test Template Library: 30 min
- Test Template Components: 1 hour
- Start Using Templates: 1.5 hours

**Total:** 2.5-3 hours

### Phase 2: Full Template Adoption (4-6 hours)
- Replace all buttons: 2 hours
- Replace all inputs: 2 hours
- Replace all panels: 2 hours

**Total:** 6 hours (can be done incrementally)

---

## 🎯 Recommended Action (With 15% Tokens)

### Option A: Quick Template Fix (2-3 hours) ⚡ RECOMMENDED
**Focus:** Make templates functional
1. Test Template Library (30 min)
2. Test Template Components (1 hour)
3. Start using in 2-3 components (1.5 hours)

**Result:** Templates work and are being used

### Option B: Full Template Adoption (6-8 hours)
**Focus:** Complete template migration
1. All of Option A
2. Replace all buttons (2 hours)
3. Replace all inputs (2 hours)
4. Replace all panels (2 hours)

**Result:** Complete template system

---

**Status:** Ready to implement. Start with testing Template Library and Template Components.

**Next Step:** Test Template Library functionality first.

