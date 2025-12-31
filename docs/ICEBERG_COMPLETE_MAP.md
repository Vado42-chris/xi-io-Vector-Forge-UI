# Iceberg Complete Error Map - Dependency Order
**Date:** January 27, 2025  
**Status:** 🔴 MAPPING ALL ERRORS BEFORE FIXING

---

## BASELINE (CURRENT STATE)

**Total ESLint Errors:** 180
**App.hardened.tsx Errors:** [TO BE MEASURED]

---

## Error Categories (Bottom → Top of Iceberg)

### Level 1: BUILD-BREAKING (Fix First)
- Parsing errors
- Syntax errors
- Missing imports

### Level 2: RUNTIME-BREAKING (Fix Second)
- Undefined components
- Missing function definitions
- Type errors that prevent execution

### Level 3: CODE QUALITY (Fix Third)
- Case block declarations
- Floating promises
- Misused promises
- Await thenable

### Level 4: WARNINGS (Fix Last)
- Unused variables
- Unsafe assignments

---

## Complete Error Inventory

[TO BE POPULATED FROM ACTUAL LINT OUTPUT]

---

## Fix Strategy

For EACH error:
1. Document the error (type, line, message)
2. Map dependencies (what depends on this?)
3. Fix the error
4. Run `npm run lint` - record BEFORE count
5. Run `npm run lint` - record AFTER count
6. Verify count DECREASED
7. Run `npm run build` - verify build succeeds
8. Document what broke (if anything)
9. Only proceed if count decreased

---

## Fix Log

Each fix will be logged here with proof.

