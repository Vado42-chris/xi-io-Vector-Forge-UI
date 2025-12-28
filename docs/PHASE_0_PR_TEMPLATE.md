# Phase 0 PR Template - Copy This to GitHub
**Use this for your PR description on GitHub**

---

## Phase 0: Audit + Test Scaffolds

### What this PR contains:
- `docs/AUDIT_SUMMARY.md` — Phase 0 audit baseline & checklist
- `docs/DESIGN_SYSTEM_AUDIT.md` — initial design-system mapping template
- `jest.config.js` + `tests/setupTests.ts` + `tests/unit/example.spec.tsx` — minimal Jest scaffold
- `playwright.config.ts` — Playwright scaffold (disabled in CI)
- `package.json` — Updated with test scripts

### Notes:
- This PR is Phase 0 only. It does NOT modify enforcement configs like `.eslintrc.cjs` or existing `package.json` scripts (only added test scripts).
- Next steps (Phase 1) are: run deterministic autofixes, then manual inline-style fixes (9 files).
- Playwright remains scaffold-only; do not enable Playwright in CI until test creds are provided.

### Verification checklist for reviewers:
- [ ] Confirm docs files exist and path names are correct
- [ ] Run `npm ci` and `npm run enforce` locally and paste output in PR comments
- [ ] Verify jest runs: `npm test`
- [ ] Confirm Playwright scaffold present but not run in CI
- [ ] Confirm no enforcement config files were overwritten (`.eslintrc.cjs`, `.lintstagedrc.js`, `.husky/pre-commit`)
- [ ] Approve PR to allow Phase 1 to begin

### Decision rule reminder:
- After Phase 2, if compliance < 60% we will propose a scoped Cursor pass (requires explicit approval).

---

## Files Changed

### Added
- `docs/AUDIT_SUMMARY.md`
- `jest.config.js`
- `tests/setupTests.ts`
- `tests/unit/example.spec.tsx`
- `playwright.config.ts`
- `docs/DESIGN_SYSTEM_AUDIT.md`

### Modified
- `package.json` (added test scripts only)

### Not Modified (Read-Only)
- `.eslintrc.cjs` ✅
- `.lintstagedrc.js` ✅
- `.husky/pre-commit` ✅
- Existing `package.json` scripts ✅

---

## Test Results

### Jest Setup
```bash
npm test
# Should show: "PASS tests/unit/example.spec.tsx"
```

### Baseline Compliance
- Current: 10% (from `docs/COMPLIANCE_REPORT.md`)
- Target: >= 60% after Phase 2

---

## Next Steps

After this PR is approved:
1. Phase 1: Deterministic autofixes (format, eslint --fix)
2. Phase 1: Manual inline style fixes (9 files)
3. Phase 2: TypeScript + ESLint triage
4. Phase 3: Documentation & templates

