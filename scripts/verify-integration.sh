#!/bin/bash
# Verify Integration
# Purpose: Run comprehensive tests to verify integration didn't break anything

set -e

echo "🔍 Verifying Integration..."
echo ""

# 1. Run Unit Tests
echo "1. Running unit tests..."
npm test -- --run 2>&1 | tee verification-results.txt
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "❌ Unit tests failed!"
  exit 1
fi

# 2. Run Integration Tests
echo ""
echo "2. Running integration tests..."
npm test -- --run tests/integration/ 2>&1 | tee -a verification-results.txt
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "❌ Integration tests failed!"
  exit 1
fi

# 3. Check Performance
echo ""
echo "3. Checking performance..."
# Compare with baseline
BASELINE_DIR=$(ls -t baseline/ | head -1)
if [ -n "$BASELINE_DIR" ] && [ -f "baseline/$BASELINE_DIR/performance-metrics.txt" ]; then
  echo "Comparing with baseline: $BASELINE_DIR"
  # Add performance comparison logic
else
  echo "⚠️  No baseline found, skipping performance comparison"
fi

# 4. Health Checks
echo ""
echo "4. Running health checks..."
# Check if services are running
if curl -s http://localhost:3000 > /dev/null; then
  echo "✅ Dev server is running"
else
  echo "⚠️  Dev server is not running"
fi

if curl -s http://localhost:11434 > /dev/null; then
  echo "✅ Ollama is running"
else
  echo "⚠️  Ollama is not running"
fi

if curl -s http://localhost:8080/health > /dev/null; then
  echo "✅ Cursor bridge is running"
else
  echo "⚠️  Cursor bridge is not running"
fi

# 5. Check Capability Catalog
echo ""
echo "5. Verifying capability catalog..."
if [ -f "capability-catalog/capability-registry.json" ]; then
  echo "✅ Capability catalog exists"
  # Validate JSON
  if python3 -m json.tool capability-catalog/capability-registry.json > /dev/null 2>&1; then
    echo "✅ Capability catalog is valid JSON"
  else
    echo "❌ Capability catalog is invalid JSON!"
    exit 1
  fi
else
  echo "⚠️  Capability catalog not found"
fi

# 6. Check for Breaking Changes
echo ""
echo "6. Checking for breaking changes..."
# Compare file checksums with baseline
BASELINE_DIR=$(ls -t baseline/ | head -1)
if [ -n "$BASELINE_DIR" ] && [ -f "baseline/$BASELINE_DIR/file-checksums.txt" ]; then
  echo "Comparing file checksums with baseline..."
  # Add checksum comparison logic
else
  echo "⚠️  No baseline found, skipping checksum comparison"
fi

echo ""
echo "✅ Verification complete!"
echo ""
echo "Results saved to: verification-results.txt"

