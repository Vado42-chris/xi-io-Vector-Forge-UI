# @xibalba/design-system

Reusable design system components for the Xibalba ecosystem.

## Status

🚧 **Phase 2: Package Extraction** - Currently using shim re-exports from VectorForge.

## Components

- **ActionCenter** - MAI (Most Actionable Item) framework
- **Tooltip** - Contextual help with keyboard shortcuts
- **AdvancedSection** - Progressive disclosure
- **useMAI** - Context-aware action detection hook

## Usage

```tsx
import { ActionCenter, useMAI, Tooltip } from '@xibalba/design-system';

// Use components as normal
```

## Development

```bash
# Build package
npm run build:design-system

# Watch mode
npm run dev --workspace=@xibalba/design-system
```

## Migration Plan

Phase 2a (Current): Shim package with re-exports  
Phase 2b (Next): Move actual component files to package  
Phase 2c (Final): Update all imports in VectorForge

## License

MIT
