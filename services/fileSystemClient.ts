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
    // #region agent log
    const logEntry1 = {location:'fileSystemClient.ts:29',message:'readFile entry',data:{path,useCache},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D,E'};
    console.log('[DEBUG]', logEntry1);
    fetch('http://127.0.0.1:7242/ingest/9192f36e-3223-469d-8e1d-e9ca20bc6049',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logEntry1)}).catch(()=>{});
    // #endregion
    const cacheKey = `file:${path}`;
    
    const fetchFile = async () => {
      const url = `${this.baseUrl}/read`;
      const body = JSON.stringify({ path });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9192f36e-3223-469d-8e1d-e9ca20bc6049',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileSystemClient.ts:35',message:'before fetch',data:{url,method:'POST',bodyLength:body.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C,D'})}).catch(()=>{});
      // #endregion
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      
      // #region agent log
      const status = response.status;
      const contentType = response.headers.get('content-type');
      const responseText = await response.clone().text();
      const logEntry2 = {location:'fileSystemClient.ts:48',message:'after fetch response',data:{status,contentType,responseLength:responseText.length,responsePreview:responseText.substring(0,200),isOk:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,E'};
      console.log('[DEBUG]', logEntry2);
      fetch('http://127.0.0.1:7242/ingest/9192f36e-3223-469d-8e1d-e9ca20bc6049',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logEntry2)}).catch(()=>{});
      // #endregion
      
      // Check if response is OK and is JSON
      if (!response.ok) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9192f36e-3223-469d-8e1d-e9ca20bc6049',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileSystemClient.ts:52',message:'response not ok',data:{status,responseText:responseText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C'})}).catch(()=>{});
        // #endregion
        throw new Error(`HTTP ${response.status}: ${responseText.substring(0, 200)}`);
      }
      
      if (!contentType || !contentType.includes('application/json')) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9192f36e-3223-469d-8e1d-e9ca20bc6049',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileSystemClient.ts:58',message:'content-type mismatch',data:{contentType,responsePreview:responseText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C,E'})}).catch(()=>{});
        // #endregion
        throw new Error(`Expected JSON but got ${contentType}. Response: ${responseText.substring(0, 200)}`);
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9192f36e-3223-469d-8e1d-e9ca20bc6049',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileSystemClient.ts:63',message:'before JSON parse',data:{responseLength:responseText.length,isEmpty:responseText.length===0,preview:responseText.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      let data;
      try {
        // Use responseText we already have instead of response.json() to avoid consuming response twice
        data = JSON.parse(responseText);
        // #region agent log
        const logEntry3 = {location:'fileSystemClient.ts:70',message:'JSON parse success',data:{hasSuccess:!!data.success,hasContent:!!data.content},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
        console.log('[DEBUG]', logEntry3);
        fetch('http://127.0.0.1:7242/ingest/9192f36e-3223-469d-8e1d-e9ca20bc6049',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logEntry3)}).catch(()=>{});
        // #endregion
      } catch (parseError) {
        // #region agent log
        const logEntry4 = {location:'fileSystemClient.ts:74',message:'JSON parse failed',data:{error:parseError instanceof Error ? parseError.message : String(parseError),responsePreview:responseText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,E'};
        console.log('[DEBUG]', logEntry4);
        fetch('http://127.0.0.1:7242/ingest/9192f36e-3223-469d-8e1d-e9ca20bc6049',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logEntry4)}).catch(()=>{});
        // #endregion
        throw new Error(`Failed to parse JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}. Response: ${responseText.substring(0, 200)}`);
      }
      
      if (!data.success) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9192f36e-3223-469d-8e1d-e9ca20bc6049',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileSystemClient.ts:80',message:'API returned error',data:{error:data.error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        throw new Error(data.error || 'Failed to read file');
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9192f36e-3223-469d-8e1d-e9ca20bc6049',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'fileSystemClient.ts:85',message:'readFile success',data:{contentLength:data.content?.length || 0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D,E'})}).catch(()=>{});
      // #endregion
      return data.content;
    };
    
    if (useCache) {
      return performanceService.cached(
        cacheKey,
        fetchFile,
        60000 // Cache for 1 minute
      );
    }
    
    return fetchFile();
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
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text.substring(0, 200)}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got ${contentType}. Backend may not be running. Response: ${text.substring(0, 200)}`);
    }
    
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
    
    const fetchDir = async () => {
      const response = await fetch(`${this.baseUrl}/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text.substring(0, 200)}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got ${contentType}. Backend may not be running. Response: ${text.substring(0, 200)}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to list directory');
      }
      return data.entries;
    };
    
    if (useCache) {
      return performanceService.cached(
        cacheKey,
        fetchDir,
        30000 // Cache for 30 seconds
      );
    }
    
    return fetchDir();
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

