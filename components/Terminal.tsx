/**
 * #hashtag: terminal
 * #purpose: Terminal/CLI interface for VectorForge
 * #provides: Execute commands safely from browser
 * #usage: Add to RightSidebar or as standalone panel
 * #related: terminalClient, server.js terminal endpoint
 * 
 * Terminal Component
 * Follows Xibalba standards: Error boundaries, loading states, TypeScript strict
 */

import React, { useState, useEffect, useRef } from 'react';
import { TerminalResponse } from '../services/terminalClient';
import { useTerminal } from '../hooks/useTerminal';
import ErrorBoundary from './ErrorBoundary';

interface TerminalProps {
  initialWorkingDirectory?: string;
}

interface CommandHistory {
  command: string;
  response: TerminalResponse;
  timestamp: Date;
}

const Terminal: React.FC<TerminalProps> = ({ initialWorkingDirectory }) => {
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [workingDirectory, setWorkingDirectory] = useState<string>(initialWorkingDirectory || '.');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const terminal = useTerminal();

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = async () => {
    if (!currentCommand.trim() || isExecuting) return;

    const command = currentCommand.trim();
    setCurrentCommand('');
    setIsExecuting(true);
    setError(null);

    try {
      const response = await terminal.executeSimple(command, workingDirectory);
      
      setHistory(prev => [...prev, {
        command,
        response,
        timestamp: new Date()
      }]);

      // Update working directory if cd command
      if (command.startsWith('cd ')) {
        const newDir = command.substring(3).trim();
        if (newDir) {
          setWorkingDirectory(newDir);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Command execution failed');
      setHistory(prev => [...prev, {
        command,
        response: {
          success: false,
          exitCode: -1,
          stdout: '',
          stderr: err instanceof Error ? err.message : 'Unknown error',
          executionTime: 0,
          error: err instanceof Error ? err.message : 'Unknown error'
        },
        timestamp: new Date()
      }]);
    } finally {
      setIsExecuting(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand();
    }
  };

  return (
    <ErrorBoundary>
      <div className="terminal-container component-container z-component-group h-full flex flex-col bg-[var(--xibalba-bg-primary,#1a1a1a)] text-[var(--xibalba-text-primary,#ffffff)] font-mono">
        {/* Header */}
        <div className="p-2 border-b border-[var(--xibalba-bg-tertiary)] flex items-center gap-2">
          <span className="text-xs">💻 Terminal</span>
          <span className="text-sm text-[var(--xibalba-text-100)]">Working: {workingDirectory}</span>
        </div>

        {/* Output */}
        <div className="flex-1 overflow-y-auto p-2 text-xs">
          {history.length === 0 && (
            <div className="text-[var(--xibalba-text-100)] mb-2">
              Type a command and press Enter to execute.
              <br />
              <span className="text-sm">Example: npm run dev, ls, git status</span>
            </div>
          )}
          
          {history.map((item, index) => (
            <div key={index} className="mb-3">
              <div className="text-[var(--xibalba-text-100)] mb-1">
                <span className="text-[var(--xibalba-text-100)]">$</span> {item.command}
              </div>
              
              {item.response.stdout && (
                <div className="text-[var(--xibalba-text-primary)] whitespace-pre-wrap mb-1">
                  {item.response.stdout}
                </div>
              )}
              
              {item.response.stderr && (
                <div className="text-[var(--vectorforge-accent)] whitespace-pre-wrap mb-1">
                  {item.response.stderr}
                </div>
              )}
              
              {item.response.exitCode !== undefined && (
                <div className="text-[var(--xibalba-text-100)] text-sm">
                  Exit code: {item.response.exitCode} | Time: {item.response.executionTime}ms
                </div>
              )}
            </div>
          ))}
          
          {error && (
            <div className="text-[var(--vectorforge-accent)] mb-2">
              Error: {error}
            </div>
          )}
          
          <div ref={historyEndRef} />
        </div>

        {/* Input */}
        <div className="p-2 border-t border-[var(--xibalba-bg-tertiary)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--xibalba-text-100)]">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isExecuting}
              className="flex-1 px-2 py-1 text-xs bg-[var(--xibalba-bg-secondary)] border border-[var(--xibalba-bg-tertiary)] rounded focus:outline-none focus:border-[var(--xibalba-bg-hover)]"
              placeholder={isExecuting ? "Executing..." : "Enter command..."}
            />
            {isExecuting && (
              <span className="text-xs text-[var(--xibalba-text-100)]">⏳</span>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Terminal;

