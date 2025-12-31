# Self-Modifying Chatbot - Implementation Plan

## 🎯 **Goal**
Build a chatbot that can:
1. ✅ Edit code files (already works via DevChatbot)
2. ✅ Edit its own component file (`components/DevChatbot.tsx`)
3. ✅ Edit its own UI/styling
4. ✅ Trigger hot reload after self-modification
5. ✅ Be accessible via functional UI path

---

## ✅ **What Already Exists**

### 1. **DevChatbot Component** (`components/DevChatbot.tsx`)
- ✅ File read/write via `useFileSystem` hook
- ✅ Terminal command execution via `useTerminal` hook
- ✅ Accessible in Right Sidebar → "Dev Chat" tab
- ✅ Conversation history persistence
- ✅ Intent parsing (read, write, execute, list, search)

### 2. **File System Infrastructure**
- ✅ `services/fileSystemService.ts` - Backend file operations
- ✅ `services/fileSystemClient.ts` - Frontend API client
- ✅ `api/filesystem.js` - HTTP API routes
- ✅ `hooks/useFileSystem.ts` - React hook wrapper

### 3. **Hot Module Replacement**
- ✅ Vite HMR enabled in `vite.config.ts`
- ✅ File watcher configured
- ✅ Auto-reload on file changes

---

## 🔧 **What's Missing (Tools Needed)**

### 1. **AI/LLM Integration** ⚠️ **CRITICAL**
**Problem:** DevChatbot can read/write files but can't understand code or generate edits intelligently.

**Solution:** Integrate AI model (local or remote)

**Options:**
- **A) Local AI (Ollama)** - Already configured in MCP settings
  - Use `codellama:latest` or similar
  - Free, private, fast
  - Already set up in `config/mcpConfig.ts`

- **B) Remote API** - OpenAI, Anthropic, etc.
  - Requires API keys
  - More powerful models
  - Cost per request

**Implementation:**
```typescript
// services/aiCodeEditor.ts
export class AICodeEditor {
  async generateCodeEdit(
    filePath: string,
    currentCode: string,
    userRequest: string
  ): Promise<string> {
    // Use MCP/local AI to understand request and generate code changes
    const prompt = `You are a code editor. Given this file:
    
${currentCode}

User wants: ${userRequest}

Generate the complete updated file with the changes applied.`;
    
    return await this.callAI(prompt);
  }
}
```

### 2. **Code Understanding** ⚠️ **IMPORTANT**
**Problem:** Need to understand code structure to make intelligent edits.

**Tools Needed:**
- **A) AST Parser** (Babel, TypeScript Compiler API)
  - Parse code into Abstract Syntax Tree
  - Make precise edits
  - Validate syntax

- **B) Simple Pattern Matching** (Easier, less precise)
  - Regex-based edits
  - String replacement
  - Good enough for many cases

**Implementation:**
```typescript
// services/codeParser.ts
import * as ts from 'typescript';

export class CodeParser {
  parseFile(content: string): ts.SourceFile {
    return ts.createSourceFile(
      'file.tsx',
      content,
      ts.ScriptTarget.Latest,
      true
    );
  }
  
  findFunction(sourceFile: ts.SourceFile, name: string): ts.FunctionDeclaration | null {
    // Traverse AST to find function
  }
  
  replaceFunction(oldCode: string, newCode: string): string {
    // Replace function in source
  }
}
```

### 3. **Self-Awareness** ✅ **EASY**
**Problem:** Chatbot needs to know its own file path.

**Solution:**
```typescript
// In DevChatbot.tsx
const SELF_FILE_PATH = 'components/DevChatbot.tsx';

const handleSelfEdit = async (userRequest: string) => {
  // Read self
  const currentCode = await fileSystem.readFile(SELF_FILE_PATH);
  
  // Generate edit via AI
  const newCode = await aiCodeEditor.generateCodeEdit(
    SELF_FILE_PATH,
    currentCode,
    userRequest
  );
  
  // Write self
  await fileSystem.writeFile(SELF_FILE_PATH, newCode);
  
  // Trigger reload
  window.location.reload(); // Or use Vite HMR API
};
```

### 4. **Hot Reload Trigger** ✅ **EASY**
**Problem:** After editing its own file, need to reload.

**Solutions:**
- **A) Window Reload** (Simple)
  ```typescript
  window.location.reload();
  ```

- **B) Vite HMR API** (Better)
  ```typescript
  import.meta.hot?.send('vite:full-reload');
  ```

- **C) Component Remount** (Best)
  ```typescript
  // Force React to remount component
  setKey(prev => prev + 1);
  ```

### 5. **Safety Mechanisms** ⚠️ **CRITICAL**
**Problem:** Self-modification can break the app.

**Solutions:**
- **A) Backup Before Edit**
  ```typescript
  const backup = await fileSystem.readFile(SELF_FILE_PATH);
  await fileSystem.writeFile(`${SELF_FILE_PATH}.backup`, backup);
  ```

- **B) Syntax Validation**
  ```typescript
  const isValid = await validateTypeScript(newCode);
  if (!isValid) {
    throw new Error('Generated code has syntax errors');
  }
  ```

- **C) Rollback on Error**
  ```typescript
  try {
    await fileSystem.writeFile(SELF_FILE_PATH, newCode);
    // Test if app still works
  } catch (error) {
    // Rollback
    await fileSystem.writeFile(SELF_FILE_PATH, backup);
  }
  ```

