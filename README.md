# VectorForge - Professional Vector Graphics Editor

<div align="center">
  <h3>Web-based vector graphics editor with animation capabilities</h3>
  <p>Built with React, TypeScript, and the Xibalba Framework</p>
</div>

## What is VectorForge?

VectorForge is a **team-based professional vector graphics editor** that runs in your web browser. Think Adobe Illustrator meets Flash, built for the modern web with React and TypeScript. VectorForge is designed for both solo creators and teams, with integrated task management, sprint planning, and collaboration features as core baseline functionality.

### Key Features

- 🎨 **Vector Drawing Tools** - Create shapes, paths, and illustrations
- 🎬 **Animation Timeline** - Animate your vector graphics with keyframes
- 👥 **Team Collaboration** - Built-in task management, sprint planning, and document management
- 📋 **Action Center** - Surfaces highest-priority team actions and workflows
- 🧩 **Modular Architecture** - Extensible plugin system (planned)
- 🔒 **Security First** - Code sandboxing and secure execution
- 🎯 **Professional UI** - Adobe-level interface with customizable layouts
- 🤖 **AI Integration** - Local AI support for creative assistance
- 🔌 **API Black Hole** - Unified API abstraction for team workflows

## Current Status

**Version:** 0.0.0 (Pre-Alpha)  
**Status:** Core infrastructure complete, feature development in progress  
**Completion:** ~35% of MVP features

### What Works Now

✅ Basic vector drawing (rectangle, ellipse, paths)  
✅ Layer management  
✅ Animation timeline UI  
✅ File operations (new, save, open)  
✅ Workflow layout switching  
✅ Error logging & diagnostics  
✅ **Team collaboration** - Task management, sprint planning, Action Center  
✅ **Task-to-VectorForge linking** - Link tasks to layers, keyframes, scripts  

### What's Coming

🔄 Complete drawing tool suite  
🔄 Animation interpolation & export  
🔄 Advanced path operations  
🔄 Plugin system & marketplace  
🔄 Enhanced team collaboration features  

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Vado42-chris/xi-io-Vector-Forge-UI.git
cd xi-io-Vector-Forge-UI

# Install dependencies
npm install

# Set up environment (optional)
cp .env.example .env.local
# Add your GEMINI_API_KEY if using AI features

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Project Structure

```
vectorforge/
├── components/          # React components (51 files)
├── services/            # Business logic services (29 files)
├── types/               # TypeScript type definitions
├── styles/              # CSS and styling
├── data/                # Static data (registry, layouts)
├── docs/                # Documentation
├── architecture/        # Architecture documentation
└── scripts/             # Build and utility scripts
```

## Documentation

**📚 [Complete Documentation Index](docs/DOCUMENTATION_INDEX.md)** - Start here!

### Quick Links

**For Users:**
- [User Guide](docs/USER_GUIDE.md) - How to use VectorForge
- [Development Cycle](docs/DEVELOPMENT_CYCLE.md) - Understanding development

**For Developers:**
- [Developer Guide](docs/DEVELOPER_GUIDE.md) - Architecture and patterns
- [GitHub Handoff](docs/GITHUB_HANDOFF.md) - Continuing development
- [Build Failures](docs/BUILD_FAILURES_AND_FIXES.md) - Known issues

**For Project Management:**
- [Feature Completion](docs/FEATURE_COMPLETION_ASSESSMENT.md) - What's done (35% MVP)
- [Project Status](docs/PROJECT_STATUS.md) - Current state
- [Feature Roadmap](docs/FEATURE_ROADMAP.md) - What's planned

**For Design/UX:**
- [Educational Usability](docs/EDUCATIONAL_USABILITY.md) - Usability principles
- [Architecture](architecture/MODULAR_DESIGN.md) - System design

## Technology Stack

- **Frontend:** React 18, TypeScript 5.8
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS + Custom Xibalba Framework
- **State Management:** React Hooks
- **Vector Graphics:** SVG
- **Animation:** Custom timeline system

## Contributing

This project is in active development. See [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) for contribution guidelines.

## License

[Add your license here]

## Support

For issues, feature requests, or questions:
- Check the [documentation](docs/)
- Review [known issues](docs/PROJECT_STATUS.md#known-issues)
- Open an issue on GitHub

## Roadmap

See [FEATURE_ROADMAP.md](docs/FEATURE_ROADMAP.md) for detailed roadmap.

---

**Built with ❤️ using the Xibalba Framework**
