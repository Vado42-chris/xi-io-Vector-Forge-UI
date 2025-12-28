# VectorForge Architecture Documentation

## System Architecture

VectorForge is a modular vector editing application built with React, TypeScript, and Vite.

## Technology Stack

- **Frontend**: React 18.3.1
- **Build Tool**: Vite 6.2.0
- **Language**: TypeScript 5.8.2
- **Styling**: Tailwind CSS + Custom CSS
- **State Management**: React Hooks + Services

## Project Structure

```
vectorforge/
├── architecture/          # Architecture documentation
├── components/           # React UI components
├── services/             # Business logic services
├── types/                # TypeScript type definitions
├── data/                 # Configuration and registry data
├── docs/                 # Documentation
├── installer/            # USB installer scripts
├── issues/               # Issue tracking
└── styles/              # CSS and styling
```

## Core Services

### API Service
Handles all external API communication.

### Checkpoint Service
Prevents information loss by creating state checkpoints.

### Focus Manager
Keeps AI agents on target and tracks progress.

### Product Registry
Catalogs all components and their relationships.

### Workflow Layout Service
Manages UI layouts and panel arrangements.

### Security Service
Handles security validation and code sandboxing.

### Error Services
- Error Logger - Logs all errors
- Error Reporter - Reports errors
- Error Intelligence - Analyzes and suggests fixes

## Component Architecture

Components are organized by:
- **Feature** - Related functionality grouped together
- **Reusability** - Shared components in common locations
- **Isolation** - Each component is self-contained

## Data Flow

1. User interaction → Component
2. Component → Service
3. Service → API/State
4. State → Component update
5. Component → UI render

## Error Handling Architecture

1. **Error occurs** → Caught by error boundary
2. **Error logged** → Error logger service
3. **Error analyzed** → Error intelligence service
4. **Fix suggested** → Error dashboard
5. **Fix applied** → Repair tools or manual fix

## Deployment Architecture

### Development
- Vite dev server (localhost:3000)
- Hot module replacement
- Source maps enabled

### Production
- Vite build (optimized bundle)
- Static assets
- Service worker (optional)

### USB Installation
- Installer script
- Application files
- Dependencies
- Error tracking tools
- Repair tools
- Documentation

## Security Architecture

- Content Security Policy (CSP)
- Code sandboxing
- Input validation
- Secure API communication
- Error sanitization

## Performance Architecture

- Code splitting
- Lazy loading
- Asset optimization
- Caching strategies
- Progressive enhancement

## Testing Architecture

- Unit tests (services)
- Integration tests (components)
- Browser tests (full UI)
- Error scenario tests
- Performance tests

## Monitoring Architecture

- Error tracking
- Performance monitoring
- User analytics
- Usage patterns
- Error patterns

## Future Enhancements

- Plugin system
- Marketplace integration
- Cloud sync
- Collaborative editing
- AI-powered features
