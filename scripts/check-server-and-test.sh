#!/bin/bash
# Check server status and provide testing instructions

echo "🔍 VectorForge Validation Setup"
echo "================================"
echo ""

# Check if dev server is running
echo "1. Checking dev server status..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "   ✅ Dev server is RUNNING on http://localhost:5173"
    SERVER_RUNNING=true
else
    echo "   ❌ Dev server is NOT running"
    echo ""
    echo "   To start server:"
    echo "   cd /home/chrishallberg/xi-io-Vector-Forge-UI"
    echo "   npm run dev"
    echo ""
    SERVER_RUNNING=false
fi

echo ""
echo "2. Component files check..."
COMPONENTS=(
    "components/DevChatbot.tsx"
    "components/ConversationHistoryPanel.tsx"
    "components/TemplateLibrary.tsx"
)

ALL_PRESENT=true
for comp in "${COMPONENTS[@]}"; do
    if [ -f "$comp" ]; then
        echo "   ✅ $comp"
    else
        echo "   ❌ $comp (MISSING)"
        ALL_PRESENT=false
    fi
done

echo ""
echo "3. Service files check..."
SERVICES=(
    "services/conversationHistoryService.ts"
    "services/templateSeedService.ts"
)

for svc in "${SERVICES[@]}"; do
    if [ -f "$svc" ]; then
        echo "   ✅ $svc"
    else
        echo "   ❌ $svc (MISSING)"
        ALL_PRESENT=false
    fi
done

echo ""
echo "4. Documentation check..."
DOCS=(
    "docs/COMPONENT_VALIDATION_CHECKLIST.md"
    "docs/MANUAL_TESTING_GUIDE.md"
    "docs/COMPONENT_TEST_MATRIX.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "   ✅ $doc"
    else
        echo "   ❌ $doc (MISSING)"
    fi
done

echo ""
echo "================================"
if [ "$SERVER_RUNNING" = true ] && [ "$ALL_PRESENT" = true ]; then
    echo "✅ READY FOR TESTING"
    echo ""
    echo "Next steps:"
    echo "1. Open browser: http://localhost:5173"
    echo "2. Follow: docs/MANUAL_TESTING_GUIDE.md"
    echo "3. Document results: VALIDATION_RESULTS.md"
else
    if [ "$SERVER_RUNNING" = false ]; then
        echo "⚠️  Start dev server first"
    fi
    if [ "$ALL_PRESENT" = false ]; then
        echo "⚠️  Some files are missing"
    fi
fi
echo ""

