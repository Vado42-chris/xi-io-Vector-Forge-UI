#!/bin/bash
# Install Cursor Bridge as Systemd Service
# This makes the bridge auto-start on boot and run in background
# Can be managed without Cursor

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_NAME="cursor-bridge"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"

echo "🔧 Installing Cursor Bridge as Systemd Service..."
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Create service file
cat > "$SERVICE_FILE" << EOF
[Unit]
Description=Cursor Filter Bridge - Routes Cursor AI to Local Ollama
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=$USER
Group=$USER
WorkingDirectory=$SCRIPT_DIR
ExecStart=/usr/bin/python3 $SCRIPT_DIR/cursor_filter_bridge.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

# Environment
Environment="OLLAMA_URL=http://localhost:11434"
Environment="DEFAULT_OLLAMA_MODEL=codellama:latest"
Environment="PATH=/usr/local/bin:/usr/bin:/bin"

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Service file created: $SERVICE_FILE"
echo ""

# Reload systemd
systemctl daemon-reload
echo "✅ Systemd reloaded"
echo ""

# Enable service
systemctl enable "$SERVICE_NAME"
echo "✅ Service enabled (will start on boot)"
echo ""

# Start service
systemctl start "$SERVICE_NAME"
echo "✅ Service started"
echo ""

# Check status
sleep 2
systemctl status "$SERVICE_NAME" --no-pager | head -15
echo ""

echo "=========================================="
echo "✅ Cursor Bridge installed as service!"
echo "=========================================="
echo ""
echo "Management commands:"
echo "  sudo systemctl start $SERVICE_NAME    # Start"
echo "  sudo systemctl stop $SERVICE_NAME     # Stop"
echo "  sudo systemctl restart $SERVICE_NAME # Restart"
echo "  sudo systemctl status $SERVICE_NAME  # Status"
echo "  sudo journalctl -u $SERVICE_NAME -f   # View logs"
echo ""

