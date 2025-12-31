# Molting Chatbot Architecture
**Self-Modifying AI with Safe Body Swapping**

## 🐍 **The Molting Metaphor**

Like a snake shedding its skin or a spider changing its hardened shell:
1. **Grow new body** → Edit a working copy (`DevChatbot.new.tsx`)
2. **Test new body** → Validate it works
3. **Swap bodies** → Atomic file swap (old → backup, new → active)
4. **Shed old body** → Keep backup for rollback

---

## 🎯 **Core Requirements**

### **1. Working Chatbot with Code Editing** ✅ (Partially Exists)
- ✅ DevChatbot component exists
- ✅ File system access (read/write)
- ⚠️ Need: AI integration for intelligent code generation

### **2. Functional UI Path** ✅ (Exists)
- ✅ Right Sidebar → "Dev Chat" tab
- ⚠️ Need: Make it more discoverable (keyboard shortcut, floating button)

### **3. Self-Modification Capability** ⚠️ (Needs Implementation)
- ⚠️ Need: Edit own component file
- ⚠️ Need: Edit own UI/styling
- ⚠️ Need: Molting mechanism

### **4. Molting System** ❌ (Needs Implementation)
- ❌ Write to working copy
- ❌ Validate/test new version
- ❌ Atomic swap mechanism
- ❌ Rollback on failure

---

## 🛠️ **Tools Needed**

### **1. AI/LLM Integration** ⚠️ **CRITICAL**

**Options:**
- **A) Local Ollama** (Recommended - Already configured)
  - `codellama:latest` or `deepseek-coder:latest`
  - Free, private, fast
  - Already in `config/mcpConfig.ts`

- **B) Remote API** (OpenAI, Anthropic)
  - More powerful
  - Requires API key
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
    const prompt = `You are a TypeScript/React code editor. Given this file:

\`\`\`tsx
${currentCode}
\`\`\`

User wants: ${userRequest}

Generate the complete updated file with changes applied. Ensure:
- Valid TypeScript/React syntax
- Proper imports
- No syntax errors
- Maintains existing functionality unless explicitly changed

Return ONLY the complete file code, no explanations.`;
    
    // Use Ollama or API
    return await this.callAI(prompt);
  }
}
```

### **2. Molting Service** ❌ **NEW - CRITICAL**

**Purpose:** Manage the body-swapping mechanism

**File:** `services/moltingService.ts`

```typescript
export class MoltingService {
  /**
   * Create a working copy (new body)
   */
  async createWorkingCopy(filePath: string): Promise<string> {
    const workingCopyPath = `${filePath}.new`;
    const currentCode = await fileSystem.readFile(filePath);
    await fileSystem.writeFile(workingCopyPath, currentCode);
    return workingCopyPath;
  }

  /**
   * Edit the working copy (grow new body)
   */
  async editWorkingCopy(
    workingCopyPath: string,
    userRequest: string
  ): Promise<void> {
    const currentCode = await fileSystem.readFile(workingCopyPath);
    const newCode = await aiCodeEditor.generateCodeEdit(
      workingCopyPath,
      currentCode,
      userRequest
    );
    await fileSystem.writeFile(workingCopyPath, newCode);
  }

  /**
   * Validate the working copy (test new body)
   */
  async validateWorkingCopy(workingCopyPath: string): Promise<boolean> {
    try {
      // 1. Syntax validation
      const code = await fileSystem.readFile(workingCopyPath);
      const isValid = await this.validateSyntax(code);
      if (!isValid) return false;

      // 2. TypeScript compilation check
      const compiles = await this.checkTypeScript(workingCopyPath);
      if (!compiles) return false;

      // 3. Import validation
      const importsValid = await this.validateImports(workingCopyPath);
      if (!importsValid) return false;

      return true;
    } catch (error) {
      console.error('Validation failed:', error);
      return false;
    }
  }

  /**
   * Swap bodies (atomic file swap)
   */
  async swapBodies(filePath: string): Promise<void> {
    const workingCopyPath = `${filePath}.new`;
    const backupPath = `${filePath}.backup.${Date.now()}`;

    // 1. Backup current version
    const currentCode = await fileSystem.readFile(filePath);
    await fileSystem.writeFile(backupPath, currentCode);

    // 2. Atomic swap: new → active
    const newCode = await fileSystem.readFile(workingCopyPath);
    await fileSystem.writeFile(filePath, newCode);

    // 3. Clean up working copy
    await fileSystem.deleteFile(workingCopyPath);

    // 4. Trigger reload
    this.triggerReload();
  }

