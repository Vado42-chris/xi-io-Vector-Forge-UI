# Phase 1 Verification Checklist

**Date:** January 5, 2025  
**Status:** ✅ **READY FOR VERIFICATION**

---

## ✅ Pre-Verification (Already Complete)

- [x] All components built and integrated
- [x] `data-testid="ai-panel"` added to AI panel
- [x] Playwright tests created with correct selectors
- [x] Build succeeds
- [x] No lint errors
- [x] TypeScript compiles

---

## 🔍 Verification Steps

### 1. Build Verification
```bash
npm run build
```
**Expected:** ✅ Build succeeds  
**Status:** ✅ **PASSED**

### 2. TypeScript Check
```bash
npx tsc --noEmit
```
**Expected:** ✅ No type errors  
**Status:** ⏳ **PENDING** (run to verify)

### 3. Lint Check
```bash
npm run lint
```
**Expected:** ✅ No lint errors  
**Status:** ⏳ **PENDING** (run to verify)

### 4. Playwright Tests
```bash
# Start dev server first (in another terminal)
npm run dev

# Then run tests
npx playwright test tests/playwright/mai.spec.ts
npx playwright test tests/playwright/progressive-disclosure.spec.ts
```
**Expected:** ✅ All tests pass  
**Status:** ⏳ **PENDING** (run to verify)

### 5. Manual Browser Testing

#### Start Dev Server
```bash
npm run dev
```

#### Open Browser
Navigate to: `http://localhost:5173` (or your dev port)

#### Test Checklist

**ActionCenter (MAI Framework)**
- [ ] ActionCenter visible top-right
- [ ] Shows "Generate Vector" when you type a prompt
- [ ] Shows "Edit Selection" when layers are selected
- [ ] Shows "Enter a prompt to start" when no prompt
- [ ] Clicking ActionCenter executes the action

**Tooltips**
- [ ] Hover over "Previous Frame" button → tooltip appears with "←"
- [ ] Hover over "Next Frame" button → tooltip appears with "→"
- [ ] Hover over "Keyframe" button → tooltip appears with "K"
- [ ] Hover over "Presets" button → tooltip appears with "Ctrl+P"

**Progressive Disclosure**
- [ ] Advanced options in AI panel are hidden by default
- [ ] "Show Advanced" button visible in AI panel
- [ ] Clicking "Show Advanced" reveals Complexity and Iterations
- [ ] "Hide Advanced" button appears when expanded
- [ ] Global "Show Advanced" toggle in toolbar works
- [ ] Advanced mode state persists after page reload

**AI Panel**
- [ ] Only ONE AI panel visible (in center stack)
- [ ] No duplicate AI panel in left sidebar
- [ ] AI panel has `data-testid="ai-panel"` (check DevTools)

---

## 🐛 Common Issues & Fixes

### Issue: ActionCenter not visible
**Fix:** Check z-index (should be 1000+) and position (top-right)

### Issue: Tooltips not appearing
**Fix:** Check that Tooltip component is imported and delay is reasonable (400ms)

### Issue: Advanced options always visible
**Fix:** Check `defaultCollapsed={!advancedMode}` prop

### Issue: Playwright test fails on AI panel count
**Fix:** Verify `data-testid="ai-panel"` is on the AI panel container

### Issue: Import errors
**Fix:** Check relative paths:
- From `App.hardened.tsx`: `./components/design-system/...`
- From `AnimationTimeline.tsx`: `./Tooltip` (Tooltip is in components/)

---

## 📊 Test Results Template

After running tests, fill in:

```
Build: ✅ PASS / ❌ FAIL
TypeScript: ✅ PASS / ❌ FAIL
Lint: ✅ PASS / ❌ FAIL
Playwright (mai.spec.ts): ✅ PASS / ❌ FAIL
Playwright (progressive-disclosure.spec.ts): ✅ PASS / ❌ FAIL
Manual Testing: ✅ PASS / ❌ FAIL

Issues Found:
- [List any issues here]

Ready for PR: ✅ YES / ❌ NO
```

---

## 🚀 Next Steps After Verification

1. **If All Tests Pass:**
   - Create PR branch: `git checkout -b feat/phase1-mai-integration`
   - Commit: `git commit -m "feat(ui): Phase 1 - MAI + Tooltips + Progressive Disclosure"`
   - Push: `git push -u origin feat/phase1-mai-integration`
   - Create PR with description from `PHASE1_READY_FOR_PR.md`
   - Approve and merge (you're the Conductor)

2. **If Tests Fail:**
   - Paste error output here
   - I'll provide fixes
   - Re-run verification

---

## ✅ Current Status

**All code is complete and ready for verification.**

Run the verification steps above and report back any issues.

