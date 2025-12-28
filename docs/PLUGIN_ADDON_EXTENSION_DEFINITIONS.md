# Plugin, Addon, and Extension Definitions
**Date:** January 27, 2025  
**Status:** Standard Definitions

---

## Purpose

This document defines what a **Plugin**, **Addon**, and **Extension** are in VectorForge, and establishes best practices for each.

---

## Definitions

### Plugin
**Definition:** A self-contained package that adds **new hashtag commands** and functionality to VectorForge.

**Characteristics:**
- ✅ Adds new hashtag commands (e.g., `#particle`, `#physics`)
- ✅ Can include assets (images, sounds, presets)
- ✅ Can extend existing commands
- ✅ Has manifest file (`plugin.json`)
- ✅ Can be published to marketplace
- ✅ Runs in sandboxed environment
- ✅ Has permissions system

**Example:** Particle System Plugin adds `#particle` command for creating particle effects.

**File Structure:**
```
plugin-name-1.0.0.vfplugin
├── plugin.json              # Manifest
├── commands/
│   └── particle.json        # New command definition
├── scripts/
│   └── particle-system.vfscript
├── assets/
│   └── icons/
└── README.md
```

**Best Practices:**
- Use semantic versioning (1.0.0)
- Include comprehensive documentation
- Test in sandbox before publishing
- Request minimal permissions
- Follow hashtag command syntax standards

---

### Addon
**Definition:** A **pre-configured collection** of assets, presets, or templates that extends VectorForge's content library.

**Characteristics:**
- ✅ Adds content (brushes, patterns, templates, presets)
- ✅ Does NOT add new commands
- ✅ Uses existing VectorForge functionality
- ✅ Can be installed/imported
- ✅ Can be shared between users
- ✅ Simpler than plugins (no code)

**Example:** "Watercolor Brush Pack" addon adds 50 watercolor brush presets.

**File Structure:**
```
addon-name-1.0.0.vfaddon
├── addon.json               # Manifest
├── brushes/
│   └── watercolor-*.json
├── patterns/
│   └── texture-*.svg
├── templates/
│   └── template-*.xibalba
└── README.md
```

**Best Practices:**
- Organize by content type (brushes, patterns, templates)
- Include preview images
- Document usage instructions
- Version control for updates
- Test compatibility with VectorForge versions

---

### Extension
**Definition:** A **modification or enhancement** to existing VectorForge functionality without adding new commands.

**Characteristics:**
- ✅ Modifies existing behavior
- ✅ Extends existing commands
- ✅ Adds UI enhancements
- ✅ Can hook into existing systems
- ✅ Runs alongside core functionality
- ✅ Can be enabled/disabled

**Example:** "Timeline Extension" adds advanced keyframe interpolation options to existing timeline.

**File Structure:**
```
extension-name-1.0.0.vfext
├── extension.json           # Manifest
├── hooks/
│   └── timeline-hooks.json  # Extension points
├── scripts/
│   └── interpolation.vfscript
└── README.md
```

**Best Practices:**
- Document what functionality is extended
- Test compatibility with core updates
- Use extension hooks/APIs
- Don't break existing functionality
- Version for compatibility

---

## Comparison Table

| Feature | Plugin | Addon | Extension |
|---------|--------|-------|-----------|
| **Adds Commands** | ✅ Yes | ❌ No | ❌ No |
| **Adds Content** | ✅ Yes | ✅ Yes | ❌ No |
| **Modifies Behavior** | ⚠️ Can | ❌ No | ✅ Yes |
| **Code Required** | ✅ Yes | ❌ No | ✅ Yes |
| **Sandboxed** | ✅ Yes | N/A | ⚠️ Depends |
| **Marketplace** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Permissions** | ✅ Yes | ❌ No | ⚠️ Limited |
| **Complexity** | High | Low | Medium |

---

## User Workflows

### Installing a Plugin
1. Browse marketplace or import local file
2. Review permissions
3. Install plugin
4. Plugin commands appear in command palette
5. Use new commands in scripts

### Installing an Addon
1. Browse marketplace or import local file
2. Install addon
3. Content appears in appropriate panels (brushes, patterns, etc.)
4. Use content in projects

### Installing an Extension
1. Browse marketplace or import local file
2. Review what it extends
3. Install extension
4. Extension hooks into existing functionality
5. Enhanced features available

---

## Developer Guidelines

### When to Create a Plugin
- Adding new hashtag commands
- Creating complex functionality
- Need sandboxed execution
- Want marketplace distribution

### When to Create an Addon
- Adding content (brushes, patterns, templates)
- No code required
- Simple distribution
- Content library expansion

### When to Create an Extension
- Enhancing existing features
- Modifying behavior
- Adding UI enhancements
- Hooking into existing systems

---

## Best Practices for All Types

### 1. Versioning
- Use semantic versioning (MAJOR.MINOR.PATCH)
- Document breaking changes
- Maintain changelog

### 2. Documentation
- Include README.md
- Document all features
- Provide examples
- Include screenshots/videos

### 3. Testing
- Test before publishing
- Test compatibility
- Test with different VectorForge versions
- Test error cases

### 4. Security
- Request minimal permissions
- Sandbox execution (plugins)
- Validate inputs
- Don't access sensitive data

### 5. Performance
- Optimize code
- Lazy load assets
- Don't block UI
- Resource limits

---

## Installation & Management

### Installation Methods
1. **Marketplace** - Browse and install from within VectorForge
2. **Local File** - Import .vfplugin, .vfaddon, or .vfext file
3. **URL** - Install from URL (future)

### Management UI
- **Settings → Plugins** - Manage plugins
- **Settings → Addons** - Manage addons
- **Settings → Extensions** - Manage extensions

### Features
- Enable/disable
- Update
- Uninstall
- View details
- Check for updates

---

## File Formats

### Plugin Format: `.vfplugin`
- ZIP archive
- Contains plugin.json manifest
- Contains commands, scripts, assets

### Addon Format: `.vfaddon`
- ZIP archive
- Contains addon.json manifest
- Contains content files

### Extension Format: `.vfext`
- ZIP archive
- Contains extension.json manifest
- Contains hooks, scripts

---

## Marketplace Integration

### Submission Process
1. Develop plugin/addon/extension
2. Package into .vfplugin/.vfaddon/.vfext
3. Submit to marketplace
4. Automated review (security, compatibility)
5. Manual review (quality, documentation)
6. Approval and publishing

### Pricing
- **Free** - No cost
- **Paid** - Credits or subscription
- **Freemium** - Free with paid features

---

## Future Enhancements

### Planned Features
- [ ] Plugin dependencies
- [ ] Plugin versioning/updates
- [ ] Developer dashboard
- [ ] Analytics for developers
- [ ] Code signing
- [ ] Plugin templates

---

**Last Updated:** January 27, 2025  
**Status:** Definitions established, implementation in progress

