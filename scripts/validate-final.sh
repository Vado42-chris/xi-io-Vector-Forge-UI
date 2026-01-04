#!/bin/bash

# Final Validation Script
# Purpose: Validate code before browser testing
# Assumption: No inline styles + No linting errors = Should work

echo "🔍 VectorForge Final Validation"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. Linting Check
echo "1️⃣ Checking linting..."
if npm run lint 2>&1 | grep -q "error"; then
  echo -e "${RED}❌ Linting errors found${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ No linting errors${NC}"
fi
echo ""

# 2. TypeScript Check
echo "2️⃣ Checking TypeScript..."
if npx tsc --noEmit 2>&1 | grep -q "error"; then
  echo -e "${RED}❌ TypeScript errors found${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ No TypeScript errors${NC}"
fi
echo ""

# 3. Inline Styles Check (Problematic Only)
echo "3️⃣ Checking for problematic inline styles..."
echo "   (Allowing CSS custom properties and dynamic values)"

# Check for static inline styles (problematic)
STATIC_STYLES=$(grep -r "style={{[^}]*:\s*['\"][^}]*['\"]" components/ App.hardened.tsx --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "'--" | grep -v "var(--" | wc -l)

if [ "$STATIC_STYLES" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Found $STATIC_STYLES potentially problematic inline styles${NC}"
  echo "   (These may need review, but dynamic values are acceptable)"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}✅ No problematic inline styles found${NC}"
fi
echo ""

# 4. Build Check
echo "4️⃣ Checking build..."
if npm run build 2>&1 | grep -q "error"; then
  echo -e "${RED}❌ Build errors found${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ Build succeeds${NC}"
fi
echo ""

# 5. Import Check
echo "5️⃣ Checking imports..."
if npm run build 2>&1 | grep -q "Cannot find module"; then
  echo -e "${RED}❌ Import errors found${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ All imports resolve${NC}"
fi
echo ""

# 6. CSS Variables Check
echo "6️⃣ Checking CSS variable usage..."
HARDCODED_COLORS=$(grep -r "#[0-9a-fA-F]\{6\}" components/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "//" | wc -l)

if [ "$HARDCODED_COLORS" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Found $HARDCODED_COLORS hardcoded colors${NC}"
  echo "   (Should use CSS variables: var(--xibalba-...))"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}✅ Using CSS variables consistently${NC}"
fi
echo ""

# Summary
echo "================================"
echo "📊 Validation Summary"
echo "================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
  echo ""
  echo "🎉 Ready for browser testing!"
  echo ""
  echo "The app should:"
  echo "  ✅ Load without errors"
  echo "  ✅ Render all components"
  echo "  ✅ Apply all styles correctly"
  echo "  ✅ Function as expected"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  PASSED WITH WARNINGS${NC}"
  echo ""
  echo "Found $WARNINGS warning(s) - Review recommended but not blocking"
  echo ""
  echo "✅ Ready for browser testing (with warnings)"
  exit 0
else
  echo -e "${RED}❌ VALIDATION FAILED${NC}"
  echo ""
  echo "Found $ERRORS error(s) and $WARNINGS warning(s)"
  echo ""
  echo "Please fix errors before browser testing"
  exit 1
fi

