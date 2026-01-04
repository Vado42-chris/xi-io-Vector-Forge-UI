# Cursor Bypass - Standalone Access Guide

## 🎯 You Can Access This Without Cursor!

All tools work from:
- ✅ Terminal
- ✅ Zed IDE  
- ✅ SSH
- ✅ Any environment

**Even when Cursor is broken or you're out of usage!**

## 🚨 Emergency Recovery

**If Cursor breaks and you're out of usage:**

```bash
cd ~/xi-io-Vector-Forge-UI/cursor-bridge
./fix-cursor-emergency.sh
```

This will:
1. Restore Cursor settings from backup
2. Start the bridge
3. Verify everything is working
4. Fix Cursor without needing Cursor to be running!

## 📋 Daily Operations

### Backup Before Changes
```bash
./backup-cursor-config.sh
```

### Verify Everything Works
```bash
./verify-cursor-bypass.sh
```

### Start Bridge Manually
```bash
./start_cursor_bridge.sh
```

## 📁 Backup Location

All backups: `~/.cursor-backups/`

**List backups**:
```bash
ls -lh ~/.cursor-backups/
```

**Restore specific backup**:
```bash
./restore-cursor-config.sh 20260103_203000
```

## 🔍 Quick Checks

**Bridge running?**
```bash
curl http://localhost:8080/health
```

**Ollama running?**
```bash
curl http://localhost:11434/api/tags
```

**View bridge status (web UI)**:
```bash
# Open in browser or:
curl http://localhost:8080/status
```

## 🎯 All Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `backup-cursor-config.sh` | Backup settings | Before changes, regularly |
| `restore-cursor-config.sh` | Restore from backup | Settings corrupted |
| `verify-cursor-bypass.sh` | Check status | Anytime |
| `fix-cursor-emergency.sh` | Emergency fix | Cursor broken, out of usage |
| `start_cursor_bridge.sh` | Start bridge | Bridge not running |
| `install-as-service.sh` | Auto-start bridge | Want bridge always running |

## ✅ Success Checklist

- [ ] Bridge running: `curl http://localhost:8080/health`
- [ ] Ollama running: `curl http://localhost:11434/api/tags`
- [ ] Settings configured: `./verify-cursor-bypass.sh`
- [ ] Backup created: `ls ~/.cursor-backups/`
- [ ] Cursor credits NOT increasing

---

**You're protected!** Even if Cursor breaks, you can fix it from terminal/Zed. 🎉

