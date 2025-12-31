# Complete Error Map - Iceberg Dependency Order
**Date:** January 27, 2025  
**Status:** 🔴 MAPPING ALL ERRORS

---

## BASELINE (VERIFIED)

**Total ESLint Errors:** 179
**App.hardened.tsx Errors (errors only):** [TO BE COUNTED]

---

## Error Inventory by Level (Bottom → Top of Iceberg)

### Level 1: BUILD-BREAKING (Fix First)
**Dependencies:** None - blocks everything
**Count:** 0 (1 fixed, 0 remaining)

1. ✅ Parsing error line 1040 - FIXED (180→179)

### Level 2: RUNTIME-BREAKING (Fix Second)
**Dependencies:** Level 1 complete
**Count:** 6 errors

1. Line 1104: 'ProfessionalFileMenu' is not defined
2. Line 1109: 'SubscriptionStatusIndicator' is not defined
3. Line 1116: 'ActionCenter' is not defined
4. Line 1123: 'AccountMenu' is not defined
5. Line 1148: 'ToolLockingSystem' is not defined
6. Line 1157: 'DockableToolPalette' is not defined

### Level 3: CODE QUALITY (Fix Third)
**Dependencies:** Level 2 complete
**Count:** 28 errors

**Case Block Declarations (10):**
- Line 539: Unexpected lexical declaration
- Line 543: Unexpected lexical declaration
- Line 544: Unexpected lexical declaration
- Line 551: Unexpected lexical declaration
- Line 628: Unexpected lexical declaration
- Line 629: Unexpected lexical declaration
- Line 630: Unexpected lexical declaration
- Line 717: Unexpected lexical declaration
- Line 807: Unexpected lexical declaration
- Line 823: Unexpected lexical declaration

**Floating Promises (11):**
- Line 218: Promises must be awaited
- Line 227: Promises must be awaited
- Line 733: Promises must be awaited
- Line 745: Promises must be awaited
- Line 943: Promises must be awaited
- Line 947: Promises must be awaited
- Line 952: Promises must be awaited
- Line 954: Promises must be awaited
- Line 960: Promises must be awaited
- Line 962: Promises must be awaited
- Line 967: Promises must be awaited

**Misused Promises (3):**
- Line 202: Promise returned where void expected
- Line 216: Promise returned where void expected
- Line 327: Promise returned where void expected

**Await Thenable (1):**
- Line 337: Unexpected await of non-Promise

**Require Await (3):**
- Line 202: Async arrow function has no 'await'
- Line 216: Async arrow function has no 'await'
- Line 1160: Async arrow function has no 'await'

### Level 4: WARNINGS (Fix Last)
**Dependencies:** Level 3 complete
**Count:** [Many warnings - lower priority]

---

## Fix Order (Dependency Chain)

1. ✅ Level 1: Build-breaking (DONE)
2. ⏳ Level 2: Runtime-breaking (NEXT)
3. ⏳ Level 3: Code quality (AFTER LEVEL 2)
4. ⏳ Level 4: Warnings (FINAL)

---

## Progress Tracking

**Errors Fixed:** 1/179 (0.56%)
**Sprint 1:** 1/1 complete (100%)
**Sprint 2:** 0/6 complete (0%)
**Sprint 3:** 0/28 complete (0%)
**Sprint 4:** 0/? complete (0%)

**Overall Progress:** 1/179 errors fixed

