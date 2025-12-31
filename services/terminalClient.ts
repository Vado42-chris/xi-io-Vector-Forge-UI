/**
 * #hashtag: terminal-client
 * #purpose: Frontend client for terminal/CLI operations
 * #provides: Execute commands safely from browser
 * #usage: Import and use in Terminal component
 * #related: server.js terminal endpoint
 * 
 * Terminal Client
 * Follows Xibalba standards: TypeScript strict, error handling
 */

export interface TerminalCommand {
  command: string;
  args?: string[];
  workingDirectory?: string;
  environment?: Record<string, string>;
  timeout?: number;
}

export interface TerminalResponse {
  success: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
  executionTime: number;
  error?: string;
}

export class TerminalClient {
  private baseUrl = '/api/terminal';

  /**
   * Execute a command
   */
  async execute(command: TerminalCommand): Promise<TerminalResponse> {
    const response = await fetch(`${this.baseUrl}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command)
    });
    
    const data = await response.json();
    return data;
  }

  /**
   * Execute a simple command string
   */
  async executeSimple(command: string, workingDirectory?: string): Promise<TerminalResponse> {
    return this.execute({
      command,
      workingDirectory
    });
  }
}

