# Zed Agent File Location Guide
**Date:** January 27, 2025  
**Purpose:** Exact file paths for Phase 0 audit

---

## Critical Files for Phase 0 Audit

### Enforcement Documentation (Must Read)

1. **`docs/ENFORCEMENT_TESTING_SUMMARY.md`**
   - Current state and test results
   - Holes found and fixed
   - Compliance status

2. **`docs/COMPLIANCE_REPORT.md`**
   - Full compliance status
   - Violations by category
   - Action plan

3. **`docs/COMPLIANCE_TEST_RESULTS.md`**
   - Detailed test results
   - Error counts
   - Status per check

4. **`docs/QUICK_FIX_GUIDE.md`**
   - Fastest path to compliance
   - Quick fix commands
   - Priority actions

5. **`docs/ENFORCEMENT_HOLES_AND_FIXES.md`**
   - All holes identified
   - Fixes applied
   - Remaining issues

6. **`docs/ENFORCEMENT_IMPLEMENTATION_STATUS.md`**
   - What's been implemented
   - What's pending
   - Verification checklist

7. **`docs/ENFORCEMENT_SETUP_GUIDE.md`**
   - Setup instructions
   - Troubleshooting
   - Verification steps

8. **`docs/STRATEGIC_PLAN_REVIEW_FRACTAL.md`**
   - Strategic review
   - Fractal scalability
   - Recommendations

9. **`docs/FRACTAL_ENFORCEMENT_PLAN.md`**
   - Complete fractal reduction plan
   - 5-body → 4-body → 3-body
   - Phase-by-phase actions

10. **`docs/ZED_FINAL_ANSWERS.md`**
    - Final answers to questions
    - Decision framework
    - Ready to start

11. **`docs/FINAL_APPROVAL_AND_CONFIRMATIONS.md`**
    - Official approvals
    - All confirmations
    - Success criteria

---

### Enforcement Configuration Files (Must Read)

1. **`.eslintrc.cjs`**
   - ESLint configuration
   - Rules and overrides
   - TypeScript support

2. **`.lintstagedrc.js`**
   - lint-staged configuration
   - Pre-commit formatting

3. **`.husky/pre-commit`**
   - Pre-commit hook
   - Enforcement checks

4. **`package.json`**
   - npm scripts (check `scripts` section)
   - `npm run enforce` exists!
   - Dependencies

5. **`.github/workflows/ci.yml`**
   - GitHub Actions CI
   - Lint, test, build jobs

6. **`.github/pull_request_template.md`**
   - PR template
   - Checklist

7. **`CONTRIBUTING.md`**
   - Contributing guide
   - Best practices

---

### Design System Files (Must Read for Phase 0.6)

1. **`styles/xibalba-design-language.css`**
   - Design language classes
   - Canvas styles
   - Component patterns

2. **`styles/xibalba-theme.css`**
   - Theme variables
   - Color palette
   - Spacing system

3. **`styles/xibalba-components.css`** (if exists)
   - Component-specific styles

---

### Scripts (Must Check)

1. **`scripts/check-inline-styles.js`**
   - Inline style checker
   - Already exists!
   - Run: `npm run check-inline-styles`

2. **`scripts/generate-issues-from-docs.js`**
   - Auto-issue generator
   - Already exists!

---

## Exact File Paths (Absolute)

### Documentation
```
/home/chrishallberg/xi-io-Vector-Forge-UI/docs/ENFORCEMENT_TESTING_SUMMARY.md
/home/chrishallberg/xi-io-Vector-Forge-UI/docs/COMPLIANCE_REPORT.md
/home/chrishallberg/xi-io-Vector-Forge-UI/docs/COMPLIANCE_TEST_RESULTS.md
/home/chrishallberg/xi-io-Vector-Forge-UI/docs/QUICK_FIX_GUIDE.md
/home/chrishallberg/xi-io-Vector-Forge-UI/docs/ENFORCEMENT_HOLES_AND_FIXES.md
/home/chrishallberg/xi-io-Vector-Forge-UI/docs/ENFORCEMENT_IMPLEMENTATION_STATUS.md
/home/chrishallberg/xi-io-Vector-Forge-UI/docs/ENFORCEMENT_SETUP_GUIDE.md
/home/chrishallberg/xi-io-Vector-Forge-UI/docs/STRATEGIC_PLAN_REVIEW_FRACTAL.md
/home/chrishallberg/xi-io-Vector-Forge-UI/docs/FRACTAL_ENFORCEMENT_PLAN.md
/home/chrishallberg/xi-io-Vector-Forge-UI/docs/ZED_FINAL_ANSWERS.md
/home/chrishallberg/xi-io-Vector-Forge-UI/docs/FINAL_APPROVAL_AND_CONFIRMATIONS.md
```

