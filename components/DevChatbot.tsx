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
import ErrorPreventionDialog from './ErrorPreventionDialog';

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
  const [showSelfModifyConfirm, setShowSelfModifyConfirm] = useState(false);
  const [pendingSelfModifyRequest, setPendingSelfModifyRequest] = useState<string | null>(null);

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
        // Self-modification (molting) - Show confirmation first
        setPendingSelfModifyRequest(intent.request!);
        setShowSelfModifyConfirm(true);
        return; // Wait for user confirmation
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
      // Refocus input after a brief delay to ensure state updates complete
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
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
    
    // ACTUALLY CALL OLLAMA FOR AI RESPONSES
    try {
      const { loadMCPConfig } = await import('../config/mcpConfig');
      const mcpConfig = loadMCPConfig();
      
      if (!mcpConfig.useLocalAI || mcpConfig.localAIProvider !== 'ollama') {
        throw new Error('Ollama not configured. Please enable local AI in settings.');
      }
      
      const serverUrl = mcpConfig.localAIServerUrl || 'http://localhost:11434';
      const model = mcpConfig.localAIModelName || 'codellama:latest';

      // Build conversation context from recent messages
      const recentMessages = messages.slice(-6); // Last 6 messages for context
      const conversationContext = recentMessages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n');
      
      // Get user profile and lexicon for personalization
      const userProfile = userProfileService.getProfile();
      const personalizedContext = userLexiconService.getPersonalizedContext(userProfile.userId);
      
      // Learn from current conversation (update lexicon)
      userLexiconService.learnFromMessages(
        userProfile.userId,
        messages.map(m => ({ role: m.role, content: m.content }))
      );
      
      // RAG: Retrieve relevant past conversations for context
      const relevantHistory = conversationHistoryService.searchConversations(
        userInput,
        userProfile.userId,
        3 // Top 3 relevant conversations
      );
      
      const ragContext = relevantHistory.length > 0
        ? `\n\nRelevant past conversations:\n${relevantHistory.map(h => `- ${h.summary || h.messages[0]?.content?.substring(0, 100)}`).join('\n')}`
        : '';

      // Build full prompt with context
      const systemPrompt = `You are a helpful development assistant for VectorForge, a vector graphics editor. You can:
- Read and edit files
- Execute terminal commands
- Search files
- Edit your own code (self-modification via molting system)

Be concise, helpful, and focus on actionable responses. Format your responses with proper line breaks and paragraphs for readability.`;

      const fullPrompt = `${systemPrompt}\n\n${personalizedContext}\n\nConversation history:\n${conversationContext}${ragContext}\n\nUser: ${userInput}\n\nAssistant:`;

      console.log('[DEBUG] Calling Ollama for conversational response', { serverUrl, model, promptLength: fullPrompt.length });

      // Call Ollama
      const response = await fetch(`${serverUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: 0.7, // Higher for conversational responses
            top_p: 0.9,
            num_predict: 2000, // Reasonable length for chat
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('Ollama returned empty response');
      }

      const trimmedResponse = data.response.trim();
      
      console.log('[DEBUG] Ollama response received', { responseLength: trimmedResponse.length });

      return {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: trimmedResponse,
        timestamp: new Date()
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      // If Ollama connection fails, provide helpful fallback
      if (errorMsg.includes('Ollama') || errorMsg.includes('connect') || errorMsg.includes('fetch')) {
        return {
          id: `ai-error-${Date.now()}`,
          role: 'assistant',
          content: `❌ **AI Not Available**\n\n${errorMsg}\n\n**To fix:**\n1. Start Ollama: \`ollama serve\`\n2. Install model: \`ollama pull codellama:latest\`\n3. Try again\n\n**Or try file operations:**\n- "read package.json" - Read a file\n- "list components" - List directory\n- "run npm run dev" - Execute command`,
          timestamp: new Date()
        };
      }
      
      // Other errors
      return {
        id: `ai-error-${Date.now()}`,
        role: 'assistant',
        content: `❌ **Error**\n\n${errorMsg}\n\n**Try:**\n- "read package.json" - Read a file\n- "list components" - List directory\n- "run npm run dev" - Execute command`,
        timestamp: new Date()
      };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Diagnostics: Analyze the last AI response
  const handleDiagnostics = async () => {
    // Find the last assistant message
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
    
    if (!lastAssistantMessage) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '❌ **No AI response to analyze**\n\nPlease submit a prompt first and wait for the AI to respond.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Ask the AI to analyze its own response
      const diagnosticPrompt = `Analyze and critique this AI response. Identify any errors, inconsistencies, or areas for improvement. Be thorough and honest:\n\n---\n\n${lastAssistantMessage.content}\n\n---\n\nProvide a diagnostic report.`;
      
      const diagnosticResponse = await handleAIRequest(diagnosticPrompt);
      setMessages(prev => [...prev, diagnosticResponse]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `❌ **Diagnostics Error**\n\n${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  };

  return (
    <ErrorBoundary>
      <div 
        className="dev-chat-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          minHeight: 0,
          position: 'relative',
          overflow: 'hidden',
          isolation: 'isolate',
          contain: 'layout style paint',
          boxSizing: 'border-box',
          top: 'auto',
          bottom: 'auto',
          left: 'auto',
          right: 'auto',
          transform: 'none',
          zIndex: 1
        }}
      >
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
                {message.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < message.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
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

        {/* Input - CRITICAL: Must be visible and functional */}
        <div 
          className="dev-chat-input-area"
          style={{
            position: 'relative',
            width: '100%',
            padding: '12px',
            background: 'var(--xibalba-grey-050)',
            borderTop: '2px solid var(--xibalba-grey-200)',
            zIndex: 1,
            flexShrink: 0,
            marginTop: 'auto',
            top: 'auto',
            bottom: 'auto',
            left: 'auto',
            right: 'auto',
            transform: 'none',
            maxWidth: '100%',
            boxSizing: 'border-box',
            isolation: 'isolate',
            contain: 'layout style paint'
          }}
        >
          <div className="dev-chat-input-wrapper">
            <textarea
              ref={inputRef}
              id="dev-chat-input"
              name="dev-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              className="dev-chat-textarea"
              placeholder="Type your message here... (e.g., 'read package.json' or 'help')"
              rows={3}
            />
            <button
              onClick={handleDiagnostics}
              disabled={isProcessing || !messages.some(m => m.role === 'assistant')}
              className="dev-chat-diagnostics-button"
              title="Analyze the last AI response for errors and improvements"
            >
              <span className="material-symbols-outlined dev-chat-diagnostics-icon">psychology</span>
              Diagnostics
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="dev-chat-send-button"
            >
              Send
            </button>
          </div>
          <div className="dev-chat-status">
            💡 Try: "read package.json" • "run npm run dev" • "list components" • "help"
            {saveStatus === 'saving' && <span className="saving"> • 💾 Saving...</span>}
            {saveStatus === 'saved' && <span className="saved"> • 💾 Saved</span>}
            {saveStatus === 'error' && <span className="error"> • ⚠️ Save failed</span>}
          </div>
        </div>
      </div>

      {/* Self-Modification Confirmation Dialog */}
      <ErrorPreventionDialog
        isOpen={showSelfModifyConfirm}
        type="confirmation"
        title="Confirm Self-Modification"
        message="You are about to modify the DevChatbot component. This will change how I work."
        details="The system will create a backup before making changes. You can rollback if needed."
        confirmLabel="Proceed with Modification"
        cancelLabel="Cancel"
        onConfirm={async () => {
          setShowSelfModifyConfirm(false);
          if (pendingSelfModifyRequest) {
            const response = await handleSelfModification(pendingSelfModifyRequest);
            setMessages(prev => [...prev, response]);
            setPendingSelfModifyRequest(null);
          }
        }}
        onCancel={() => {
          setShowSelfModifyConfirm(false);
          setPendingSelfModifyRequest(null);
          setMessages(prev => [...prev, {
            id: `self-modify-cancelled-${Date.now()}`,
            role: 'assistant',
            content: '❌ **Self-modification cancelled**\n\nNo changes were made.',
            timestamp: new Date()
          }]);
        }}
      />
    </ErrorBoundary>
  );
};

export default DevChatbot;

