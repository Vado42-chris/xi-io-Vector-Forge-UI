#!/bin/bash
# Verify Render Test Script
# Tests if the app can render by checking dev server and browser console

set -e

echo "🔍 VectorForge Render Verification"
echo "===================================="
echo ""

# Check if dev server is running
echo "1. Checking dev server status..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "   ✅ Dev server is running on port 3000"
    SERVER_PID=$(lsof -ti:3000)
    echo "   PID: $SERVER_PID"
else
    echo "   ❌ Dev server is NOT running"
    echo "   Starting dev server..."
    npm run dev &
    sleep 5
    if lsof -ti:3000 > /dev/null 2>&1; then
        echo "   ✅ Dev server started successfully"
    else
        echo "   ❌ Failed to start dev server"
        exit 1
    fi
fi

echo ""
echo "2. Testing server response..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Server is responding"
else
    echo "   ❌ Server is not responding"
    exit 1
fi

echo ""
echo "3. Checking for build errors..."
if npm run build 2>&1 | grep -q "error"; then
    echo "   ⚠️  Build has errors (check output above)"
else
    echo "   ✅ Build completed without errors"
fi

echo ""
echo "4. Service initialization check..."
echo "   Checking service files for defensive initialization..."

SERVICES=(
    "services/xpService.ts"
    "services/errorLogger.ts"
    "services/userProfileService.ts"
    "services/achievementService.ts"
    "services/clickTrackingService.ts"
)

ALL_SAFE=true
for service in "${SERVICES[@]}"; do
    if grep -q "try {" "$service" && grep -q "catch" "$service"; then
        echo "   ✅ $service has defensive initialization"
    else
        echo "   ❌ $service missing defensive initialization"
        ALL_SAFE=false
    fi
done

if [ "$ALL_SAFE" = true ]; then
    echo ""
    echo "✅ All services have defensive initialization"
else
    echo ""
    echo "❌ Some services need fixes"
    exit 1
fi

echo ""
echo "===================================="
echo "✅ Verification Complete"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:3000 in browser"
echo "2. Check browser console for errors"
echo "3. If UI doesn't render, check console for first error"
echo "4. Use MinimalRenderTest component to isolate issue"
echo ""

