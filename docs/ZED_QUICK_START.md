# Zed Agent Quick Start - File Locations
**For Phase 0 Audit**

## Critical Files (Exact Paths - Relative to Repo Root)

### Must Read for Phase 0:

1. **`docs/ENFORCEMENT_HOLES_AND_FIXES.md`** ✅ EXISTS
2. **`docs/ENFORCEMENT_TESTING_SUMMARY.md`** ✅ EXISTS
3. **`docs/COMPLIANCE_REPORT.md`** ✅ EXISTS
4. **`docs/COMPLIANCE_TEST_RESULTS.md`** ✅ EXISTS
5. **`docs/QUICK_FIX_GUIDE.md`** ✅ EXISTS
6. **`docs/FRACTAL_ENFORCEMENT_PLAN.md`** ✅ EXISTS
7. **`docs/FINAL_APPROVAL_AND_CONFIRMATIONS.md`** ✅ EXISTS
8. **`docs/ZED_FINAL_ANSWERS.md`** ✅ EXISTS

### Configuration Files:

1. **`.eslintrc.cjs`** ✅ EXISTS (in repo root)
2. **`package.json`** ✅ EXISTS (in repo root, check "scripts" section)
3. **`.husky/pre-commit`** ✅ EXISTS (in .husky/ directory)
4. **`.lintstagedrc.js`** ✅ EXISTS (in repo root)

### Design System (Phase 0.6):

1. **`styles/xibalba-design-language.css`** ✅ EXISTS
2. **`styles/xibalba-theme.css`** ✅ EXISTS

## Verify Files Exist (Commands):

```bash
# From repo root: /home/chrishallberg/xi-io-Vector-Forge-UI

# Check enforcement docs
ls docs/ENFORCEMENT_HOLES_AND_FIXES.md
ls docs/ENFORCEMENT_TESTING_SUMMARY.md
ls docs/COMPLIANCE_REPORT.md

# Check config files
ls .eslintrc.cjs
ls package.json
ls .husky/pre-commit

# Check design system
ls styles/xibalba-design-language.css
ls styles/xibalba-theme.css
```

## Working Directory:

**Repo Root:** `/home/chrishallberg/xi-io-Vector-Forge-UI`

**All paths are relative to this directory.**

## Search Tips:

- Use **relative paths** from repo root: `docs/ENFORCEMENT_HOLES_AND_FIXES.md`
- **Case-sensitive:** `ENFORCEMENT` not `enforcement`
- **Exact spelling:** `ENFORCEMENT_HOLES_AND_FIXES.md` (with underscores)

## Phase 0 Reading Order:

1. Start: `docs/FINAL_APPROVAL_AND_CONFIRMATIONS.md`
2. Plan: `docs/FRACTAL_ENFORCEMENT_PLAN.md`
3. Current State: `docs/ENFORCEMENT_TESTING_SUMMARY.md`
4. Compliance: `docs/COMPLIANCE_REPORT.md`
5. Config: `.eslintrc.cjs`, `package.json`
