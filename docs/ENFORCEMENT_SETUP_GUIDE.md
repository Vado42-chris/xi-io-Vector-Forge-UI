# Enforcement Setup Guide
**Date:** January 27, 2025  
**Purpose:** Step-by-step guide to set up automated enforcement

---

## Overview

This guide walks you through setting up all automated enforcement mechanisms for VectorForge development.

---

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

---

## Step 1: Install Dependencies

Add required packages to `package.json`:

```bash
npm install --save-dev \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  prettier \
  eslint-config-prettier \
  husky \
  lint-staged
```

Or update `package.json` and run `npm install`:

```json
{
  "devDependencies": {
    "eslint": "^8.57.0",
    "@typescript-eslint/parser": "^7.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "eslint-plugin-react": "^7.34.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.2.0",
    "eslint-config-prettier": "^9.1.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  }
}
```

---

## Step 2: Set Up Husky

```bash
# Install Husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run enforce"
```

The pre-commit hook is already created at `.husky/pre-commit`. Just install Husky:

```bash
npx husky install
```

---

## Step 3: Verify Configuration

### ESLint
```bash
npm run lint
```

### TypeScript
```bash
npm run type-check
```

### Prettier
```bash
npm run format:check
```

### Inline Styles
```bash
npm run check-inline-styles
```

### All Checks
```bash
npm run enforce
```

---

## Step 4: Test Pre-commit Hook

1. Make a small change to a file
2. Try to commit:
   ```bash
   git add .
   git commit -m "test: verify pre-commit hook"
   ```
3. The hook should run and check your code
4. If checks fail, fix issues and try again

---

## Step 5: Set Up GitHub Actions

The CI workflow is already created at `.github/workflows/ci.yml`.

To enable:
1. Push to GitHub
2. GitHub Actions will run automatically on push/PR
3. Check Actions tab in GitHub to see results

---

## Step 6: Generate Issues from Documentation

```bash
node scripts/generate-issues-from-docs.js
```

This creates issue files in `issues/` directory that can be converted to GitHub issues.

---

## Troubleshooting

### ESLint Errors
- Run `npm run lint:fix` to auto-fix some issues
- Check `.eslintrc.js` for rule configuration

### TypeScript Errors
- Run `npm run type-check` to see all errors
- Fix type errors before committing

### Prettier Formatting
- Run `npm run format` to auto-format
- Check `.prettierrc` for formatting rules

### Inline Styles Found
- Replace `style={{...}}` with CSS classes
- Use Xibalba design system classes
- See `docs/BEST_PRACTICES.md` for examples

### Husky Not Working
- Run `npx husky install`
- Check `.husky/pre-commit` exists and is executable
- Verify Git hooks directory: `git config core.hooksPath`

---

## Verification Checklist

- [ ] ESLint runs without errors
- [ ] TypeScript compiles without errors
- [ ] Prettier formats code correctly
- [ ] Inline style checker works
- [ ] Pre-commit hook blocks bad commits
- [ ] GitHub Actions CI runs on push/PR
- [ ] All checks pass locally with `npm run enforce`

---

## Next Steps

1. ✅ Set up enforcement (this guide)
2. ⏳ Review generated issues
3. ⏳ Create GitHub project board
4. ⏳ Start Phase 1 UI work

---

**Last Updated:** January 27, 2025  
**Status:** Setup guide complete, ready for implementation

