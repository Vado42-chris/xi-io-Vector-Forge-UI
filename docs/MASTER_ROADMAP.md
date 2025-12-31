# Master Roadmap - Complete Error Resolution
**Date:** January 27, 2025  
**Status:** 🔴 ACTIVE - Sprint 3 In Progress

---

## BASELINE (VERIFIED)

**Total ESLint Errors:** 179
**App.hardened.tsx Errors:** 189 (errors only, no warnings)
**Build Status:** ✅ SUCCESS

---

## Full Stack Architecture

### Waterfall Phase 1: Planning ✅
- [x] Map all errors
- [x] Categorize by dependency
- [x] Create sprint plan
- [x] Establish baseline

### Agile Sprints: Execution 🔄

**Sprint 1: Foundation (Build-Breaking)**
- Status: ✅ COMPLETE
- Errors Fixed: 1 (parsing error line 1040)
- Result: 180 → 179 errors
- Proof: Error count decreased, build succeeds

**Sprint 2: Core (Runtime-Breaking)**
- Status: ⏳ PENDING
- Target: 6 undefined component errors
- Dependencies: Sprint 1 complete

**Sprint 3: Quality (Code Quality)**
- Status: 🔴 IN PROGRESS
- Target: 28 code quality errors
- Dependencies: Sprint 2 complete (or skip if false positives)

**Sprint 4: Polish (Warnings)**
- Status: ⏳ PENDING
- Target: Warnings cleanup
- Dependencies: Sprint 3 complete

---

## Complete Error Inventory (Iceberg Format)

### Level 1: BUILD-BREAKING (Bottom of Iceberg) ✅
**Dependencies:** None
**Status:** ✅ COMPLETE

1. ✅ Parsing error line 1040 - FIXED
   - BEFORE: 180 errors
   - AFTER: 179 errors
   - Build: ✅ SUCCESS
   - Proof: Error count decreased

### Level 2: RUNTIME-BREAKING
**Dependencies:** Level 1 ✅
**Status:** ⏳ PENDING

1. [ ] Undefined component: ProfessionalFileMenu (line 1104)
2. [ ] Undefined component: SubscriptionStatusIndicator (line 1109)
3. [ ] Undefined component: ActionCenter (line 1116)
4. [ ] Undefined component: AccountMenu (line 1123)
5. [ ] Undefined component: ToolLockingSystem (line 1148)
6. [ ] Undefined component: DockableToolPalette (line 1157)
7. [ ] Undefined component: LeftSidebar (line 1187)
8. [ ] Undefined component: SprintBoard (line 1257)
9. [ ] Undefined component: InspectorPanel (line 1280)
10. [ ] Undefined component: PowerUserToolbar (line 1305)

**Note:** These may be false positives - components are imported

### Level 3: CODE QUALITY
**Dependencies:** Level 2 (or skip if false positives)
**Status:** 🔴 IN PROGRESS

**Case Block Declarations (10):**
- [ ] Line 539: In updateSvgFromLayers (FALSE POSITIVE - not in switch)
- [ ] Line 543: In updateSvgFromLayers (FALSE POSITIVE - not in switch)
- [ ] Line 544: In updateSvgFromLayers (FALSE POSITIVE - not in switch)
- [ ] Line 551: In updateSvgFromLayers (FALSE POSITIVE - not in switch)
- [ ] Line 628: In updateSvgFromLayers (FALSE POSITIVE - not in switch)
- [ ] Line 629: In updateSvgFromLayers (FALSE POSITIVE - not in switch)
- [ ] Line 630: In updateSvgFromLayers (FALSE POSITIVE - not in switch)
- [x] Line 717: FILE_SAVE_AS - FIXED (wrapped in braces)
- [x] Line 807: FILE_EXPORT_SVG - FIXED (wrapped in braces)
- [x] Line 823: FILE_EXPORT_PNG - FIXED (wrapped in braces)

**Floating Promises (11):**
- [ ] Line 218: setShowAchievementPanel (FALSE POSITIVE - not a promise)
- [ ] Line 227: window.removeEventListener (FALSE POSITIVE - not a promise)
- [ ] Line 733: In FILE_OPEN case
- [ ] Line 745: In FILE_OPEN case
- [ ] Line 943: In FILE_CLOSE case
- [ ] Line 947: In FILE_CLOSE case
- [ ] Line 952: In FILE_CLOSE case
- [ ] Line 954: In FILE_CLOSE case
- [ ] Line 960: In FILE_PLACE case
- [ ] Line 962: In FILE_PLACE case
- [ ] Line 967: In FILE_PLACE case

**Misused Promises (3):**
- [ ] Line 202: Async arrow function
- [ ] Line 216: Async arrow function
- [ ] Line 327: Promise in function argument

**Await Thenable (1):**
- [ ] Line 337: Await of non-Promise

**Require Await (3):**
- [ ] Line 202: Async without await
- [ ] Line 216: Async without await
- [ ] Line 1160: Async without await

### Level 4: WARNINGS
**Dependencies:** Level 3 complete
**Status:** ⏳ PENDING

---

## Sprint 3 Backlog (Current)

### Batch 1: Floating Promises in Switch Statement
**Target:** Lines 733, 745, 943, 947, 952, 954, 960, 962, 967
**Status:** 🔴 IN PROGRESS

### Batch 2: Misused Promises
**Target:** Lines 202, 216, 327
**Status:** ⏳ PENDING

### Batch 3: Await Thenable
**Target:** Line 337
**Status:** ⏳ PENDING

### Batch 4: Require Await
**Target:** Lines 202, 216, 1160
**Status:** ⏳ PENDING

---

## Proof Requirements

For EACH fix:
1. Record BEFORE error count
2. Apply fix
3. Record AFTER error count
4. Verify count DECREASED
5. Verify build succeeds
6. Document in ICEBERG_FIX_LOG.md
7. Update sprint backlog

---

## Velocity Metrics

**Sprint 1:**
- Errors fixed: 1
- Time: Current session
- Success rate: 100%

**Sprint 3 (Current):**
- Errors fixed: 0 (just started)
- Target: 28 errors
- Progress: 0/28

**Overall:**
- Total fixed: 1/179 (0.56%)
- Remaining: 178 errors
- Build: ✅ SUCCESS

---

## Next Actions (Immediate)

1. Fix floating promise at line 733 (FILE_OPEN case)
2. Fix floating promise at line 745 (FILE_OPEN case)
3. Continue with remaining floating promises
4. Verify after each fix

