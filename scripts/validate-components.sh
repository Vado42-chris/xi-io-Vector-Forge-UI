#!/bin/bash
# Component Validation Script
# Runs basic checks on components and services

echo "🔍 VectorForge Component Validation"
echo "===================================="
echo ""

# Check if dev server is running
echo "1. Checking dev server..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "   ✅ Dev server is running on http://localhost:5173"
else
    echo "   ❌ Dev server is NOT running"
    echo "   Run: npm run dev"
    exit 1
fi

echo ""
echo "2. Checking component files..."
COMPONENTS=(
    "components/DevChatbot.tsx"
    "components/ConversationHistoryPanel.tsx"
    "components/TemplateLibrary.tsx"
    "components/FileBrowser.tsx"
    "components/Terminal.tsx"
    "components/ProjectWizard.tsx"
    "components/BatchOperationsPanel.tsx"
    "components/SchemaBuilder.tsx"
    "components/TestGeneratorPanel.tsx"
    "components/GuidedWorkflowPanel.tsx"
)

MISSING=0
for comp in "${COMPONENTS[@]}"; do
    if [ -f "$comp" ]; then
        echo "   ✅ $comp"
    else
        echo "   ❌ $comp (MISSING)"
        MISSING=$((MISSING + 1))
    fi
done

echo ""
echo "3. Checking service files..."
SERVICES=(
    "services/conversationHistoryService.ts"
    "services/templateSeedService.ts"
    "services/templateService.ts"
    "services/fileSystemClient.ts"
)

for svc in "${SERVICES[@]}"; do
    if [ -f "$svc" ]; then
        echo "   ✅ $svc"
    else
        echo "   ❌ $svc (MISSING)"
        MISSING=$((MISSING + 1))
    fi
done

echo ""
echo "4. Checking for TypeScript errors..."
if npm run type-check > /tmp/ts-errors.log 2>&1; then
    echo "   ✅ No TypeScript errors"
else
    echo "   ⚠️  TypeScript errors found (check /tmp/ts-errors.log)"
fi

echo ""
echo "5. Checking for linting errors..."
if npm run lint > /tmp/lint-errors.log 2>&1; then
    echo "   ✅ No linting errors"
else
    echo "   ⚠️  Linting errors found (check /tmp/lint-errors.log)"
fi

echo ""
if [ $MISSING -eq 0 ]; then
    echo "✅ All component files present"
    echo ""
    echo "Next: Open http://localhost:5173 in browser and run visual tests"
else
    echo "❌ $MISSING files missing"
    exit 1
fi

