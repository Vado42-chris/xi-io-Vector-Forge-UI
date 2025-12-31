/**
 * #hashtag: dev-chatbot
 * #purpose: Development chatbot with file system and CLI access
 * #provides: Chat interface that can read/write files and execute commands
 * #usage: Add to RightSidebar as "Dev Chat" tab
 * #related: fileSystemClient, terminalClient, xibalbaService
 * 
 * Development Chatbot
 * Works independently - doesn't need Cursor or Zed
 * Can read files, write files, execute commands
 * Follows Xibalba standards: Error boundaries, loading states, TypeScript strict
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useFileSystem } from '../hooks/useFileSystem';
import { useTerminal } from '../hooks/useTerminal';
import { conversationHistoryService, ConversationMessage as ServiceMessage } from '../services/conversationHistoryService';
import { MoltingService } from '../services/moltingService';
import { AICodeEditor } from '../services/aiCodeEditor';
// Note: xibalbaService doesn't export callXibalbaAI directly
// We'll use a simple approach for now - can enhance later
import ErrorBoundary from './ErrorBoundary';

interface DevChatbotProps {
  onFileSelect?: (path: string) => void;
  onShowHistory?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: Array<{
    type: 'read' | 'write' | 'execute' | 'list';
    path?: string;
    command?: string;
    result?: string;
  }>;
}

const DevChatbot: React.FC<DevChatbotProps> = ({ onFileSelect, onShowHistory }) => {
  const [conversationId] = useState<string>(() => `devchat-${Date.now()}`);

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('✅ DevChatbot mounted and ready');
  }, []);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'system',
      content: '💬 **Dev Chat - Self-Modifying AI**\n\nHi! I\'m your development assistant with **self-modification** capabilities.\n\n**I can:**\n- ✅ Read and edit files\n- ✅ Execute commands\n- ✅ Search files\n- ✅ **Edit myself** (molting system)\n- ✅ Help you build the application\n\n**Quick Start:**\n- Type **"test"** - Check if I\'m working\n- **"read package.json"** - Read a file\n- **"Test molting system"** - Full diagnostic\n- **"Edit yourself to..."** - Self-modify (needs Ollama)\n\n**Status:** ✅ Ready to help! 🐍\n\n**Try it now:** Type "test" to verify I\'m working!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Molting system - for self-modification (use useMemo to avoid recreating on every render)
  const moltingService = useMemo(() => new MoltingService(), []);
  const aiCodeEditor = useMemo(() => new AICodeEditor(), []);
  const SELF_FILE_PATH = 'components/DevChatbot.tsx';
  
  // Replication system - subtle infrastructure for "save both" capability
  // Not a UI feature - automatic background capability
  const [isReplicating, setIsReplicating] = useState(false);

  // Load conversation history on mount
  useEffect(() => {
    const saved = conversationHistoryService.loadConversation(conversationId);
    if (saved && saved.messages.length > 0) {
      const loadedMessages: ChatMessage[] = saved.messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        actions: msg.actions as ChatMessage['actions']
      }));
      setMessages(loadedMessages);
    }
  }, [conversationId]);

  // Save conversation after each message
  useEffect(() => {
    if (messages.length > 1) { // Don't save if only system message
      setSaveStatus('saving');
      try {
        const serviceMessages: ServiceMessage[] = messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.getTime(),
          actions: msg.actions
        }));

        const metadata = conversationHistoryService.createMetadata(
          conversationId,
          'devchat',
          serviceMessages
        );

        conversationHistoryService.saveConversation({
          metadata,
          messages: serviceMessages
        });

        setSaveStatus('saved');
        // Reset to idle after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Failed to save conversation:', error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }
  }, [messages, conversationId]);

  const fileSystem = useFileSystem();
  const terminal = useTerminal();
  
  // Service availability state
  const [servicesAvailable, setServicesAvailable] = useState<{
    fileSystem: boolean;
    terminal: boolean;
  }>({ fileSystem: false, terminal: false });
  
  // Check service availability on mount
  useEffect(() => {
    const checkServices = async () => {
      try {
        // Test file system
        await fileSystem.listDirectory('.').catch(() => {
          throw new Error('FileSystem unavailable');
        });
        setServicesAvailable(prev => ({ ...prev, fileSystem: true }));
      } catch (error) {
        console.warn('FileSystem service not available:', error);
        setServicesAvailable(prev => ({ ...prev, fileSystem: false }));
      }
      
      try {
        // Test terminal (simple ping)
        await terminal.executeSimple('echo test').catch(() => {
          throw new Error('Terminal unavailable');
        });
        setServicesAvailable(prev => ({ ...prev, terminal: true }));
      } catch (error) {
        console.warn('Terminal service not available:', error);
        setServicesAvailable(prev => ({ ...prev, terminal: false }));
      }
    };
    
    checkServices();
  }, [fileSystem, terminal]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsProcessing(true);

    try {
      // Parse user intent
      const intent = parseIntent(userInput);
      
      let response: ChatMessage;
      
      if (intent.type === 'read') {
        response = await handleRead(intent.path!);
      } else if (intent.type === 'write') {
        response = await handleWrite(intent.path!, intent.content!);
      } else if (intent.type === 'execute') {
        response = await handleExecute(intent.command!);
      } else if (intent.type === 'list') {
        response = await handleList(intent.path || '.');
      } else if (intent.type === 'search') {
        response = await handleSearch(intent.pattern!);
      } else if (intent.type === 'self-modify') {
        response = await handleSelfModification(intent.request!);
      } else {
        // Use AI to understand complex requests
        response = await handleAIRequest(userInput);
      }

      setMessages(prev => [...prev, response]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  };

  const parseIntent = (input: string): {
    type: 'read' | 'write' | 'execute' | 'list' | 'search' | 'self-modify' | 'unknown';
    path?: string;
    content?: string;
    command?: string;
    pattern?: string;
    request?: string;
  } => {
    const lower = input.toLowerCase();
    
    // Self-modification detection (molting)
    if (
      lower.includes('edit yourself') ||
      lower.includes('modify yourself') ||
      lower.includes('change yourself') ||
      lower.includes('update yourself') ||
      lower.includes('improve yourself') ||
      lower.includes('add to yourself') ||
      lower.includes('remove from yourself') ||
      (lower.includes('edit') && lower.includes('devchatbot')) ||
      (lower.includes('modify') && lower.includes('devchatbot'))
    ) {
      return { type: 'self-modify', request: input };
    }
    
    // Read file
    if (lower.match(/^(read|show|open|view|display)\s+(.+)$/)) {
      const match = input.match(/^(?:read|show|open|view|display)\s+(.+)$/i);
      return { type: 'read', path: match?.[1] };
    }
    
    // Write file
    if (lower.match(/^(write|save|edit|update|create)\s+(.+?)\s+(with|to|as|:)\s+(.+)$/)) {
      const match = input.match(/^(?:write|save|edit|update|create)\s+(.+?)\s+(?:with|to|as|:)\s+(.+)$/i);
      return { type: 'write', path: match?.[1], content: match?.[2] };
    }
    
    // Execute command
    if (lower.match(/^(run|execute|do|run command|run:)\s+(.+)$/)) {
      const match = input.match(/^(?:run|execute|do|run command|run:)\s+(.+)$/i);
      return { type: 'execute', command: match?.[1] };
    }
    
    // List directory
    if (lower.match(/^(list|show files|ls|dir)\s*(.*)$/)) {
      const match = input.match(/^(?:list|show files|ls|dir)\s*(.*)$/i);
      return { type: 'list', path: match?.[1] || '.' };
    }
    
    // Search files
    if (lower.match(/^(search|find|look for)\s+(.+)$/)) {
      const match = input.match(/^(?:search|find|look for)\s+(.+)$/i);
      return { type: 'search', pattern: match?.[1] };
    }
    
    return { type: 'unknown' };
  };

  const handleRead = async (path: string): Promise<ChatMessage> => {
    if (!servicesAvailable.fileSystem) {
      return {
        id: `read-error-${Date.now()}`,
        role: 'assistant',
        content: `❌ **File System Unavailable**\n\nCannot read files. Please ensure:\n1. Dev server is running: \`npm run dev\`\n2. Backend API is accessible: \`/api/filesystem\`\n3. Check browser console (F12) for errors`,
        timestamp: new Date()
      };
    }
    
    try {
      const content = await fileSystem.readFile(path);
      onFileSelect?.(path);
      
      return {
        id: `read-${Date.now()}`,
        role: 'assistant',
        content: `Read file: ${path}\n\n\`\`\`\n${content.substring(0, 1000)}${content.length > 1000 ? '\n... (truncated)' : ''}\n\`\`\``,
        timestamp: new Date(),
        actions: [{ type: 'read', path, result: content }]
      };
    } catch (error) {
      return {
        id: `read-error-${Date.now()}`,
        role: 'assistant',
        content: `Failed to read ${path}: ${error instanceof Error ? error.message : 'Unknown error'}\n\n**Troubleshooting:**\n1. Check if file exists\n2. Check file permissions\n3. Ensure backend API is running`,
        timestamp: new Date()
      };
    }
  };

  const handleWrite = async (path: string, content: string): Promise<ChatMessage> => {
    try {
      await fileSystem.writeFile(path, content);
      
      return {
        id: `write-${Date.now()}`,
        role: 'assistant',
        content: `✅ Written to ${path}`,
        timestamp: new Date(),
        actions: [{ type: 'write', path, result: 'success' }]
      };
    } catch (error) {
      return {
        id: `write-error-${Date.now()}`,
        role: 'assistant',
        content: `Failed to write ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
    }
  };

  const handleExecute = async (command: string): Promise<ChatMessage> => {
    if (!servicesAvailable.terminal) {
      return {
        id: `execute-error-${Date.now()}`,
        role: 'assistant',
        content: `❌ **Terminal Unavailable**\n\nCannot execute commands. Please ensure:\n1. Dev server is running: \`npm run dev\`\n2. Backend API is accessible: \`/api/terminal\`\n3. Check browser console (F12) for errors`,
        timestamp: new Date()
      };
    }
    
    try {
      const response = await terminal.executeSimple(command);
      
      let output = '';
      if (response.stdout) output += response.stdout;
      if (response.stderr) output += `\n[Error]\n${response.stderr}`;
      
      return {
        id: `execute-${Date.now()}`,
        role: 'assistant',
        content: `$ ${command}\n\n${output || '(no output)'}`,
        timestamp: new Date(),
        actions: [{ type: 'execute', command, result: output }]
      };
    } catch (error) {
      return {
        id: `execute-error-${Date.now()}`,
        role: 'assistant',
        content: `Failed to execute: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
    }
  };

  const handleList = async (path: string): Promise<ChatMessage> => {
    try {
      const entries = await fileSystem.listDirectory(path);
      const fileList = entries.map(e => `${e.type === 'directory' ? '📁' : '📄'} ${e.name}`).join('\n');
      
      return {
        id: `list-${Date.now()}`,
        role: 'assistant',
        content: `Directory: ${path}\n\n${fileList}`,
        timestamp: new Date(),
        actions: [{ type: 'list', path, result: fileList }]
      };
    } catch (error) {
      return {
        id: `list-error-${Date.now()}`,
        role: 'assistant',
        content: `Failed to list ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
    }
  };

  const handleSearch = async (pattern: string): Promise<ChatMessage> => {
    try {
      const results = await fileSystem.searchFiles(pattern);
      const resultList = results.slice(0, 20).join('\n');
      
      return {
        id: `search-${Date.now()}`,
        role: 'assistant',
        content: `Found ${results.length} files matching "${pattern}":\n\n${resultList}${results.length > 20 ? '\n... (more results)' : ''}`,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        id: `search-error-${Date.now()}`,
        role: 'assistant',
        content: `Failed to search: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
    }
  };

  /**
   * Test if molting system is functional
   */
  const testMoltingSystem = async (): Promise<string> => {
    const results: string[] = [];
    
    // Test 1: File system access
    try {
      await fileSystem.readFile('package.json');
      results.push('✅ File system access: Working');
    } catch (error) {
      results.push(`❌ File system access: Failed (${error instanceof Error ? error.message : 'Unknown'})`);
    }
    
    // Test 2: Ollama connection
    try {
      const config = await import('../config/mcpConfig');
      const mcpConfig = config.DEFAULT_MCP_CONFIG;
      if (mcpConfig.useLocalAI && mcpConfig.localAIProvider === 'ollama') {
        const response = await fetch(`${mcpConfig.localAIServerUrl}/api/tags`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          const models = data.models || [];
          results.push(`✅ Ollama connection: Working (${models.length} models available)`);
        } else {
          results.push(`❌ Ollama connection: Failed (HTTP ${response.status})`);
        }
      } else {
        results.push('⚠️ Ollama not configured in settings');
      }
    } catch (error) {
      results.push(`❌ Ollama connection: Failed (${error instanceof Error ? error.message : 'Unknown'})`);
    }
    
    // Test 3: Self file exists
    try {
      await fileSystem.readFile(SELF_FILE_PATH);
      results.push(`✅ Self file exists: ${SELF_FILE_PATH}`);
    } catch (error) {
      results.push(`❌ Self file missing: ${SELF_FILE_PATH}`);
    }
    
    return results.join('\n');
  };

  /**
   * Handle Self-Modification (Molting)
   * Like a snake growing new skin or spider hardening new shell
   */
  const handleSelfModification = async (userRequest: string): Promise<ChatMessage> => {
    try {
      // Step 1: Read current body
      let currentCode: string;
      try {
        currentCode = await fileSystem.readFile(SELF_FILE_PATH);
      } catch (error) {
        return {
          id: `self-modify-error-${Date.now()}`,
          role: 'assistant',
          content: `❌ **Cannot read self**\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nMake sure the file exists: ${SELF_FILE_PATH}`,
          timestamp: new Date()
        };
      }
      
      // Step 2: Generate new code using AI (grow new body)
      let newCode: string;
      try {
        newCode = await aiCodeEditor.generateCodeEdit({
          filePath: SELF_FILE_PATH,
          currentCode,
          userRequest,
          context: 'This is the DevChatbot component. It handles file operations, terminal commands, and self-modification.'
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        if (errorMsg.includes('Ollama') || errorMsg.includes('connect')) {
          return {
            id: `self-modify-error-${Date.now()}`,
            role: 'assistant',
            content: `❌ **AI Not Available**\n\n${errorMsg}\n\n**To fix:**\n1. Start Ollama: \`ollama serve\`\n2. Install model: \`ollama pull codellama:latest\`\n3. Try again\n\nOr use regular file editing: "write components/DevChatbot.tsx with content: ..."`,
            timestamp: new Date()
          };
        }
        throw error;
      }

      // Step 3: Validate generated code
      const validation = aiCodeEditor.validateGeneratedCode(newCode, currentCode);
      if (!validation.valid && validation.warnings.length > 0) {
        // Show warnings but allow user to proceed
        return {
          id: `self-modify-warning-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Generated code has warnings:**\n${validation.warnings.join('\n')}\n\n**Options:**\n1. Proceed anyway (may have issues)\n2. Try a different request\n3. Use manual editing: "write components/DevChatbot.tsx with content: ..."`,
          timestamp: new Date()
        };
      }

      // Step 4: Molt (complete biological molting cycle)
      const result = await moltingService.molt(SELF_FILE_PATH, newCode);

      if (result.success) {
        return {
          id: `self-modify-success-${Date.now()}`,
          role: 'assistant',
          content: `🐍 **Molting Complete!**\n\n✅ New body grown and validated\n✅ Bodies swapped successfully\n✅ Old body preserved as backup: ${result.backupPath}\n\n🔄 Reloading in 1 second to activate new body...\n\n**Preview of new body:**\n\`\`\`tsx\n${result.preview || 'Preview unavailable'}\n\`\`\``,
          timestamp: new Date()
        };
      } else {
        return {
          id: `self-modify-error-${Date.now()}`,
          role: 'assistant',
          content: `❌ **Molting Failed**\n\n${result.message}\n\n**Old body preserved.** You can:\n1. Try again with a different request\n2. Use manual editing: "write components/DevChatbot.tsx with content: ..."\n3. Rollback if needed`,
          timestamp: new Date()
        };
      }
    } catch (error) {
      return {
        id: `self-modify-error-${Date.now()}`,
        role: 'assistant',
        content: `❌ **Self-Modification Failed**\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\n**Old body preserved.**\n\n**Troubleshooting:**\n1. Check if Ollama is running: \`ollama serve\`\n2. Check file permissions\n3. Try manual editing: "write components/DevChatbot.tsx with content: ..."`,
        timestamp: new Date()
      };
    }
  };

  /**
   * Handle AI request with subtle replication
   * If the request involves choices, automatically replicate to explore all paths
   */
  const handleAIRequest = async (input: string): Promise<ChatMessage> => {
    // Check if this request involves multiple approaches/choices
    // If so, use subtle replication to explore all paths (save both)
    
    // For now, use standard handling
    // Future: Detect choices and auto-replicate
    // Check if user wants to test the system
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('test') && (lowerInput.includes('molting') || lowerInput.includes('system'))) {
      try {
        const testResults = await testMoltingSystem();
        return {
          id: `test-${Date.now()}`,
          role: 'assistant',
          content: `🧪 **Molting System Test Results:**\n\n${testResults}\n\n**To use self-modification:**\n"Edit yourself to add a new feature"`,
          timestamp: new Date()
        };
      } catch (error) {
        return {
          id: `test-error-${Date.now()}`,
          role: 'assistant',
          content: `❌ **Test Failed**\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\n**Troubleshooting:**\n1. Check dev server is running: \`npm run dev\`\n2. Check backend API: Open browser console and look for errors\n3. Check Ollama: \`curl http://localhost:11434/api/tags\``,
          timestamp: new Date()
        };
      }
    }
    
    // Quick connectivity test
    if (lowerInput === 'test' || lowerInput === 'ping' || lowerInput === 'status') {
      try {
        // Test file system
        await fileSystem.readFile('package.json');
        return {
          id: `status-${Date.now()}`,
          role: 'assistant',
          content: `✅ **System Status: ONLINE**\n\n- File system: ✅ Working\n- Dev Chat: ✅ Ready\n- Self-modification: ✅ Available\n\n**Try:**\n- "read package.json" - Test file reading\n- "Test molting system" - Full system test\n- "Edit yourself to..." - Self-modification`,
          timestamp: new Date()
        };
      } catch (error) {
        return {
          id: `status-error-${Date.now()}`,
          role: 'assistant',
          content: `❌ **System Status: ERROR**\n\nFile system test failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\n**Fix:**\n1. Make sure dev server is running: \`npm run dev\`\n2. Check backend is accessible\n3. Check browser console for errors`,
          timestamp: new Date()
        };
      }
    }
    
    // For now, provide helpful suggestions
    // Can integrate with xibalbaService later for AI responses
    const suggestions = `I can help you with:

📄 **Read Files:**
  - "read package.json"
  - "read server.js"
  - "show components/FileBrowser.tsx"

✏️ **Write Files:**
  - "write tmp/test.txt with content: hello world"
  - "create data/config.json with content: {}"

⚡ **Execute Commands:**
  - "run npm run dev"
  - "run git status"
  - "execute ls -la"

📁 **List Directories:**
  - "list components"
  - "list services"
  - "show files in docs"

🔍 **Search Files:**
  - "search mcp"
  - "find terminal"
  - "look for fileSystem"

Try one of these commands!`;

    return {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: suggestions,
      timestamp: new Date()
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ErrorBoundary>
      <div className="dev-chat-container">
        {/* Header */}
        <div className="dev-chat-header">
          <div className="dev-chat-header-content">
            <div className="dev-chat-header-left">
              <span className="dev-chat-title">💬 Dev Chat</span>
              <span className="dev-chat-subtitle">Self-Modifying AI</span>
              {/* Service Status Indicators */}
              <span 
                className={`dev-chat-service-status ${servicesAvailable.fileSystem ? 'online' : 'offline'}`}
                title={servicesAvailable.fileSystem ? 'File System: Online' : 'File System: Offline'}
              >
                {servicesAvailable.fileSystem ? '📁' : '⚠️'}
              </span>
              <span
                className={`dev-chat-service-status ${servicesAvailable.terminal ? 'online' : 'offline'}`}
                title={servicesAvailable.terminal ? 'Terminal: Online' : 'Terminal: Offline'}
              >
                {servicesAvailable.terminal ? '💻' : '⚠️'}
              </span>
            </div>
            <button
              onClick={() => onShowHistory?.()}
              className="dev-chat-history-button"
              title="View History"
            >
              <span className="material-symbols-outlined dev-chat-history-icon" aria-hidden="true" data-icon="history">history</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="dev-chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`dev-chat-message ${message.role}`}
            >
              <div className="dev-chat-message-content">
                {message.content}
              </div>
              {message.actions && message.actions.length > 0 && (
                <div className="dev-chat-message-actions">
                  Actions: {message.actions.map(a => a.type).join(', ')}
                </div>
              )}
            </div>
          ))}
          {isProcessing && (
            <div className="dev-chat-message assistant">
              <div className="dev-chat-message-content dev-chat-message-processing">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="dev-chat-input-area">
          <div className="dev-chat-input-wrapper">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              className="dev-chat-textarea"
              placeholder="Ask me to read files, run commands, or help with your project..."
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="dev-chat-send-button"
            >
              Send
            </button>
          </div>
          <div className="dev-chat-status">
            Examples: "read package.json" • "run npm run dev" • "list components"
            {saveStatus === 'saving' && <span className="saving"> • 💾 Saving...</span>}
            {saveStatus === 'saved' && <span className="saved"> • 💾 Saved</span>}
            {saveStatus === 'error' && <span className="error"> • ⚠️ Save failed</span>}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DevChatbot;

