/**
 * #hashtag: file-system-hook
 * #purpose: React hook for FileSystemClient dependency injection
 * #provides: FileSystemClient instance with proper lifecycle management
 * #usage: const fileSystem = useFileSystem();
 * #related: fileSystemClient, FileBrowser, DevChatbot
 * 
 * File System Hook
 * Follows Xibalba standards: Dependency injection, service separation
 */

import { useMemo } from 'react';
import { FileSystemClient } from '../services/fileSystemClient';

/**
 * Hook for accessing FileSystemClient
 * Provides singleton instance with proper lifecycle
 */
export function useFileSystem(): FileSystemClient {
  return useMemo(() => new FileSystemClient(), []);
}

