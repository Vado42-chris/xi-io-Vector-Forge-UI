/**
 * #hashtag: terminal-service
 * #purpose: Terminal/CLI integration service for Xibalba products
 * #provides: Command execution, terminal access, automation hooks
 * #usage: Import and use for CLI operations, automation, and system integration
 * #related: terminalManager, cliSettings, automationService
 * 
 * Terminal Service for Xibalba Products
 * Enables CLI access and automation for all Xibalba applications
 * Follows Xibalba standards: TypeScript strict, security-first, local execution
 */

export interface TerminalConfig {
  enabled: boolean;
  shell: string;                  // Default shell (bash, zsh, fish, etc.)
  workingDirectory: string;       // Default working directory
  environment: Record<string, string>; // Environment variables
  timeout: number;                // Command timeout in ms
  maxOutputSize: number;          // Max output buffer size
  allowRemote: boolean;            // Allow remote execution (SSH, etc.)
  remoteHosts?: RemoteHost[];     // Remote host configurations
  automation: {
    enabled: boolean;
    scriptDirectory: string;      // Directory for automation scripts
    allowedCommands: string[];    // Whitelist of allowed commands
    requireConfirmation: boolean;  // Require user confirmation for dangerous commands
  };
  security: {
    sandboxed: boolean;            // Run in sandbox
    restrictedPaths: string[];    // Paths that require special permissions
    allowedPaths: string[];       // Allowed execution paths
    blockDangerousCommands: boolean; // Block rm -rf, etc.
  };
}

export interface RemoteHost {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  authMethod: 'password' | 'key' | 'agent';
  keyPath?: string;
}

export interface TerminalCommand {
  id: string;
  command: string;
  args?: string[];
  workingDirectory?: string;
  environment?: Record<string, string>;
  timeout?: number;
  onOutput?: (data: string) => void;
  onError?: (error: string) => void;
  onComplete?: (exitCode: number) => void;
}

export interface CommandResult {
  success: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
  executionTime: number;
  error?: string;
}

export interface TerminalSession {
  id: string;
  shell: string;
  workingDirectory: string;
  environment: Record<string, string>;
  history: string[];
  createdAt: number;
}

/**
 * Terminal Service Class
 * Manages terminal sessions, command execution, and automation
 */
class TerminalService {
  private config: TerminalConfig;
  private sessions: Map<string, TerminalSession> = new Map();
  private activeSessionId: string | null = null;

