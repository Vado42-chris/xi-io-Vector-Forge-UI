/**
 * #hashtag: terminal-hook
 * #purpose: React hook for TerminalClient dependency injection
 * #provides: TerminalClient instance with proper lifecycle management
 * #usage: const terminal = useTerminal();
 * #related: terminalClient, Terminal, DevChatbot
 * 
 * Terminal Hook
 * Follows Xibalba standards: Dependency injection, service separation
 */

import { useMemo } from 'react';
import { TerminalClient } from '../services/terminalClient';

/**
 * Hook for accessing TerminalClient
 * Provides singleton instance with proper lifecycle
 */
export function useTerminal(): TerminalClient {
  return useMemo(() => new TerminalClient(), []);
}

