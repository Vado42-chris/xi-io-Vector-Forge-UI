# VectorForge Installer Guide

## 📦 Packaged Installers

VectorForge now includes a complete installer builder that creates multiple package formats for easy distribution and installation.

## Building Installers

### Quick Build

```bash
npm run build:installer
```

Or build everything at once:

```bash
npm run package
```

This will:
1. Build the production application
2. Create all available installer formats
3. Output to `dist-installer/` directory

## Installer Formats

### 1. Self-Extracting Installer (Linux)

**File**: `install-vectorforge.sh`

A single-file installer that:
- Checks for Node.js 18+
- Extracts and installs VectorForge
- Creates desktop entry
- Sets up launcher script
- Configures Xibalba AI

**Usage**:
```bash
chmod +x install-vectorforge.sh
./install-vectorforge.sh
```

**Installation Location**: `~/.local/share/vectorforge`

**Launcher**: `vectorforge` (added to `~/.local/bin`)

### 2. Debian Package (.deb)

**File**: `vectorforge_<version>_<arch>.deb`

Native Debian/Ubuntu package that:
- Installs system-wide
- Creates desktop entry
- Registers with package manager
- Can be uninstalled with `dpkg -r`

**Usage**:
```bash
sudo dpkg -i vectorforge_0.0.0_amd64.deb
# If dependencies missing:
sudo apt-get install -f
```

**Installation Location**: `/usr/share/vectorforge`

**Launcher**: `vectorforge` (system-wide)

### 3. Portable Tarball

**File**: `vectorforge-portable-<version>.tar.gz`

Portable package that:
- No installation required
- Extract and run
- Perfect for USB deployment
- Works on any Linux system

**Usage**:
```bash
tar -xzf vectorforge-portable-0.0.0.tar.gz
cd vectorforge-portable
./launch.sh
```

**Requirements**: Node.js 18+ and `serve` package

## Installation Methods

### Method 1: Self-Extracting Installer (Recommended)

```bash
# Download installer
chmod +x install-vectorforge.sh

# Run installer
./install-vectorforge.sh

# Launch
vectorforge
```

### Method 2: Debian Package

```bash
# Install
sudo dpkg -i vectorforge_0.0.0_amd64.deb

# Fix dependencies if needed
sudo apt-get install -f

# Launch
vectorforge
```

### Method 3: Portable (USB Deployment)

```bash
# Extract
tar -xzf vectorforge-portable-0.0.0.tar.gz
cd vectorforge-portable

# Install serve if needed
npm install -g serve

# Launch
./launch.sh
```

## Post-Installation

### Configure Xibalba AI

After installation, configure Xibalba AI:

```bash
# Edit configuration
nano ~/.local/share/vectorforge/.env.local
```

Or for system-wide installation:
```bash
sudo nano /usr/share/vectorforge/.env.local
```

Configuration options:
```env
VITE_XIBALBA_MCP_URL=http://localhost:8000
VITE_XIBALBA_API_KEY=your_key_here
VITE_XIBALBA_MODEL=xibalba-local
VITE_XIBALBA_ENDPOINT=/api/v1/chat/completions
```

### Verify Installation

```bash
# Check if installed
which vectorforge

# Check version
vectorforge --version  # (if implemented)

# Launch
vectorforge
```

## Uninstallation

### Self-Extracting Installer

```bash
# Remove files
rm -rf ~/.local/share/vectorforge
rm ~/.local/bin/vectorforge
rm ~/.local/share/applications/vectorforge.desktop

# Update desktop database
update-desktop-database ~/.local/share/applications
```

### Debian Package

```bash
sudo dpkg -r vectorforge
```

### Portable

Simply delete the extracted directory.

## USB Deployment

### Creating USB Package

1. **Build portable tarball**:
   ```bash
   npm run build:installer
   ```

2. **Copy to USB**:
   ```bash
   cp dist-installer/vectorforge-portable-*.tar.gz /media/usb/
   ```

3. **On target machine**:
   ```bash
   cd /media/usb
   tar -xzf vectorforge-portable-*.tar.gz
   cd vectorforge-portable
   ./launch.sh
   ```

## Requirements

### Runtime Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: Included with Node.js
- **serve**: Auto-installed on first run (or: `npm install -g serve`)

### Build Requirements

- Node.js 18+
- npm
- `dpkg-deb` (for .deb packages, optional)

## Troubleshooting

### Installer Fails

**Issue**: "Node.js not found"
- **Solution**: Install Node.js 18+ from https://nodejs.org/

**Issue**: "Extraction failed"
- **Solution**: Ensure installer has execute permissions: `chmod +x install-vectorforge.sh`

### Launch Fails

**Issue**: "serve not found"
- **Solution**: `npm install -g serve`

**Issue**: "Port already in use"
- **Solution**: Set different port: `PORT=3001 vectorforge`

### .deb Package Issues

**Issue**: "Architecture mismatch"
- **Solution**: The installer auto-detects architecture. For manual fix, rebuild with correct arch.

**Issue**: "Dependencies not satisfied"
- **Solution**: `sudo apt-get install -f` to fix dependencies

## Custom Installation

### Custom Install Directory

```bash
INSTALL_DIR=/opt/vectorforge ./install-vectorforge.sh
```

### Custom Binary Directory

```bash
BIN_DIR=/usr/local/bin ./install-vectorforge.sh
```

## Distribution

### For End Users

Provide the **self-extracting installer** (`install-vectorforge.sh`):
- Single file
- Easy to download
- No extraction needed
- Automatic setup

### For System Administrators

Provide the **.deb package**:
- Native package management
- System-wide installation
- Easy updates
- Proper uninstallation

### For Portable Use

Provide the **portable tarball**:
- No installation
- USB-ready
- Extract and run
- Perfect for demos

## Build Output

After building, check `dist-installer/`:

```
dist-installer/
├── install-vectorforge.sh          # Self-extracting installer
├── vectorforge_0.0.0_amd64.deb     # Debian package
└── vectorforge-portable-0.0.0.tar.gz # Portable tarball
```

## Summary

✅ **Self-Extracting**: Easiest for end users  
✅ **Debian Package**: Best for system integration  
✅ **Portable**: Perfect for USB/demo deployment  

All installers include:
- Production build
- Xibalba AI configuration
- Desktop integration
- Launcher scripts
- Complete documentation

Your VectorForge is ready for distribution! 🚀

