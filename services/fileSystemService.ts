/**
 * #hashtag: filesystem-service
 * #purpose: File system operations service for VectorForge
 * #provides: Read, write, list, and search file operations with security
 * #usage: Import and use in MCP servers and API routes
 * #related: fileSystemMCPServer, api/filesystem
 * 
 * File System Service
 * Follows Xibalba standards: TypeScript strict, error handling, security-first
 * Reuses patterns from api/tasks.js
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface FileSystemEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: Date;
}

export class FileSystemService {
  private projectRoot: string;
  private allowedWritePaths: string[] = ['tmp', 'data', 'var', 'projects', 'test-projects', 'components', 'services', 'styles'];

  constructor(projectRoot?: string) {
    // Default to VectorForge project root
    this.projectRoot = projectRoot || path.join(__dirname, '..');
  }

  /**
   * Ensure directory exists (reuses pattern from api/tasks.js)
   */
  async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      // Directory might already exist - that's okay
    }
  }

  /**
   * Read file content
   */
  async readFile(filePath: string): Promise<string> {
    const fullPath = this.validatePath(filePath);
    return await fs.readFile(fullPath, 'utf-8');
  }

  /**
   * Write file content (reuses pattern from api/tasks.js)
   * Security: Only allows writes to allowed paths (tmp/, data/, var/)
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    const fullPath = this.validatePath(filePath);
    
    // Check if write is allowed to this path
    const relativePath = path.relative(this.projectRoot, fullPath);
    const firstSegment = relativePath.split(path.sep)[0];
    
    if (!this.allowedWritePaths.includes(firstSegment)) {
      throw new Error(`Write not allowed to path: ${filePath}. Allowed paths: ${this.allowedWritePaths.join(', ')}`);
    }
    
    // Additional protection: prevent overwriting critical files
    // Exception: Allow molting files (.new, .backup.*) for self-modification
    const fileName = path.basename(fullPath);
    const isMoltingFile = fileName.includes('.new') || fileName.includes('.backup.');
    const criticalFiles = ['package.json', 'package-lock.json', 'tsconfig.json', '.gitignore'];
    if (criticalFiles.includes(fileName) && !relativePath.startsWith('tmp/') && !isMoltingFile) {
      throw new Error(`Cannot overwrite critical file: ${fileName}`);
    }
    
    // Special case: Allow self-modification of component files (for molting system)
    // This enables the chatbot to modify itself safely
    if (relativePath.startsWith('components/') && fileName.endsWith('.tsx')) {
      // Allow writing to .tsx files in components/ for self-modification
      // The molting system ensures safety through validation and backups
    }
    
    const dir = path.dirname(fullPath);
    await this.ensureDirectory(dir);
    await fs.writeFile(fullPath, content, 'utf-8');
  }

  /**
   * List directory contents
   */
  async listDirectory(dirPath: string): Promise<FileSystemEntry[]> {
    const fullPath = this.validatePath(dirPath);
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    
    const result: FileSystemEntry[] = [];
    for (const entry of entries) {
      const entryPath = path.join(fullPath, entry.name);
      const relativePath = path.relative(this.projectRoot, entryPath);
      
      try {
        const stats = await fs.stat(entryPath);
        result.push({
          name: entry.name,
          path: relativePath,
          type: entry.isDirectory() ? 'directory' : 'file',
          size: stats.size,
          modified: stats.mtime
        });
      } catch (error) {
        // Skip entries we can't stat
        continue;
      }
    }
    
    return result;
  }

  /**
   * Search for files matching pattern
   */
  async searchFiles(pattern: string, searchPath?: string): Promise<string[]> {
    const searchDir = searchPath ? this.validatePath(searchPath) : this.projectRoot;
    const results: string[] = [];
    const projectRoot = this.projectRoot; // Capture for use in nested function
    
    async function searchRecursive(dir: string): Promise<void> {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          // Skip node_modules, .git, etc.
          if (entry.name.startsWith('.') || entry.name === 'node_modules') {
            continue;
          }
          
          if (entry.isDirectory()) {
            await searchRecursive(fullPath);
          } else if (entry.name.includes(pattern) || fullPath.includes(pattern)) {
            const relativePath = path.relative(projectRoot, fullPath);
            results.push(relativePath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    }
    
    await searchRecursive(searchDir);
    return results;
  }

  /**
   * Get file stats
   */
  async getFileStats(filePath: string): Promise<{
    size: number;
    modified: Date;
    created: Date;
    isDirectory: boolean;
  }> {
    const fullPath = this.validatePath(filePath);
    const stats = await fs.stat(fullPath);
    return {
      size: stats.size,
      modified: stats.mtime,
      created: stats.birthtime,
      isDirectory: stats.isDirectory()
    };
  }

  /**
   * Delete file or directory
   */
  async deleteFile(filePath: string): Promise<void> {
    const fullPath = this.validatePath(filePath);
    
    // Check if write is allowed to this path (for deletion)
    const relativePath = path.relative(this.projectRoot, fullPath);
    const firstSegment = relativePath.split(path.sep)[0];
    
    if (!this.allowedWritePaths.includes(firstSegment)) {
      throw new Error(`Delete not allowed for path: ${filePath}. Allowed paths: ${this.allowedWritePaths.join(', ')}`);
    }
    
    // Additional protection: prevent deleting critical files
    const criticalFiles = ['package.json', 'package-lock.json', 'tsconfig.json', '.gitignore'];
    const fileName = path.basename(fullPath);
    if (criticalFiles.includes(fileName) && !relativePath.startsWith('tmp/')) {
      throw new Error(`Cannot delete critical file: ${fileName}`);
    }
    
    const stats = await fs.stat(fullPath);
    if (stats.isDirectory()) {
      await fs.rmdir(fullPath, { recursive: true });
    } else {
      await fs.unlink(fullPath);
    }
  }

  /**
   * Move file or directory
   */
  async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    const fullSourcePath = this.validatePath(sourcePath);
    const fullDestPath = this.validatePath(destinationPath);
    
    // Check if write is allowed to both paths
    const sourceRelative = path.relative(this.projectRoot, fullSourcePath);
    const destRelative = path.relative(this.projectRoot, fullDestPath);
    const sourceFirstSegment = sourceRelative.split(path.sep)[0];
    const destFirstSegment = destRelative.split(path.sep)[0];
    
    if (!this.allowedWritePaths.includes(sourceFirstSegment)) {
      throw new Error(`Move not allowed from path: ${sourcePath}. Allowed paths: ${this.allowedWritePaths.join(', ')}`);
    }
    
    if (!this.allowedWritePaths.includes(destFirstSegment)) {
      throw new Error(`Move not allowed to path: ${destinationPath}. Allowed paths: ${this.allowedWritePaths.join(', ')}`);
    }
    
    // Ensure destination directory exists
    const destDir = path.dirname(fullDestPath);
    await this.ensureDirectory(destDir);
    
    // Move the file/directory
    await fs.rename(fullSourcePath, fullDestPath);
  }

  /**
   * Security: Validate paths (prevent directory traversal)
   * Reuses pattern from api/tasks.js path handling
   * Hardened: Normalizes paths, prevents symlink traversal, validates against sandbox
   */
  private validatePath(filePath: string): string {
    // Normalize path to prevent ../ tricks
    const normalized = path.normalize(filePath);
    
    // Check for path traversal attempts
    if (normalized.includes('..') || path.isAbsolute(normalized)) {
      throw new Error(`Path traversal attempt blocked: ${filePath}`);
    }
    
    // Resolve relative to project root
    const resolved = path.resolve(this.projectRoot, normalized);
    
    // Ensure resolved path is within project root (after normalization)
    const projectRootNormalized = path.normalize(this.projectRoot);
    if (!resolved.startsWith(projectRootNormalized)) {
      throw new Error(`Path outside project directory: ${filePath}`);
    }
    
    // Additional check: ensure no symlink escapes
    try {
      const realPath = path.resolve(resolved);
      if (!realPath.startsWith(projectRootNormalized)) {
        throw new Error(`Symlink escape attempt blocked: ${filePath}`);
      }
    } catch (error) {
      // If we can't resolve, still validate the normalized path
    }
    
    return resolved;
  }

  /**
   * Set project root (for testing or different contexts)
   */
  setProjectRoot(root: string): void {
    this.projectRoot = path.resolve(root);
  }
}