### Configuration
```
/home/chrishallberg/xi-io-Vector-Forge-UI/.eslintrc.cjs
/home/chrishallberg/xi-io-Vector-Forge-UI/.lintstagedrc.js
/home/chrishallberg/xi-io-Vector-Forge-UI/.husky/pre-commit
/home/chrishallberg/xi-io-Vector-Forge-UI/package.json
/home/chrishallberg/xi-io-Vector-Forge-UI/.github/workflows/ci.yml
/home/chrishallberg/xi-io-Vector-Forge-UI/.github/pull_request_template.md
/home/chrishallberg/xi-io-Vector-Forge-UI/CONTRIBUTING.md
```

### Design System
```
/home/chrishallberg/xi-io-Vector-Forge-UI/styles/xibalba-design-language.css
/home/chrishallberg/xi-io-Vector-Forge-UI/styles/xibalba-theme.css
```

### Scripts
```
/home/chrishallberg/xi-io-Vector-Forge-UI/scripts/check-inline-styles.js
/home/chrishallberg/xi-io-Vector-Forge-UI/scripts/generate-issues-from-docs.js
```

---

## Phase 0 Reading Order

### Step 1: Read Strategic Documents (30 min)
1. `docs/FINAL_APPROVAL_AND_CONFIRMATIONS.md` - Understand approvals
2. `docs/FRACTAL_ENFORCEMENT_PLAN.md` - Complete plan
3. `docs/ZED_FINAL_ANSWERS.md` - All answers

### Step 2: Read Current State (20 min)
1. `docs/ENFORCEMENT_TESTING_SUMMARY.md` - Current state
2. `docs/COMPLIANCE_REPORT.md` - Compliance status
3. `docs/COMPLIANCE_TEST_RESULTS.md` - Test results

### Step 3: Read Configuration Files (10 min)
1. `.eslintrc.cjs` - ESLint config
2. `package.json` - Scripts (check `scripts` section)
3. `.husky/pre-commit` - Git hooks

### Step 4: Run Baseline Checks (10 min)
```bash
npm ci
npm run enforce  # Baseline compliance
npm run build    # Baseline build
```

---

## Common Search Issues

### Issue: "No matches" when searching for files

**Solution:** Use exact file paths or relative paths from repo root

**Correct searches:**
- `docs/ENFORCEMENT_HOLES_AND_FIXES.md`
- `docs/COMPLIANCE_REPORT.md`
- `.eslintrc.cjs`
- `package.json`

**Incorrect searches:**
- `ENFORCEMENT_HOLES_AND_FIXES.md` (missing `docs/` prefix)
- `enforcement-holes-and-fixes.md` (wrong case/spacing)

---

## Verification Commands

### Check if files exist:
```bash
# From repo root
ls -la docs/ENFORCEMENT_HOLES_AND_FIXES.md
ls -la docs/COMPLIANCE_REPORT.md
ls -la .eslintrc.cjs
ls -la package.json
```

### List all enforcement docs:
```bash
find docs -name "*ENFORCEMENT*" -o -name "*COMPLIANCE*"
```

### Check npm scripts:
```bash
cat package.json | grep -A 20 '"scripts"'
```

---

## Quick Reference: What Exists

### ✅ Already Exists (Don't Create)
- `.eslintrc.cjs` - Already configured
- `scripts/check-inline-styles.js` - Already exists
- `.husky/pre-commit` - Already exists
- `.lintstagedrc.js` - Already exists
- `package.json` scripts - Already added
- `npm run enforce` - Already exists
- `.github/workflows/ci.yml` - Already exists
- `CONTRIBUTING.md` - Already exists

### ⏳ Need to Create (Phase 0 deliverables)
- `docs/AUDIT_SUMMARY.md` - Create in Phase 0
- `docs/DESIGN_SYSTEM_AUDIT.md` - Create in Phase 0.6
- `jest.config.js` - Create in Phase 0.5
- `playwright.config.ts` - Create in Phase 0.5
- `tests/unit/example.spec.tsx` - Create in Phase 0.5

---

## Working Directory

**Repo Root:** `/home/chrishallberg/xi-io-Vector-Forge-UI`

**All paths are relative to this directory.**

---

**Last Updated:** January 27, 2025  
**Status:** File location guide for Zed agents