  /**
   * Rollback to previous body
   */
  async rollback(filePath: string): Promise<void> {
    // Find latest backup
    const backups = await fileSystem.listDirectory('.').then(files =>
      files.filter(f => f.name.startsWith(`${filePath}.backup.`))
    );
    
    if (backups.length === 0) {
      throw new Error('No backup found');
    }

    const latestBackup = backups.sort().reverse()[0];
    const backupCode = await fileSystem.readFile(latestBackup.name);
    await fileSystem.writeFile(filePath, backupCode);
    this.triggerReload();
  }

  private triggerReload(): void {
    // Option 1: Full page reload
    setTimeout(() => window.location.reload(), 1000);

    // Option 2: Vite HMR (better)
    // import.meta.hot?.send('vite:full-reload');
  }
}
```

### **3. Code Validation Tools** ⚠️ **IMPORTANT**

**Options:**

**A) TypeScript Compiler API** (Best)
```typescript
import * as ts from 'typescript';

async validateSyntax(code: string): Promise<boolean> {
  const sourceFile = ts.createSourceFile(
    'temp.tsx',
    code,
    ts.ScriptTarget.Latest,
    true
  );
  
  // Check for syntax errors
  const diagnostics = ts.getPreEmitDiagnostics(
    ts.createProgram(['temp.tsx'], {
      target: ts.ScriptTarget.Latest,
      jsx: ts.JsxEmit.React
    })
  );
  
  return diagnostics.length === 0;
}
```

**B) Simple Regex Validation** (Easier, less precise)
```typescript
async validateSyntax(code: string): Promise<boolean> {
  // Check for balanced braces, parentheses
  const braces = (code.match(/{/g) || []).length === (code.match(/}/g) || []).length;
  const parens = (code.match(/\(/g) || []).length === (code.match(/\)/g) || []).length;
  const brackets = (code.match(/\[/g) || []).length === (code.match(/\]/g) || []).length;
  
  return braces && parens && brackets;
}
```

**C) ESLint/Prettier** (Good middle ground)
```typescript
import { ESLint } from 'eslint';

async validateSyntax(code: string): Promise<boolean> {
  const eslint = new ESLint();
  const results = await eslint.lintText(code);
  return results[0].errorCount === 0;
}
```

### **4. File System Extensions** ⚠️ **NEEDED**

**Add to `fileSystemService.ts`:**
```typescript
async deleteFile(path: string): Promise<void> {
  const fullPath = this.validatePath(path);
  await fs.unlink(fullPath);
}

async copyFile(source: string, dest: string): Promise<void> {
  const sourcePath = this.validatePath(source);
  const destPath = this.validatePath(dest);
  await fs.copyFile(sourcePath, destPath);
}

