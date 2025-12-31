#!/bin/bash
# Diagnostic script to find why app is stuck on loading spinner

echo "🔍 Diagnosing Loading Issue..."
echo ""

# Check if dev server is running
echo "1. Checking if dev server is running on port 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "   ✅ Dev server is running on port 3000"
else
    echo "   ❌ Dev server is NOT running on port 3000"
    echo "   Run: npm run dev"
    exit 1
fi

# Check if index.html exists
echo ""
echo "2. Checking if index.html exists..."
if [ -f "index.html" ]; then
    echo "   ✅ index.html exists"
else
    echo "   ❌ index.html NOT FOUND"
    exit 1
fi

# Check if index.tsx exists
echo ""
echo "3. Checking if index.tsx exists..."
if [ -f "index.tsx" ]; then
    echo "   ✅ index.tsx exists"
else
    echo "   ❌ index.tsx NOT FOUND"
    exit 1
fi

# Check for TypeScript errors
echo ""
echo "4. Checking for TypeScript errors..."
npm run type-check 2>&1 | head -20

# Check if Vite is serving files
echo ""
echo "5. Testing if Vite is serving files..."
curl -s http://localhost:3000 | head -5

echo ""
echo "✅ Diagnosis complete. Check output above for issues."

