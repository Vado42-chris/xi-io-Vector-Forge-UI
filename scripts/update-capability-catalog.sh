#!/bin/bash
# Update Capability Catalog
# Purpose: Update capability catalog after integration

set -e

INTEGRATION_NAME="$1"
INTEGRATION_STATUS="$2" # "integrated" | "failed" | "rolled-back"

if [ -z "$INTEGRATION_NAME" ]; then
  echo "Usage: $0 <integration-name> [status]"
  exit 1
fi

if [ -z "$INTEGRATION_STATUS" ]; then
  INTEGRATION_STATUS="integrated"
fi

echo "📊 Updating capability catalog..."
echo "Integration: $INTEGRATION_NAME"
echo "Status: $INTEGRATION_STATUS"
echo ""

CATALOG_FILE="capability-catalog/capability-registry.json"

# Check if catalog exists
if [ ! -f "$CATALOG_FILE" ]; then
  echo "Creating new capability catalog..."
  mkdir -p capability-catalog
  cat > "$CATALOG_FILE" <<EOF
{
  "version": "1.0.0",
  "last_updated": "$(date -Iseconds)",
  "capabilities": [],
  "integrations": [],
  "baseline": {}
}
EOF
fi

# Update catalog using Python (or jq if available)
python3 <<EOF
import json
import sys
from datetime import datetime

catalog_file = "$CATALOG_FILE"
integration_name = "$INTEGRATION_NAME"
integration_status = "$INTEGRATION_STATUS"

# Read catalog
with open(catalog_file, 'r') as f:
    catalog = json.load(f)

# Add integration
integration = {
    "id": integration_name.lower().replace(' ', '-'),
    "name": integration_name,
    "status": integration_status,
    "date": datetime.now().isoformat(),
    "tests": [],
    "affected_capabilities": [],
    "verification": "pending"
}

if "integrations" not in catalog:
    catalog["integrations"] = []

catalog["integrations"].append(integration)
catalog["last_updated"] = datetime.now().isoformat()

# Write catalog
with open(catalog_file, 'w') as f:
    json.dump(catalog, f, indent=2)

print(f"✅ Added integration: {integration_name}")
EOF

echo ""
echo "✅ Capability catalog updated!"