async fileExists(path: string): Promise<boolean> {
  try {
    const fullPath = this.validatePath(path);
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}
```

### **5. DevChatbot Self-Modification Handler** ❌ **NEW**

**Add to `components/DevChatbot.tsx`:**

```typescript
import { MoltingService } from '../services/moltingService';

const SELF_FILE_PATH = 'components/DevChatbot.tsx';
const moltingService = new MoltingService();

const handleSelfModification = async (userRequest: string): Promise<ChatMessage> => {
  try {
    // Step 1: Create working copy (grow new body)
    const workingCopyPath = await moltingService.createWorkingCopy(SELF_FILE_PATH);
    
    // Step 2: Edit working copy
    await moltingService.editWorkingCopy(workingCopyPath, userRequest);
    
    // Step 3: Validate working copy (test new body)
    const isValid = await moltingService.validateWorkingCopy(workingCopyPath);
    
    if (!isValid) {
      // Clean up invalid working copy
      await fileSystem.deleteFile(workingCopyPath);
      return {
        id: `self-edit-invalid-${Date.now()}`,
        role: 'assistant',
        content: `❌ Generated code failed validation. Changes not applied. Please try a different request.`,
        timestamp: new Date()
      };
    }
    
    // Step 4: Show preview and ask for confirmation
    const newCode = await fileSystem.readFile(workingCopyPath);
    const preview = newCode.substring(0, 500) + '...';
    
    // Step 5: Swap bodies (atomic swap)
    await moltingService.swapBodies(SELF_FILE_PATH);
    
    return {
      id: `self-edit-success-${Date.now()}`,
      role: 'assistant',
      content: `✅ Successfully modified myself! New body validated and swapped. Reloading in 1 second...\n\nPreview:\n\`\`\`tsx\n${preview}\n\`\`\``,
      timestamp: new Date()
    };
  } catch (error) {
    return {
      id: `self-edit-error-${Date.now()}`,
      role: 'assistant',
      content: `❌ Failed to modify myself: ${error instanceof Error ? error.message : 'Unknown error'}\n\nOld body preserved. You can try again.`,
      timestamp: new Date()
    };
  }
};

// Update parseIntent to detect self-modification requests
const parseIntent = (input: string) => {
  // ... existing code ...
  
  // Detect self-modification
  if (
    input.toLowerCase().includes('edit yourself') ||
    input.toLowerCase().includes('modify yourself') ||
    input.toLowerCase().includes('change yourself') ||
    input.toLowerCase().includes('update yourself') ||
    input.toLowerCase().includes('improve yourself') ||
    (input.toLowerCase().includes('edit') && input.toLowerCase().includes('devchatbot'))
  ) {
    return { type: 'self-modify', request: input };
  }
  
  // ... rest of parsing ...
};

// Update handleSend to call self-modification
if (intent.type === 'self-modify') {
  response = await handleSelfModification(intent.request!);
}
```

---

## 🚀 **Implementation Priority**

### **Phase 1: Core Molting System (Day 1-2)**
1. ✅ Create `MoltingService`
2. ✅ Add file system extensions (delete, copy, exists)
3. ✅ Add basic validation (syntax checking)
4. ✅ Integrate into DevChatbot

### **Phase 2: AI Integration (Day 2-3)**
1. ✅ Create `AICodeEditor` service
2. ✅ Connect to Ollama (local AI)
3. ✅ Test code generation
4. ✅ Improve prompts for better code quality

### **Phase 3: Safety & Polish (Day 3-4)**
1. ✅ Add TypeScript validation
2. ✅ Add preview before swap
3. ✅ Add rollback mechanism
4. ✅ Add UI improvements (keyboard shortcut, floating button)

---

## 📦 **Dependencies to Install**

```bash
# For TypeScript validation (optional but recommended)
npm install typescript --save-dev

# For code formatting (optional)
npm install prettier --save-dev

# For linting (optional)
npm install eslint --save-dev
```

**Note:** Ollama should already be set up. If not:
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull codellama:latest
```

---

## 🎯 **UI Access Path**

**Current:** Right Sidebar → "Dev Chat" tab ✅

**Improvements:**
1. **Keyboard Shortcut:** `Ctrl+K` or `Cmd+K` → Open Dev Chat
2. **Floating Button:** Bottom-right corner → "AI Assistant"
3. **Welcome Screen:** Add "Start AI Assistant" button

---

## 🐍 **The Molting Flow**

```
User: "Edit yourself to add a new feature"

1. [Grow New Body]
   DevChatbot.tsx → DevChatbot.tsx.new
   (Copy current code)

2. [Modify New Body]
   AI generates new code
   Write to DevChatbot.tsx.new

3. [Test New Body]
   Validate syntax ✓
   Check TypeScript ✓
   Validate imports ✓

4. [Swap Bodies]
   DevChatbot.tsx → DevChatbot.tsx.backup.1234567890
   DevChatbot.tsx.new → DevChatbot.tsx
   (Atomic swap)

5. [Shed Old Body]
   Trigger reload
   New body is now active
   Old body kept as backup for rollback
```

---

## ✅ **Success Criteria**

- [ ] Chatbot can edit any code file
- [ ] Chatbot can edit its own component (`DevChatbot.tsx`)
- [ ] Molting system creates working copy
- [ ] Validation prevents broken code
- [ ] Atomic swap mechanism works
- [ ] Rollback available if new body fails
- [ ] UI path is clear and accessible
- [ ] Chatbot survives self-modification

---

**Status:** Ready to implement. All infrastructure exists. Need molting service and AI integration.

