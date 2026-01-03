# Cursor Local AI Setup - Free of Usage Limits

## 🎯 Goal

Configure Cursor IDE on **Aries-PC** (this computer) to work like a "dumb terminal" that:
- ✅ Uses **local AI** (Ollama) instead of cloud AI
- ✅ **No usage limits** (local processing)
- ✅ Works like Loki-PC setup
- ✅ Free of Cursor credit consumption

## 🔍 Current Cursor Configuration

### Check Current Settings

```bash
# Check Cursor settings
cat ~/.config/Cursor/User/settings.json | grep -i -A 3 "ai\|model\|ollama"

# Check Cursor extensions
ls ~/.config/Cursor/extensions/ | grep -i "ollama\|local\|ai"

# Check Cursor workspace settings
cat .vscode/settings.json 2>/dev/null | grep -i "ai\|model\|ollama"
```

## 🛠️ Configuration Steps

### Step 1: Install Ollama Extension (if needed)

Cursor supports local AI through extensions. Check if you have:

1. **Ollama Extension** - Direct Ollama integration
2. **Continue Extension** - Local AI support
3. **Local AI Extension** - Various local AI providers

### Step 2: Configure Cursor Settings

Edit `~/.config/Cursor/User/settings.json`:

```json
{
  // Use local Ollama instead of cloud AI
  "cursor.aiModel": "local",
  "cursor.localModel": "codellama:latest",
  "cursor.localAIServer": "http://localhost:11434",
  
  // Disable cloud AI features
  "cursor.useCloudAI": false,
  "cursor.requireInternet": false,
  
  // Ollama configuration
  "ollama.serverUrl": "http://localhost:11434",
  "ollama.model": "codellama:latest",
  
  // Continue extension (if installed)
  "continue.models": [
    {
      "title": "Local Ollama",
      "provider": "ollama",
      "model": "codellama:latest",
      "apiBase": "http://localhost:11434"
    }
  ],
  
  // Disable telemetry/usage tracking
  "cursor.telemetry": false,
  "cursor.usageTracking": false
}
```

### Step 3: Verify Ollama is Running

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running, start it
ollama serve

# Verify model is available
ollama list
```

### Step 4: Test Local AI in Cursor

1. Open Cursor
2. Open Command Palette (Ctrl+Shift+P)
3. Type "Ollama" or "Local AI"
4. Test code completion/generation
5. Should use local Ollama (no credits consumed)

## 📋 Cursor Configuration Files

### User Settings
- **Location**: `~/.config/Cursor/User/settings.json`
- **Purpose**: Global Cursor settings

### Workspace Settings
- **Location**: `.vscode/settings.json` (in project root)
- **Purpose**: Project-specific settings

### Extensions
- **Location**: `~/.config/Cursor/extensions/`
- **Purpose**: Installed extensions

## 🔧 Alternative: Use Continue Extension

**Continue** is a popular extension for local AI in VS Code/Cursor:

1. **Install Continue Extension**
   ```bash
   # In Cursor, install "Continue" extension
   # Or via command line:
   cursor --install-extension continue.continue
   ```

2. **Configure Continue**
   - Open Continue settings
   - Add Ollama provider
   - Set model to `codellama:latest`
   - Set server URL to `http://localhost:11434`

3. **Use Continue**
   - Press `Ctrl+L` (or `Cmd+L` on Mac)
   - Chat with local AI
   - No credits consumed

## 🎯 Quick Setup Script

Create a script to configure Cursor automatically:

```bash
#!/bin/bash
# Configure Cursor for local AI

CURSOR_SETTINGS="$HOME/.config/Cursor/User/settings.json"

# Backup existing settings
cp "$CURSOR_SETTINGS" "$CURSOR_SETTINGS.backup" 2>/dev/null || true

# Add local AI configuration
cat >> "$CURSOR_SETTINGS" << 'EOF'
{
  "cursor.aiModel": "local",
  "cursor.localModel": "codellama:latest",
  "cursor.localAIServer": "http://localhost:11434",
  "cursor.useCloudAI": false,
  "ollama.serverUrl": "http://localhost:11434",
  "ollama.model": "codellama:latest"
}
EOF

echo "✅ Cursor configured for local AI"
```

## 🔍 Verify Configuration

### Check Settings
```bash
cat ~/.config/Cursor/User/settings.json | grep -i "ollama\|local.*ai"
```

### Test in Cursor
1. Open Cursor
2. Try AI code completion
3. Check if it uses local Ollama (no network requests to Cursor cloud)
4. Verify no credits consumed

## 📝 What to Check on Loki-PC

To replicate Loki-PC's setup exactly:

```bash
# On Loki-PC, check:
cat ~/.config/Cursor/User/settings.json | grep -i "ai\|model\|ollama"
ls ~/.config/Cursor/extensions/ | grep -i "ollama\|local\|continue"
cat ~/.config/Cursor/User/globalStorage/*/settings.json 2>/dev/null | grep -i "ollama"
```

## 🚨 Troubleshooting

### Issue: Cursor still uses cloud AI
**Solution**: 
1. Check settings file syntax (valid JSON)
2. Restart Cursor
3. Check if extension is installed
4. Verify Ollama is running

### Issue: Ollama not found
**Solution**:
1. Install Ollama: `curl -fsSL https://ollama.com/install.sh | sh`
2. Start Ollama: `ollama serve`
3. Pull model: `ollama pull codellama:latest`

### Issue: Extension not working
**Solution**:
1. Reinstall extension
2. Check extension settings
3. Verify Ollama connection
4. Check Cursor logs

## 🎯 Success Criteria

Cursor is configured correctly when:
- ✅ Settings file has local AI configuration
- ✅ Ollama is running and accessible
- ✅ Cursor uses local AI (no cloud requests)
- ✅ No credits consumed when using AI features
- ✅ Works offline (no internet required)

---

**Status**: Ready to configure - Run the setup steps above!

