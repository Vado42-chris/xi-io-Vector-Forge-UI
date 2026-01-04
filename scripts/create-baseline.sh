#!/bin/bash
# Create Baseline Snapshot
# Purpose: Capture current system state before integration

BASELINE_DIR="baseline/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BASELINE_DIR"

echo "Creating baseline snapshot..."
echo "Directory: $BASELINE_DIR"

# 1. Capability Catalog
echo "1. Capturing capability catalog..."
cp capability-catalog/capability-registry.json "$BASELINE_DIR/capability-registry.json" 2>/dev/null || echo "{}" > "$BASELINE_DIR/capability-registry.json"

# 2. Test Results
echo "2. Running tests..."
npm test > "$BASELINE_DIR/test-results.txt" 2>&1 || echo "Tests not configured" > "$BASELINE_DIR/test-results.txt"

# 3. Performance Metrics
echo "3. Capturing performance metrics..."
{
  echo "Timestamp: $(date)"
  echo "Memory: $(free -m | grep Mem | awk '{print $3 "MB used / " $2 "MB total"}')"
  echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')"
  echo "Disk: $(df -h . | tail -1 | awk '{print $3 " used / " $2 " total"}')"
} > "$BASELINE_DIR/performance-metrics.txt"

# 4. Git Status
echo "4. Capturing git status..."
git status > "$BASELINE_DIR/git-status.txt" 2>&1
git log -1 > "$BASELINE_DIR/git-last-commit.txt" 2>&1

# 5. Package Dependencies
echo "5. Capturing dependencies..."
cat package.json > "$BASELINE_DIR/package.json" 2>/dev/null || echo "{}" > "$BASELINE_DIR/package.json"

# 6. Configuration Files
echo "6. Capturing configuration..."
cp vite.config.ts "$BASELINE_DIR/vite.config.ts" 2>/dev/null || echo "No vite.config.ts"
cp tsconfig.json "$BASELINE_DIR/tsconfig.json" 2>/dev/null || echo "No tsconfig.json"

# 7. Key Files Checksum
echo "7. Creating checksums..."
find src services components -type f -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs md5sum > "$BASELINE_DIR/file-checksums.txt" 2>/dev/null || echo "No files found" > "$BASELINE_DIR/file-checksums.txt"

# 8. System Info
echo "8. Capturing system info..."
{
  echo "OS: $(uname -a)"
  echo "Node: $(node --version)"
  echo "NPM: $(npm --version)"
  echo "Date: $(date)"
} > "$BASELINE_DIR/system-info.txt"

echo ""
echo "✅ Baseline snapshot created: $BASELINE_DIR"
echo ""
echo "Files created:"
ls -lh "$BASELINE_DIR"

