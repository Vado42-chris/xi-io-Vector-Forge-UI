/**
 * #hashtag: filesystem-client
 * #purpose: Frontend client for file system operations
 * #provides: Read, write, list, and search file operations from browser
 * #usage: Import and use in FileBrowser component
 * #related: fileSystemService, api/filesystem
 * 
 * File System Client
 * Follows Xibalba standards: TypeScript strict, error handling
 */

import { performanceService } from './performanceService';

export interface FileSystemEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: Date;
}

export class FileSystemClient {
  private baseUrl = '/api/filesystem';

  /**
   * Read file content
   * Uses caching for performance
   */
  async readFile(path: string, useCache: boolean = true): Promise<string> {
    const cacheKey = `file:${path}`;
    
    if (useCache) {
      return performanceService.cached(
        cacheKey,
        async () => {
          const response = await fetch(`${this.baseUrl}/read`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path })
          });
          
          const data = await response.json();
          if (!data.success) {
            throw new Error(data.error || 'Failed to read file');
          }
          return data.content;
        },
        60000 // Cache for 1 minute
      );
    }
    
    const response = await fetch(`${this.baseUrl}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to read file');
    }
    return data.content;
  }

  /**
   * Write file content
   */
  async writeFile(path: string, content: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content })
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to write file');
    }
  }

  /**
   * List directory contents
   * Uses caching for performance
   */
  async listDirectory(path: string = '.', useCache: boolean = true): Promise<FileSystemEntry[]> {
    const cacheKey = `dir:${path}`;
    
    if (useCache) {
      return performanceService.cached(
        cacheKey,
        async () => {
          const response = await fetch(`${this.baseUrl}/list`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path })
          });
          
          const data = await response.json();
          if (!data.success) {
            throw new Error(data.error || 'Failed to list directory');
          }
          return data.entries;
        },
        30000 // Cache for 30 seconds
      );
    }
    
    const response = await fetch(`${this.baseUrl}/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to list directory');
    }
    return data.entries;
  }

  /**
   * Search for files
   */
  async searchFiles(pattern: string, searchPath?: string): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pattern, path: searchPath })
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to search files');
    }
    return data.results;
  }

  /**
   * Get file stats
   */
  async getFileStats(path: string): Promise<{
    size: number;
    modified: Date;
    created: Date;
    isDirectory: boolean;
  }> {
    const response = await fetch(`${this.baseUrl}/stats?path=${encodeURIComponent(path)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to get file stats');
    }
    return data.stats;
  }

  /**
   * Create directory (and parent directories if needed)
   */
  async createDirectory(path: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/create-directory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to create directory');
    }
  }

  /**
   * Delete file or directory
   */
  async deleteFile(path: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete file');
    }
  }

  /**
   * Move file or directory
   */
  async moveFile(source: string, destination: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, destination })
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to move file');
    }
  }
}

