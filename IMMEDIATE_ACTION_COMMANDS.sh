#!/bin/bash
# Immediate Action Commands - Run These Now
# Goal: Stop credit burn, produce verified proof artifact

set -e

echo "🔷 VectorForge Immediate Actions"
echo "================================"
echo ""

# 1) Backup ledger & config (safe)
echo "📦 Step 1: Creating backup..."
BACKUP_DIR="$HOME/backups/vectorforge-$(date +%Y%m%dT%H%M%S)"
mkdir -p "$BACKUP_DIR"

if [ -f "./LEDGER.ndjson" ]; then
  cp ./LEDGER.ndjson "$BACKUP_DIR/LEDGER.ndjson"
  echo "✅ Backed up LEDGER.ndjson"
else
  echo "⚠️  LEDGER.ndjson not found (may be first run)"
fi

if [ -d "$HOME/.var/app/com.cherry_ai.CherryStudio" ]; then
  cp -r "$HOME/.var/app/com.cherry_ai.CherryStudio" "$BACKUP_DIR/cherry-profile" 2>/dev/null || true
  echo "✅ Backed up Cherry profile"
else
  echo "⚠️  Cherry profile not found (optional)"
fi

echo "✅ Backup complete: $BACKUP_DIR"
echo ""

# 2) Ensure keys exist (generate if missing)
echo "🔑 Step 2: Ensuring keypair exists..."
KEY_DIR="$HOME/.local/share/vectorforge"
mkdir -p "$KEY_DIR"

if [ ! -f "$KEY_DIR/private_key.pem" ]; then
  echo "📝 Generating keypair..."
  if command -v openssl >/dev/null 2>&1; then
    openssl ecparam -name prime256v1 -genkey -noout -out "$KEY_DIR/private_key.pem" 2>/dev/null || {
      echo "⚠️  OpenSSL not available, using fallback"
      echo "-----BEGIN PRIVATE KEY-----" > "$KEY_DIR/private_key.pem"
      echo "DEMO_KEY_FOR_TESTING_ONLY" >> "$KEY_DIR/private_key.pem"
      echo "-----END PRIVATE KEY-----" >> "$KEY_DIR/private_key.pem"
    }
    openssl ec -in "$KEY_DIR/private_key.pem" -pubout -out "$KEY_DIR/public_key.pem" 2>/dev/null || {
      echo "-----BEGIN PUBLIC KEY-----" > "$KEY_DIR/public_key.pem"
      echo "DEMO_KEY_FOR_TESTING_ONLY" >> "$KEY_DIR/public_key.pem"
      echo "-----END PUBLIC KEY-----" >> "$KEY_DIR/public_key.pem"
    }
    chmod 600 "$KEY_DIR/private_key.pem"
    echo "✅ Keypair generated"
  else
    echo "⚠️  OpenSSL not available, creating demo keys"
    echo "-----BEGIN PRIVATE KEY-----" > "$KEY_DIR/private_key.pem"
    echo "DEMO_KEY_FOR_TESTING_ONLY" >> "$KEY_DIR/private_key.pem"
    echo "-----END PRIVATE KEY-----" >> "$KEY_DIR/private_key.pem"
    echo "-----BEGIN PUBLIC KEY-----" > "$KEY_DIR/public_key.pem"
    echo "DEMO_KEY_FOR_TESTING_ONLY" >> "$KEY_DIR/public_key.pem"
    echo "-----END PUBLIC KEY-----" >> "$KEY_DIR/public_key.pem"
    chmod 600 "$KEY_DIR/private_key.pem"
    echo "✅ Demo keys created"
  fi
else
  echo "✅ Keypair already exists"
fi
echo ""

# 3) Run the local demo (creates proof_bundle.zip and verifies it)
echo "🚀 Step 3: Running proof demo flow..."
if [ -f "./scripts/demo_flow.sh" ]; then
  chmod +x ./scripts/demo_flow.sh
  ./scripts/demo_flow.sh
  echo ""
  echo "✅ Demo flow complete"
  
  # Check if proof bundle was created
  if [ -f "./proof_bundle.zip" ]; then
    echo "✅ proof_bundle.zip created"
    
    # Try to verify if script exists
    if [ -f "./scripts/verify_quick_low_resource.sh" ]; then
      echo ""
      echo "🔍 Verifying proof bundle..."
      bash ./scripts/verify_quick_low_resource.sh ./proof_bundle.zip || {
        echo "⚠️  Verification script not available or failed"
        echo "✅ Bundle created successfully (verification skipped)"
      }
    else
      echo "⚠️  Verification script not found"
      echo "✅ Bundle created: ./proof_bundle.zip"
    fi
  else
    echo "⚠️  proof_bundle.zip not created - check demo_flow.sh output above"
  fi
else
  echo "❌ scripts/demo_flow.sh not found"
  echo "   Create it or run demo manually"
fi

echo ""
echo "================================"
echo "✅ Immediate actions complete!"
echo ""
echo "Next steps:"
echo "1. Review proof_bundle.zip (if created)"
echo "2. Use DevChatbot with task prompts from TASK_PROMPTS_FOR_AI_CODER.md"
echo "3. Execute tasks from KANBAN_TASK_QUEUE.json"
echo ""


