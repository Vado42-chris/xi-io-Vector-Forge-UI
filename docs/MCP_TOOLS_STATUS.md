# MCP Tools Status

## Available MCP Tools

### Configuration
- **config/mcpConfig.ts**: MCP protocol configuration
  - Default config with Ollama support
  - Local AI provider detection
  - Feature flags for completion, validation, documentation, suggestions

### Services
- **services/mcpScriptService.ts**: MCP script service
  - `getMCPCompletions()` - AI-powered code completions
  - `validateWithMCP()` - Script validation
  - `getMCPDocumentation()` - Command documentation
  - `getMCPCodeSuggestions()` - Code improvement suggestions
  - Local AI integration (Ollama, llama-cpp, text-generation-webui)

### Components
- **components/MCPSettings.tsx**: MCP settings panel
  - Auto-configures Ollama on startup
  - Model detection and selection
  - Connection testing
  - Feature toggles

## Integration Status

### Current Usage
- MCP tools are integrated into the ScriptEditor component
- Settings panel available in RightSidebar (Engine tab)
- Auto-detection of local AI providers (Ollama)

### Potential for Debugging
The MCP tools could be used to:
1. **Debug coordinate system**: Use AI to analyze coordinate conversion logic
2. **UI layout analysis**: Use AI to suggest layout fixes
3. **Error diagnosis**: Use AI to analyze console errors and suggest fixes
4. **Code quality**: Use validation features to check for issues

## Next Steps

1. **Test MCP integration**: Verify MCP tools are accessible and working
2. **Use for debugging**: Leverage MCP tools to diagnose UI issues
3. **Hybrid mode**: Use MCP tools in combination with Cursor's built-in tools
4. **Coordinate system validation**: Use MCP to verify coordinate calculations

## Coordinate System Status

### Files
- **lib/ourmaths/CoordinateFrame.ts**: Coordinate frame system
  - `CoordinateFrame` enum (WORLD, LOCAL, VIEWPORT, CANVAS)
  - `CoordinateConverter` class for frame transformations
  - Matrix-based transformations

- **utils/coordinateConverter.ts**: Integration utilities
  - `createCanvasCoordinateConverter()` - Creates converter from canvas state
  - `screenToWorld()` - Converts screen to world coordinates
  - `worldToScreen()` - Converts world to screen coordinates

### Recent Fixes
- Added `ResizeObserver` to track canvas dimension changes
- Added `canvasSize` state to force coordinate converter updates
- Fixed coordinate converter to handle zero dimensions

## Recommendations

1. **Use MCP for validation**: Run coordinate system calculations through MCP validation
2. **AI-assisted debugging**: Use MCP completions to suggest fixes for layout issues
3. **Documentation lookup**: Use MCP documentation feature to understand coordinate system better
4. **Code suggestions**: Use MCP suggestions to improve coordinate conversion code

