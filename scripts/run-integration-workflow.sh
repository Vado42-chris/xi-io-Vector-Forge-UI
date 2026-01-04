#!/bin/bash
# Complete Integration Workflow
# Purpose: Run the complete integration workflow for a module

set -e

MODULE_NAME="$1"

if [ -z "$MODULE_NAME" ]; then
  echo "Usage: $0 <module-name>"
  echo "Example: $0 conversation-cache"
  exit 1
fi

echo "🚀 Starting Integration Workflow for: $MODULE_NAME"
echo ""

# Step 1: Create Baseline
echo "Step 1: Creating baseline..."
./scripts/create-baseline.sh

# Step 2: Run Existing Tests
echo ""
echo "Step 2: Running existing tests..."
npm test 2>&1 | tee integration-workflow-${MODULE_NAME}.log

# Step 3: Verify Integration
echo ""
echo "Step 3: Verifying integration..."
./scripts/verify-integration.sh 2>&1 | tee -a integration-workflow-${MODULE_NAME}.log

# Step 4: Update Capability Catalog
echo ""
echo "Step 4: Updating capability catalog..."
./scripts/update-capability-catalog.sh "$MODULE_NAME" "integrated" 2>&1 | tee -a integration-workflow-${MODULE_NAME}.log

echo ""
echo "✅ Integration workflow complete for: $MODULE_NAME"
echo ""
echo "Results saved to: integration-workflow-${MODULE_NAME}.log"

