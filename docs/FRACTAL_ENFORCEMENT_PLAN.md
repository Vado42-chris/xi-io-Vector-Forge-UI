# Fractal Enforcement Plan - 10-Body → 5-Body → 4-Body → 3-Body
**Date:** January 27, 2025  
**Methodology:** Xibalba Fractal Reduction  
**Purpose:** Close gaps, simplify, create actionable plan

---

## The 10-Body Problem (Complexity)

### Original 10 Bodies
1. **Test framework setup** (Jest, Playwright)
2. **Design system knowledge** (CSS classes, tokens)
3. **Inline style fixes** (9 violations)
4. **TypeScript errors** (100+ errors)
5. **ESLint violations** (1,780 violations)
6. **Formatting issues** (many files)
7. **Git hooks verification** (Husky setup)
8. **Compliance tracking** (score calculation)
9. **Documentation updates** (merge, don't overwrite)
11. **Strategic scalability** (Xibalba-wide patterns)

---

## Fractal Reduction: 10-Body → 5-Body (5Ws + How)

### Core Pattern Identified
> **Audit → Setup → Fix → Verify → Document**

**Recursive Application:**
- Each body follows same pattern
- Each body validates with "How"
- Each body scales fractally

---

## The 5-Body Solution (5Ws + How Validation)

### Body A: Foundation Audit (Who/What/When/Where/Why + How)

**Who:** Enforcement lead + repo owner  
**What:** Read all existing enforcement files, design system, docs  
**When:** Phase 0 (first 30-60 minutes)  
**Where:** `docs/`, `.eslintrc.cjs`, `scripts/`, `styles/`  
**Why:** Avoid duplication, understand constraints, identify gaps

**How to Validate:**
- ✅ Produce `docs/AUDIT_SUMMARY.md` with:
  - List of existing enforcement files
  - List of existing scripts (`npm run enforce` exists!)
  - List of design system files
  - Gap analysis (what's missing)
  - Compliance baseline score

**Deliverable:** `docs/AUDIT_SUMMARY.md` (1 file)

---

### Body B: Infrastructure Setup (Who/What/When/Where/Why + How)

**Who:** Dev lead + QA  
**What:** Install test frameworks, verify git hooks, enhance existing scripts  
**When:** Phase 0.5 (30-45 minutes)  
**Where:** `tests/`, `jest.config.js`, `playwright.config.ts`, `.husky/`, `package.json`  
**Why:** Tests must run before adding tests, hooks must work

**How to Validate:**
- ✅ Jest installed and configured
- ✅ Playwright scaffolded (not enabled in CI)
- ✅ `npm run enforce` enhanced (if needed, not duplicated)
- ✅ Git hooks verified (test commit works)
- ✅ Unit test passes locally

**Deliverable:** Test framework working, hooks verified

---

### Body C: Design System Mapping (Who/What/When/Where/Why + How)

**Who:** UX lead + Dev  
**What:** Audit design CSS, map inline style → CSS class replacements  
**When:** Phase 0.6 (30-45 minutes)  
**Where:** `styles/xibalba-design-language.css`, `styles/xibalba-theme.css`  
**Why:** Prevent styling regressions, preserve design tokens

**How to Validate:**
- ✅ `docs/DESIGN_SYSTEM_AUDIT.md` created with:
  - Available CSS classes list
  - Token mapping (marginLeft → `--spacing-*` or class)
  - Inline style → CSS class mapping table
  - Example: `style={{ marginLeft: '200px' }}` → `className="ml-[200px]"` or CSS variable

**Deliverable:** `docs/DESIGN_SYSTEM_AUDIT.md` (mapping guide)

---

### Body D: Violation Fixes (Who/What/When/Where/Why + How)

**Who:** Dev team  
**What:** Fix inline styles, format code, fix critical TS errors, relax ESLint rules  
**When:** Phase 1-2 (3-5 hours)  
**Where:** `App.tsx`, `App.working.tsx`, `App.staged.tsx`, `App.minimal.tsx`, `tsconfig.json`, `.eslintrc.cjs`  
**Why:** Get to compliance, make enforcement work

**How to Validate:**
- ✅ `npm run format` passes
- ✅ `npm run check-inline-styles` shows 0 violations
- ✅ `npm run type-check` shows < 10 critical errors (relaxed rules)
- ✅ `npm run lint` shows < 100 errors (relaxed rules)
- ✅ `npm run build` succeeds
- ✅ Compliance score >= 60%

**Deliverable:** Fixed violations, compliance >= 60%

---

### Body E: Documentation & Templates (Who/What/When/Where/Why + How)

**Who:** Tech writer + Dev lead  
**What:** Update docs, create Xibalba-wide templates  
**When:** Phase 3 (1 hour)  
**Where:** `docs/ENFORCEMENT_HOLES_AND_FIXES.md`, new template files  
**Why:** Enable fractal scaling to other products, white label clients

**How to Validate:**
- ✅ `docs/ENFORCEMENT_HOLES_AND_FIXES.md` updated (merged, not overwritten)
- ✅ `docs/XIBALBA_ENFORCEMENT_TEMPLATE.md` created (reusable)
- ✅ `docs/DESIGN_SYSTEM_AUDIT_TEMPLATE.md` created (reusable)
- ✅ Compliance score documented
- ✅ Remaining issues listed

**Deliverable:** Updated docs, reusable templates

---

## 5-Body → 4-Body Action Plan

### Pattern: **Audit → Setup → Fix → Document**

---

### Phase 0: Foundation Audit (Body A)
**Time:** 30-60 minutes  
**Goal:** Understand current state, identify gaps

**Actions:**
1. Read all enforcement files (`.eslintrc.cjs`, `.husky/pre-commit`, `package.json` scripts)
2. Read design system files (`styles/xibalba-*.css`)
3. Run baseline checks (`npm run enforce`, `npm run build`)
4. Document findings

**Commands:**
```bash
npm ci
npm run enforce  # Baseline
npm run build    # Baseline
# Read files, document
```

**Deliverable:** `docs/AUDIT_SUMMARY.md`

**Validation:** Audit summary exists, baseline scores recorded

---

### Phase 1: Infrastructure Setup (Body B + Body C)
**Time:** 1-1.5 hours  
**Goal:** Set up test frameworks, map design system

**Actions:**
1. Install Jest + Playwright (Body B)
2. Verify git hooks (Body B)
3. Enhance `npm run enforce` if needed (Body B)
4. Audit design system (Body C)
5. Create design system mapping (Body C)

**Commands:**
```bash
# Body B: Test frameworks
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @types/jest
npm install --save-dev @playwright/test
# Create jest.config.js, playwright.config.ts
# Verify: npm test (should run)

# Body B: Git hooks
./scripts/verify-husky.sh  # or manual test
# Verify: Make test commit, should run hooks

# Body C: Design system
# Read styles/xibalba-design-language.css
# Read styles/xibalba-theme.css
# Create mapping document
```

**Deliverables:**
- Test framework working
- Git hooks verified
- `docs/DESIGN_SYSTEM_AUDIT.md`

**Validation:** Tests run, hooks work, mapping exists

---

### Phase 2: Violation Fixes (Body D)
**Time:** 3-5 hours  
**Goal:** Fix violations, get to compliance

**Actions:**
1. Auto-fix (format, eslint --fix)
2. Fix inline styles (9 violations, manual)
3. Fix critical TS errors (relax rules temporarily)
4. Relax ESLint rules (pragmatic)
5. Verify after each step

**Commands:**
```bash
# Auto-fix
npm run format
npx eslint . --ext .js,.ts,.tsx --fix

# Manual fixes (9 inline styles)
# Use docs/DESIGN_SYSTEM_AUDIT.md as guide
# One commit per file

# TS relaxation (modify tsconfig.json, add comments)
# ESLint relaxation (modify .eslintrc.cjs, add overrides)

# Verify
npm run enforce
npm run build
```

**Deliverables:**
- All inline styles fixed
- Critical TS errors fixed
- ESLint rules relaxed
- Compliance >= 60%

**Validation:** `npm run enforce` passes, build succeeds, compliance >= 60%

---

### Phase 3: Documentation & Templates (Body E)
**Time:** 1 hour  
**Goal:** Document results, create reusable templates

**Actions:**
1. Update `docs/ENFORCEMENT_HOLES_AND_FIXES.md` (merge)
2. Create `docs/XIBALBA_ENFORCEMENT_TEMPLATE.md`
3. Create `docs/DESIGN_SYSTEM_AUDIT_TEMPLATE.md`
4. Document compliance score
5. List remaining issues

**Commands:**
```bash
# Update docs (merge, don't overwrite)
# Create templates
# Document compliance
```

**Deliverables:**
- Updated docs
- Reusable templates
- Compliance documented

**Validation:** All docs updated, templates created

---

## 4-Body → 3-Body AB Test (Hybrid Choices)

### Pattern: **Local → Hybrid → LLM-Assisted**

---

### Option A: Local Deterministic (Recommended Start)
**What:** Follow 4-body plan, no LLM help  
**Time:** 4-6 hours  
**Credits:** 0  
**Compliance Target:** 60-75%

**When to Use:**
- ✅ Start here (always)
- ✅ If compliance >= 60% after Phase 2
- ✅ If remaining work is < 2 hours

**Decision Rule:** Continue if compliance >= 60% after Phase 2

---

### Option B: Hybrid Incremental (Adaptive)
**What:** Start with A, use Cursor for repetitive patterns only  
**Time:** 4-6 hours + 1-2 hours Cursor  
**Credits:** Moderate (targeted files only)  
**Compliance Target:** 80-90%

**When to Use:**
- ✅ If compliance < 60% after Phase 2
- ✅ If remaining work has repetitive patterns
- ✅ If > 25% of violations remain

**Decision Rule:** Use if compliance < 60% OR repetitive patterns > 25%

**Target Files:**
- Large TS files with many similar errors
- Multiple files with same ESLint pattern
- Repetitive inline style patterns

---

### Option C: LLM-Assisted Bulk (Fast but Risky)
**What:** Use Cursor for bulk refactoring  
**Time:** 1-2 hours  
**Credits:** High  
**Compliance Target:** 85-95%

**When to Use:**
- ⚠️ Only if Option B doesn't work
- ⚠️ Only for specific, well-scoped files
- ⚠️ Requires careful review

**Decision Rule:** Use only if Option B fails AND you approve credits

---

## The 3-Body AB Test Decision Framework

### Measurement Points
1. **After Phase 0:** Baseline compliance score
2. **After Phase 1:** Infrastructure ready
3. **After Phase 2:** Compliance score (decision point)
4. **After Option B/C (if used):** Final compliance score

### Primary KPIs
- **Compliance Score:** Target >= 60% (minimum), >= 85% (ideal)
- **Build Success:** Must be 100%
- **Time Spent:** Track per phase
- **Credits Used:** Track if Option B/C used

### Decision Tree

```
Start → Option A (Local Deterministic)
  │
  ├─ After Phase 2
  │   │
  │   ├─ Compliance >= 60% → Continue A → Done
  │   │
  │   └─ Compliance < 60% → Option B (Hybrid)
  │       │
  │       ├─ Repetitive patterns > 25% → Use Cursor for those
  │       │
  │       └─ No repetitive patterns → Manual fix remaining
  │
  └─ Option B doesn't work → Option C (only with approval)
```

---

## How to Close Gaps & Make It Better

### Gap 1: AB Test Over-Engineering
**Close:** Simplify to 3-body decision tree (above)  
**Make Better:** Clear decision rules, measurable KPIs

### Gap 2: TypeScript Config Confusion
**Close:** Modify main `tsconfig.json` with comments  
**Make Better:** Document which rules relaxed, create issue to re-enable

### Gap 3: Script Duplication
**Close:** Use existing `npm run enforce`, enhance if needed  
**Make Better:** Add compliance score output to existing script

### Gap 4: Missing Templates
**Close:** Create templates in Phase 3  
**Make Better:** Make templates reusable for Xibalba-wide use

### Gap 5: Missing Verification
**Close:** Add verification after each phase  
**Make Better:** Automated compliance score tracking

---

## Final Actionable Plan

### Immediate Next Steps

**1. Start with Phase 0 (Audit)**
```bash
npm ci
npm run enforce  # Baseline
npm run build     # Baseline
# Read files, create docs/AUDIT_SUMMARY.md
```

**2. Proceed to Phase 1 (Setup)**
- Install test frameworks
- Verify git hooks
- Audit design system

**3. Execute Phase 2 (Fixes)**
- Auto-fix what we can
- Manual fix inline styles
- Relax rules temporarily

**4. Complete Phase 3 (Document)**
- Update docs
- Create templates
- Document compliance

**5. Make AB Test Decision**
- After Phase 2, check compliance
- If >= 60%, continue Option A
- If < 60%, use Option B (targeted Cursor)

---

## Answers to Zed's Question

**Q: How do we fractalize 10-body → 5-body → 4-body → 3-body?**

**Answer:**
1. **10-Body → 5-Body:** Group by pattern (Audit, Setup, Fix, Verify, Document)
2. **5-Body → 4-Body:** Merge Setup + Design System (Phase 1)
3. **4-Body → 3-Body:** Create AB test (A/B/C options)

**Pattern:** Each reduction follows same recursive pattern, validates with "How"

---

## Summary

**10-Body Problem:** 10 complex tasks  
**5-Body Solution:** 5Ws + How validation (Audit, Setup, Design, Fix, Document)  
**4-Body Action Plan:** 4 phases (Audit, Setup, Fix, Document)  
**3-Body AB Test:** 3 options (Local, Hybrid, LLM)

**Result:** Clear, actionable, scalable plan that closes gaps and creates reusable patterns

---

**Last Updated:** January 27, 2025  
**Status:** Fractal reduction complete, ready for execution

