# Standalone Access to Cursor Bypass Tools

## 🎯 Purpose

All these scripts work **without Cursor** - you can run them from:
- ✅ Terminal
- ✅ Zed IDE
- ✅ Any text editor
- ✅ SSH session
- ✅ Even when Cursor is broken!

## 📋 Available Scripts

### 1. **Backup Cursor Config**
```bash
cd cursor-bridge
./backup-cursor-config.sh
```
**Purpose**: Backup Cursor settings for recovery  
**When to use**: Before making changes, or regularly  
**Output**: `~/.cursor-backups/`

### 2. **Restore Cursor Config**
```bash
cd cursor-bridge
./restore-cursor-config.sh <timestamp>
```
**Purpose**: Restore Cursor settings from backup  
**When to use**: When Cursor breaks or settings get corrupted  
**Example**: `./restore-cursor-config.sh 20260103_203000`

### 3. **Verify Bypass Status**
```bash
cd cursor-bridge
./verify-cursor-bypass.sh
```
**Purpose**: Check if bypass is working  
**When to use**: Anytime to verify configuration  
**Shows**: Settings, bridge status, Ollama status, activity

### 4. **Emergency Fix**
```bash
cd cursor-bridge
./fix-cursor-emergency.sh
```
**Purpose**: Fix Cursor when it's broken and you're out of usage  
**When to use**: Cursor won't start, settings corrupted, out of credits  
**Does**: Restores backup, creates config, starts bridge, verifies

### 5. **Start Bridge**
```bash
cd cursor-bridge
./start_cursor_bridge.sh
```
**Purpose**: Start the Cursor bridge manually  
**When to use**: Bridge not running, testing, manual control

### 6. **Install as Service** (Optional)
```bash
cd cursor-bridge
sudo ./install-as-service.sh
```
**Purpose**: Make bridge auto-start on boot  
**When to use**: Want bridge always running  
**Requires**: sudo/root access

## 🚨 Emergency Recovery Workflow

**When Cursor is broken and you're out of usage:**

1. **Open terminal** (or Zed, or any editor)
2. **Run emergency fix**:
   ```bash
   cd ~/xi-io-Vector-Forge-UI/cursor-bridge
   ./fix-cursor-emergency.sh
   ```
3. **Restart Cursor**
4. **Verify it works**:
   ```bash
   ./verify-cursor-bypass.sh
   ```

## 📁 Backup Location

All backups stored in: `~/.cursor-backups/`

**Files**:
- `settings.json.<timestamp>` - Cursor user settings
- `workspace-settings.json.<timestamp>` - Workspace settings
- `settings.json.latest` - Symlink to latest backup
- `backup-summary.<timestamp>.txt` - Backup metadata

## 🔍 Verification Commands

**Check bridge status**:
```bash
curl http://localhost:8080/health
curl http://localhost:8080/status  # Web UI
```

**Check Ollama**:
```bash
curl http://localhost:11434/api/tags
```

**View bridge logs**:
```bash
tail -f cursor-bridge/cursor_bridge.log
```

**Check Cursor settings**:
```bash
cat ~/.config/Cursor/User/settings.json | grep -i "aiModel\|useCloudAI"
```

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Backup config | `./backup-cursor-config.sh` |
| Restore config | `./restore-cursor-config.sh <timestamp>` |
| Verify bypass | `./verify-cursor-bypass.sh` |
| Emergency fix | `./fix-cursor-emergency.sh` |
| Start bridge | `./start_cursor_bridge.sh` |
| Check bridge | `curl http://localhost:8080/health` |
| Check Ollama | `curl http://localhost:11434/api/tags` |

## ✅ Success Indicators

**Bypass is working when**:
- ✅ `cursor.aiModel: "local"` in settings
- ✅ `cursor.useCloudAI: false` in settings
- ✅ Bridge running on port 8080
- ✅ Ollama running on port 11434
- ✅ Cursor requests show in bridge logs
- ✅ Cursor credits NOT increasing

---

**All scripts work standalone - no Cursor needed!** 🎉

