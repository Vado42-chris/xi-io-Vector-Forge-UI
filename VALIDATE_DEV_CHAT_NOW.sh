#!/bin/bash
# Validation Script - Batch Testing Dev Chat
# Uses fullstack methodology: 5Ws + How validation

echo "🔍 Fullstack Dev Chat Validation"
echo "=================================="
echo ""

# Batch 1: Infrastructure (WHO)
echo "📦 Batch 1: Infrastructure (WHO is failing?)"
echo "--------------------------------------------"

# Test 1: Dev server running?
echo -n "Test 1: Dev server running? "
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ YES (PID: $(lsof -ti:3000))"
else
    echo "❌ NO"
    echo "   Fix: Run 'npm run dev'"
fi

# Test 2: Port accessible?
echo -n "Test 2: Port 3000 accessible? "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ YES"
else
    echo "❌ NO"
    echo "   Fix: Start dev server"
fi

# Test 3: Build succeeds?
echo -n "Test 3: Build succeeds? "
if npm run build > /tmp/build.log 2>&1; then
    echo "✅ YES"
else
    echo "❌ NO"
    echo "   Errors:"
    tail -10 /tmp/build.log | grep -i error | head -5
fi

# Test 4: TypeScript compiles?
echo -n "Test 4: TypeScript compiles? "
TS_ERRORS=$(npm run type-check 2>&1 | grep -c "error TS" || echo "0")
if [ "$TS_ERRORS" -eq "0" ]; then
    echo "✅ YES (0 errors)"
else
    echo "❌ NO ($TS_ERRORS errors)"
fi

echo ""

# Batch 2: Component Loading (WHAT is blocking?)
echo "📦 Batch 2: Component Loading (WHAT is blocking?)"
echo "------------------------------------------------"

# Test 5: DevChatbot exists?
echo -n "Test 5: DevChatbot.tsx exists? "
if [ -f "components/DevChatbot.tsx" ]; then
    echo "✅ YES"
else
    echo "❌ NO"
fi

# Test 6: FloatingDevChatButton exists?
echo -n "Test 6: FloatingDevChatButton.tsx exists? "
if [ -f "components/FloatingDevChatButton.tsx" ]; then
    echo "✅ YES"
else
    echo "❌ NO"
fi

# Test 7: Imports correct?
echo -n "Test 7: DevChatbot imported in RightSidebar? "
if grep -q "import.*DevChatbot" components/RightSidebar.tsx; then
    echo "✅ YES"
else
    echo "❌ NO"
fi

# Test 8: FloatingDevChatButton imported?
echo -n "Test 8: FloatingDevChatButton imported in App.hardened? "
if grep -q "import.*FloatingDevChatButton" App.hardened.tsx; then
    echo "✅ YES"
else
    echo "❌ NO"
fi

echo ""

# Batch 3: Runtime (WHEN does failure occur?)
echo "📦 Batch 3: Runtime (WHEN does failure occur?)"
echo "---------------------------------------------"
echo "⚠️  Manual test required:"
echo "   1. Open browser: http://localhost:3000"
echo "   2. Press F12 → Console tab"
echo "   3. Look for:"
echo "      - ✅ FloatingDevChatButton mounted and visible"
echo "      - ✅ DevChatbot mounted and ready"
echo "   4. Check for red errors"
echo ""

# Batch 4: Integration (WHERE is the failure?)
echo "📦 Batch 4: Integration (WHERE is the failure?)"
echo "----------------------------------------------"
echo "⚠️  Manual test required:"
echo "   1. Right Sidebar visible? (right side of screen)"
echo "   2. 'Dev Chat' tab exists?"
echo "   3. Tab is clickable?"
echo "   4. Component renders when clicked?"
echo ""

# Summary
echo "📊 Summary"
echo "----------"
echo "Infrastructure: Check Batch 1 results above"
echo "Component Loading: Check Batch 2 results above"
echo "Runtime: Manual browser test required"
echo "Integration: Manual UI test required"
echo ""
echo "🎯 Next Step:"
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "   Dev server is running. Open http://localhost:3000 in browser."
    echo "   Check console (F12) for component mount messages."
else
    echo "   Start dev server: npm run dev"
    echo "   Then open http://localhost:3000 in browser."
fi

