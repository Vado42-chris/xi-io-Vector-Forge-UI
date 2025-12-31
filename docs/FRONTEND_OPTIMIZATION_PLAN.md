# Frontend Optimization Plan - Learning from VS Code & Adobe

**Date:** January 27, 2025  
**Status:** 🎯 **STRATEGIC PLAN**

---

## Current Issues

### Critical Errors
1. **DraftsmanCanvas.tsx:** Hooks in render (fixed)
2. **Build Errors:** Need validation
3. **UI Not Loading:** 500 errors on components
4. **Browser Validation:** Can't see UI in Cursor browser

### Architecture Issues
1. **Tight Coupling:** Components know about each other
2. **Hardcoded Layouts:** Not flexible
3. **No Panel System:** Panels not modular
4. **No Activity System:** Can't switch contexts
5. **No Command System:** Actions scattered

---

## VS Code Patterns to Adopt

### 1. Activity Bar + Sidebar
```typescript
// Activity-based navigation
enum Activity {
  DESIGN = 'design',    // Tools, Layers, Properties
  CODE = 'code',        // Scripts, Terminal, Console
  PREVIEW = 'preview',  // Preview, Export, Share
  SETTINGS = 'settings' // Preferences, Extensions
}

// Each activity has different sidebar content
const activitySidebars = {
  [Activity.DESIGN]: [LeftSidebar, RightSidebar],
  [Activity.CODE]: [ScriptEditor, Terminal, Console],
  [Activity.PREVIEW]: [PreviewPanel, ExportPanel],
  [Activity.SETTINGS]: [PreferencesPanel]
};
```

### 2. Panel System
```typescript
// Modular panel interface
interface Panel {
  id: string;
  title: string;
  component: React.ComponentType;
  defaultPosition: 'left' | 'right' | 'bottom' | 'floating';
  canDock: boolean;
  canResize: boolean;
  minSize: { width: number; height: number };
  maxSize: { width: number; height: number };
}

// Panel registry
class PanelRegistry {
  private panels: Map<string, Panel> = new Map();
  
  register(panel: Panel) {
    this.panels.set(panel.id, panel);
  }
  
  getPanel(id: string): Panel | undefined {
    return this.panels.get(id);
  }
  
  getAllPanels(): Panel[] {
    return Array.from(this.panels.values());
  }
}
```

### 3. Tab System
```typescript
// Tab management
interface Tab {
  id: string;
  label: string;
  icon?: string;
  component: React.ComponentType;
  closable: boolean;
  pinned: boolean;
}

// Tab container
interface TabContainer {
  id: string;
  tabs: Tab[];
  activeTabId: string;
  position: 'left' | 'right' | 'bottom';
}
```

### 4. Command System
```typescript
// Command registry
interface Command {
  id: string;
  label: string;
  shortcut?: string;
  handler: () => void;
  enabled?: () => boolean;
  visible?: () => boolean;
}

class CommandRegistry {
  private commands: Map<string, Command> = new Map();
  
  register(command: Command) {
    this.commands.set(command.id, command);
  }
  
  execute(commandId: string) {
    const command = this.commands.get(commandId);
    if (command && command.enabled?.()) {
      command.handler();
    }
  }
  
  getCommands(): Command[] {
    return Array.from(this.commands.values());
  }
}
```

---

## Adobe Illustrator Patterns

### 1. Tool Palette
- **Persistent:** Always visible
- **Context-Sensitive:** Tools change based on selection
- **Grouped:** Related tools together
- **Keyboard Shortcuts:** Single key activation

### 2. Properties Panel
- **Context-Aware:** Shows properties of selected object
- **Grouped Sections:** Appearance, Transform, Effects
- **Live Preview:** Changes visible immediately
- **Presets:** Save/load property sets

### 3. Layers Panel
- **Hierarchical:** Groups and sublayers
- **Visual Indicators:** Visibility, lock, selection
- **Drag & Drop:** Reorder layers
- **Context Menu:** Right-click actions

### 4. Multiple Artboards
- **Tabbed:** Switch between artboards
- **Independent:** Each artboard has own layers
- **Navigation:** Quick switch between artboards

---

## Implementation Roadmap

### Sprint 1: Fix Critical Errors (Now)
1. ✅ Fix DraftsmanCanvas hooks issue
2. ⏳ Fix all build errors
3. ⏳ Validate UI loads
4. ⏳ Test in browser

### Sprint 2: Panel System (Next)
1. Create `PanelRegistry` service
2. Create `DockablePanel` component (already exists, enhance)
3. Create `TabContainer` component
4. Migrate existing panels to new system

### Sprint 3: Activity System
1. Create `ActivityBar` component
2. Create activity switching logic
3. Create activity-specific layouts
4. Persist activity state

### Sprint 4: Command System
1. Create `CommandRegistry` service
2. Create `CommandPalette` component
3. Register all actions as commands
4. Add keyboard shortcuts

### Sprint 5: Optimization
1. Code splitting by activity
2. Lazy load panels
3. Virtual scrolling for large lists
4. Performance monitoring

---

## Modularity Principles

### 1. **Isolation**
- Each panel is independent
- No direct imports between panels
- Communication via events/state

### 2. **Composition**
- Build complex UIs from simple components
- Reusable panel components
- Flexible layouts

### 3. **Extensibility**
- Easy to add new panels
- Plugin system
- Custom activities

### 4. **Performance**
- Lazy load panels
- Code splitting
- Virtual scrolling

### 5. **User Control**
- Customizable layouts
- Persistent preferences
- Keyboard-first navigation

---

## Next Steps

1. **Fix DraftsmanCanvas** ✅ (Done)
2. **Fix build errors** ⏳ (In progress)
3. **Validate UI loads** ⏳ (Next)
4. **Implement Panel System** ⏳ (After validation)
5. **Add Activity System** ⏳ (After panels)
6. **Add Command System** ⏳ (After activities)

---

## Success Metrics

- ✅ UI loads without errors
- ✅ All panels modular and dockable
- ✅ Activities switch smoothly
- ✅ Commands accessible via palette
- ✅ Performance: <100ms panel switch
- ✅ User can customize layout