  constructor(config?: Partial<TerminalConfig>) {
    this.config = {
      enabled: true,
      shell: '/bin/bash',
      workingDirectory: process.cwd(),
      environment: {},
      timeout: 30000,
      maxOutputSize: 1024 * 1024, // 1MB
      allowRemote: false,
      automation: {
        enabled: true,
        scriptDirectory: './scripts',
        allowedCommands: [],
        requireConfirmation: true
      },
      security: {
        sandboxed: true,
        restrictedPaths: ['/etc', '/usr', '/bin', '/sbin'],
        allowedPaths: [],
        blockDangerousCommands: true
      },
      ...config
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<TerminalConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): TerminalConfig {
    return { ...this.config };
  }

  /**
   * Create a new terminal session
   */
  createSession(shell?: string, workingDirectory?: string): string {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const session: TerminalSession = {
      id: sessionId,
      shell: shell || this.config.shell,
      workingDirectory: workingDirectory || this.config.workingDirectory,
      environment: { ...this.config.environment },
      history: [],
      createdAt: Date.now()
    };
    
    this.sessions.set(sessionId, session);
    if (!this.activeSessionId) {
      this.activeSessionId = sessionId;
    }
    
    return sessionId;
  }

  /**
   * Get active session
   */
  getActiveSession(): TerminalSession | null {
    if (!this.activeSessionId) return null;
    return this.sessions.get(this.activeSessionId) || null;
  }

  /**
   * Switch active session
   */
  setActiveSession(sessionId: string): boolean {
    if (this.sessions.has(sessionId)) {
      this.activeSessionId = sessionId;
      return true;
    }
    return false;
  }

  /**
   * Execute a command
   * In browser: Uses WebSocket or HTTP API to backend
   * In Electron/Node: Uses child_process
   */
  async executeCommand(cmd: TerminalCommand): Promise<CommandResult> {
    if (!this.config.enabled) {
      throw new Error('Terminal service is disabled');
    }

    // Security checks
    if (!this.validateCommand(cmd.command)) {
      return {
        success: false,
        exitCode: -1,
        stdout: '',
        stderr: `Command blocked by security policy: ${cmd.command}`,
        executionTime: 0,
        error: 'Command blocked'
      };
    }

    const startTime = Date.now();
    const session = this.getActiveSession();
    
    // In browser environment, use fetch to backend API
    if (typeof window !== 'undefined') {
      return await this.executeCommandRemote(cmd, session);
    }
    
    // In Node.js environment, use child_process
    return await this.executeCommandLocal(cmd, session, startTime);
  }

  /**
   * Execute command via backend API (browser)
   */
  private async executeCommandRemote(
    cmd: TerminalCommand,
    session: TerminalSession | null
  ): Promise<CommandResult> {
    try {
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: cmd.command,
          args: cmd.args,
          workingDirectory: cmd.workingDirectory || session?.workingDirectory || this.config.workingDirectory,
          environment: { ...this.config.environment, ...cmd.environment },
          timeout: cmd.timeout || this.config.timeout,
          sessionId: session?.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Update session history
      if (session) {
        session.history.push(cmd.command);
      }

      // Call callbacks
      if (cmd.onOutput && result.stdout) {
        cmd.onOutput(result.stdout);
      }
      if (cmd.onError && result.stderr) {
        cmd.onError(result.stderr);
      }
      if (cmd.onComplete) {
        cmd.onComplete(result.exitCode);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        exitCode: -1,
        stdout: '',
        stderr: errorMessage,
        executionTime: Date.now() - Date.now(),
        error: errorMessage
      };
    }
  }

  /**
   * Execute command locally (Node.js)
   */
  private async executeCommandLocal(
    cmd: TerminalCommand,
    session: TerminalSession | null,
    startTime: number
  ): Promise<CommandResult> {
    // This would use Node.js child_process
    // For now, return a placeholder
    // TODO: Implement actual child_process execution
    return {
      success: false,
      exitCode: -1,
      stdout: '',
      stderr: 'Local execution not yet implemented',
      executionTime: Date.now() - startTime,
      error: 'Not implemented'
    };
  }

  /**
   * Validate command against security policy
   */
  private validateCommand(command: string): boolean {
    // Block dangerous commands if enabled
    if (this.config.security.blockDangerousCommands) {
      const dangerousPatterns = [
        /rm\s+-rf/,
        /rm\s+-\*rf/,
        /dd\s+if=/,
        /mkfs/,
        /fdisk/,
        /format/,
        />\s*\/dev/,
        /sudo\s+rm/,
        /sudo\s+dd/
      ];
      
      if (dangerousPatterns.some(pattern => pattern.test(command))) {
        return false;
      }
    }

    // Check if command is in allowed list (if whitelist is enabled)
    if (this.config.automation.allowedCommands.length > 0) {
      const commandName = command.split(/\s+/)[0];
      if (!this.config.automation.allowedCommands.includes(commandName)) {
        return false;
      }
    }

    // Check restricted paths
    if (this.config.security.restrictedPaths.length > 0) {
      for (const restrictedPath of this.config.security.restrictedPaths) {
        if (command.includes(restrictedPath)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Run automation script
   */
  async runAutomationScript(scriptName: string, args?: string[]): Promise<CommandResult> {
    if (!this.config.automation.enabled) {
      throw new Error('Automation is disabled');
    }

    const scriptPath = `${this.config.automation.scriptDirectory}/${scriptName}`;
    return await this.executeCommand({
      id: `automation-${Date.now()}`,
      command: scriptPath,
      args: args || [],
      workingDirectory: this.config.automation.scriptDirectory
    });
  }

  /**
   * Get command history for active session
   */
  getHistory(limit?: number): string[] {
    const session = this.getActiveSession();
    if (!session) return [];
    
    const history = [...session.history];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Clear command history
   */
  clearHistory(): void {
    const session = this.getActiveSession();
    if (session) {
      session.history = [];
    }
  }

  /**
   * Close a session
   */
  closeSession(sessionId: string): boolean {
    if (this.sessions.has(sessionId)) {
      this.sessions.delete(sessionId);
      if (this.activeSessionId === sessionId) {
        this.activeSessionId = Array.from(this.sessions.keys())[0] || null;
      }
      return true;
    }
    return false;
  }

  /**
   * List all sessions
   */
  listSessions(): TerminalSession[] {
    return Array.from(this.sessions.values());
  }
}

// Singleton instance
let terminalServiceInstance: TerminalService | null = null;

/**
 * Get terminal service instance
 */
export function getTerminalService(config?: Partial<TerminalConfig>): TerminalService {
  if (!terminalServiceInstance) {
    terminalServiceInstance = new TerminalService(config);
  }
  return terminalServiceInstance;
}

/**
 * Initialize terminal service with saved configuration
 */
export async function initializeTerminalService(): Promise<TerminalService> {
  // Load saved config from localStorage or config file
  const savedConfig = localStorage.getItem('xibalba_terminal_config');
  const config = savedConfig ? JSON.parse(savedConfig) : {};
  
  const service = getTerminalService(config);
  
  // Create default session
  service.createSession();
  
  return service;
}

/**
 * Save terminal configuration
 */
export function saveTerminalConfig(config: TerminalConfig): void {
  localStorage.setItem('xibalba_terminal_config', JSON.stringify(config));
}