- **D) Sandbox/Test Mode**
  ```typescript
  // Write to temp file first
  await fileSystem.writeFile('components/DevChatbot.temp.tsx', newCode);
  // User reviews before applying
  ```

---

## 🚀 **Implementation Steps**

### **Phase 1: AI Integration (Day 1-2)**

1. **Create AI Code Editor Service**
   ```bash
   # File: services/aiCodeEditor.ts
   ```
   - Use existing MCP/local AI setup
   - Create prompt templates for code editing
   - Handle AI responses

2. **Integrate into DevChatbot**
   - Add AI code editing handler
   - Add "edit code" intent parsing
   - Test with simple file edits

### **Phase 2: Self-Modification (Day 2-3)**

1. **Add Self-Awareness**
   - Define `SELF_FILE_PATH` constant
   - Add "edit myself" command handler
   - Add backup mechanism

2. **Add Hot Reload**
   - Trigger reload after self-edit
   - Add confirmation dialog
   - Test self-modification cycle

### **Phase 3: Safety & Polish (Day 3-4)**

1. **Add Safety Mechanisms**
   - Backup before edits
   - Syntax validation
   - Rollback on error
   - User confirmation

2. **UI Improvements**
   - Show edit preview
   - Show diff before applying
   - Add "undo last edit" feature

---

## 📋 **Quick Start: Make It Work Now**

### **Step 1: Add AI Integration to DevChatbot**

```typescript
// In DevChatbot.tsx, add:

import { mcpConfig } from '../config/mcpConfig';

const handleAIRequest = async (userInput: string): Promise<ChatMessage> => {
  // Use local Ollama if available
  if (mcpConfig.useLocalAI && mcpConfig.localAIProvider === 'ollama') {
    const response = await fetch(`${mcpConfig.localAIServerUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: mcpConfig.localAIModelName,
        prompt: userInput,
        stream: false
      })
    });
    
    const data = await response.json();
    return {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: data.response,
      timestamp: new Date()
    };
  }
  
  // Fallback to simple response
  return {
    id: `ai-${Date.now()}`,
    role: 'assistant',
    content: 'AI integration not configured. Please set up Ollama or API key.',
    timestamp: new Date()
  };
};
```

### **Step 2: Add Self-Modification Handler**

```typescript
// In DevChatbot.tsx, add:

const SELF_FILE_PATH = 'components/DevChatbot.tsx';

const handleSelfEdit = async (userRequest: string): Promise<ChatMessage> => {
  try {
    // Read self
    const currentCode = await fileSystem.readFile(SELF_FILE_PATH);
    
    // Backup
    await fileSystem.writeFile(
      `${SELF_FILE_PATH}.backup.${Date.now()}`,
      currentCode
    );
    
    // Generate edit (simplified - use AI in production)
    const newCode = await generateCodeEdit(currentCode, userRequest);
    
    // Write self
    await fileSystem.writeFile(SELF_FILE_PATH, newCode);
    
    // Reload
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
    return {
      id: `self-edit-${Date.now()}`,
      role: 'assistant',
      content: `✅ Modified myself! Reloading in 1 second...`,
      timestamp: new Date()
    };
  } catch (error) {
    return {
      id: `self-edit-error-${Date.now()}`,
      role: 'assistant',
      content: `❌ Failed to edit myself: ${error.message}`,
      timestamp: new Date()
    };
  }
};
```

### **Step 3: Update Intent Parser**

```typescript
// In parseIntent function, add:

if (input.toLowerCase().includes('edit myself') || 
    input.toLowerCase().includes('modify yourself')) {
  return { type: 'self-edit', request: input };
}
```

### **Step 4: Wire Up Handler**

```typescript
// In handleSend function, add:

if (intent.type === 'self-edit') {
  response = await handleSelfEdit(intent.request!);
}
```

---

## 🎯 **UI Access Path**

**Current:** Right Sidebar → "Dev Chat" tab ✅

**To Make It More Visible:**
1. Add keyboard shortcut: `Ctrl+K` or `Cmd+K` → Open Dev Chat
2. Add floating button in corner
3. Add to Welcome Screen as "AI Assistant"

---

## 📦 **Dependencies Needed**

### **Required:**
- ✅ File system access (already exists)
- ✅ AI/LLM integration (Ollama or API)
- ✅ Hot reload (Vite HMR - already exists)

### **Optional (for better code editing):**
- `@babel/parser` - AST parsing
- `typescript` - TypeScript compiler API
- `diff` - Show code diffs
- `prettier` - Format generated code

---

## 🚨 **Critical Safety Considerations**

1. **Never edit without backup**
2. **Validate syntax before applying**
3. **Test in sandbox first**
4. **User confirmation for self-edits**
5. **Rollback mechanism**
6. **Rate limiting** (prevent infinite edit loops)

---

## ✅ **Success Criteria**

- [ ] Chatbot can read any file
- [ ] Chatbot can write/edit any file
- [ ] Chatbot can edit its own file (`DevChatbot.tsx`)
- [ ] Chatbot triggers reload after self-edit
- [ ] Chatbot survives self-modification (doesn't break)
- [ ] UI path is clear and accessible
- [ ] Safety mechanisms prevent breaking changes

---

**Status:** Ready to implement. All infrastructure exists. Need AI integration and self-modification handlers.

