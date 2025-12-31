#!/bin/bash

echo "=== VectorForge Loading Diagnosis ==="
echo ""

# 1. Check if dev server is running
echo "1. Checking dev server status..."
VITE_PID=$(lsof -ti:3000 2>/dev/null | head -1)
if [ -n "$VITE_PID" ]; then
  echo "✅ Vite dev server is running (PID: $VITE_PID)"
else
  echo "❌ Vite dev server is NOT running on port 3000"
  echo "   Run: npm run dev"
fi
echo ""

# 2. Check if index.tsx exists and is valid
echo "2. Checking index.tsx..."
if [ -f "index.tsx" ]; then
  echo "✅ index.tsx exists"
  LINE_COUNT=$(wc -l < index.tsx)
  echo "   Lines: $LINE_COUNT"
  
  # Check for React imports
  if grep -q "import React" index.tsx; then
    echo "✅ React import found"
  else
    echo "❌ React import missing"
  fi
  
  # Check for ReactDOM
  if grep -q "ReactDOM" index.tsx; then
    echo "✅ ReactDOM import found"
  else
    echo "❌ ReactDOM import missing"
  fi
  
  # Check for MinimalApp
  if grep -q "MinimalApp" index.tsx; then
    echo "✅ MinimalApp component found"
  else
    echo "❌ MinimalApp component missing"
  fi
else
  echo "❌ index.tsx does not exist"
fi
echo ""

# 3. Check if index.html exists
echo "3. Checking index.html..."
if [ -f "index.html" ]; then
  echo "✅ index.html exists"
  if grep -q 'id="root"' index.html; then
    echo "✅ Root element found in HTML"
  else
    echo "❌ Root element missing in HTML"
  fi
  
  if grep -q "index.tsx\|index.ts\|main.tsx\|main.ts" index.html; then
    echo "✅ Script reference found"
  else
    echo "⚠️  Script reference might be missing (Vite auto-injects)"
  fi
else
  echo "❌ index.html does not exist"
fi
echo ""

# 4. Check for TypeScript errors
echo "4. Checking for TypeScript errors..."
if command -v tsc &> /dev/null; then
  TS_ERRORS=$(npx tsc --noEmit index.tsx 2>&1 | grep -c "error TS" || echo "0")
  if [ "$TS_ERRORS" -eq "0" ]; then
    echo "✅ No TypeScript errors found"
  else
    echo "❌ Found $TS_ERRORS TypeScript errors"
    echo "   Run: npx tsc --noEmit index.tsx"
  fi
else
  echo "⚠️  TypeScript compiler not found (skipping)"
fi
echo ""

# 5. Check if node_modules exists
echo "5. Checking dependencies..."
if [ -d "node_modules" ]; then
  echo "✅ node_modules exists"
  if [ -d "node_modules/react" ]; then
    echo "✅ React installed"
  else
    echo "❌ React not installed - run: npm install"
  fi
else
  echo "❌ node_modules missing - run: npm install"
fi
echo ""

# 6. Test HTTP response
echo "6. Testing HTTP response..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Server responding with HTTP 200"
elif [ "$HTTP_CODE" = "000" ]; then
  echo "❌ Cannot connect to server (might not be running)"
else
  echo "⚠️  Server responded with HTTP $HTTP_CODE"
fi
echo ""

echo "=== Diagnosis Complete ==="
echo ""
echo "Next steps:"
echo "1. If server not running: npm run dev"
echo "2. If TypeScript errors: Fix them"
echo "3. If React not installed: npm install"
echo "4. Check browser console (F12) for runtime errors"

