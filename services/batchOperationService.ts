/**
 * Batch Operation Service
 * Backend service for batch file operations
 * 
 * #hashtag: batch-operations service
 */

import { FileSystemClient } from './fileSystemClient';
import { undoHistoryService } from './undoHistoryService';
import { performanceService } from './performanceService';

export interface BatchOperation {
  type: 'create' | 'delete' | 'move' | 'copy';
  files: string[];
  destination?: string;
}

export interface OperationResult {
  success: boolean;
  file: string;
  error?: string;
}

class BatchOperationService {
  private fileSystem: FileSystemClient;

  constructor() {
    this.fileSystem = new FileSystemClient();
  }

  /**
   * Preview operation (dry run)
   */
  async previewOperation(operation: BatchOperation): Promise<{
    filesAffected: number;
    estimatedTime: number;
    warnings: string[];
  }> {
    const warnings: string[] = [];
    
    // Check if files exist (for delete/move operations)
    if (operation.type === 'delete' || operation.type === 'move') {
      for (const file of operation.files) {
        try {
          await this.fileSystem.getFileStats(file);
        } catch (error) {
          warnings.push(`File not found: ${file}`);
        }
      }
    }
    
    // Check if destination exists (for move/copy operations)
    if ((operation.type === 'move' || operation.type === 'copy') && operation.destination) {
      try {
        const stats = await this.fileSystem.getFileStats(operation.destination);
        if (!stats.isDirectory) {
          warnings.push(`Destination is not a directory: ${operation.destination}`);
        }
      } catch (error) {
        warnings.push(`Destination does not exist: ${operation.destination}`);
      }
    }
    
    // Estimate time (rough: 100ms per file)
    const estimatedTime = operation.files.length * 100;
    
    return {
      filesAffected: operation.files.length,
      estimatedTime,
      warnings,
    };
  }

  /**
   * Execute batch create operation
   * Creates undo entry for created files
   */
  async batchCreate(
    files: string[],
    onProgress?: (progress: number, currentFile: string) => void
  ): Promise<OperationResult[]> {
    const results: OperationResult[] = [];
    const total = files.length;
    
    // Create undo entry before creation (empty content since files don't exist yet)
    await undoHistoryService.addUndoEntry('create', files);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Create empty file
        await this.fileSystem.writeFile(file, '');
        results.push({ success: true, file });
        onProgress?.(((i + 1) / total) * 100, file);
      } catch (error) {
        results.push({
          success: false,
          file,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        onProgress?.(((i + 1) / total) * 100, file);
      }
    }
    
    return results;
  }

  /**
   * Execute batch delete operation
   * Saves file content before deletion for undo capability
   */
  async batchDelete(
    files: string[],
    onProgress?: (progress: number, currentFile: string) => void
  ): Promise<OperationResult[]> {
    const results: OperationResult[] = [];
    const total = files.length;
    
    // Read file contents before deletion for undo
    const fileContents = new Map<string, string>();
    for (const file of files) {
      try {
        const content = await this.fileSystem.readFile(file);
        fileContents.set(file, content);
      } catch (error) {
        // If we can't read the file, we'll still try to delete it
        // but won't be able to undo it
        console.warn(`Could not read file for undo: ${file}`, error);
      }
    }
    
    // Create undo entry before deletion
    await undoHistoryService.addUndoEntry('delete', files, undefined, fileContents);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await this.fileSystem.deleteFile(file);
        results.push({ success: true, file });
        onProgress?.(((i + 1) / total) * 100, file);
      } catch (error) {
        results.push({
          success: false,
          file,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        onProgress?.(((i + 1) / total) * 100, file);
      }
    }
    
    return results;
  }

  /**
   * Execute batch move operation
   * Saves file content and paths before move for undo capability
   */
  async batchMove(
    files: string[],
    destination: string,
    onProgress?: (progress: number, currentFile: string) => void
  ): Promise<OperationResult[]> {
    const results: OperationResult[] = [];
    const total = files.length;
    
    // Read file contents before move for undo
    const fileContents = new Map<string, string>();
    for (const file of files) {
      try {
        const content = await this.fileSystem.readFile(file);
        fileContents.set(file, content);
      } catch (error) {
        console.warn(`Could not read file for undo: ${file}`, error);
      }
    }
    
    // Create undo entry before move
    await undoHistoryService.addUndoEntry('move', files, destination, fileContents);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Extract filename and construct destination path
        const fileName = file.split('/').pop() || file;
        const destPath = `${destination}/${fileName}`;
        
        // Move the file
        await this.fileSystem.moveFile(file, destPath);
        
        results.push({ success: true, file });
        onProgress?.(((i + 1) / total) * 100, file);
      } catch (error) {
        results.push({
          success: false,
          file,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        onProgress?.(((i + 1) / total) * 100, file);
      }
    }
    
    return results;
  }

  /**
   * Execute batch copy operation
   * Optimized with chunking for large file sets
   */
  async batchCopy(
    files: string[],
    destination: string,
    onProgress?: (progress: number, currentFile: string) => void
  ): Promise<OperationResult[]> {
    // Use performance service for chunked processing
    return performanceService.batch(
      files,
      async (file: string) => {
        try {
          // Use cached read if available
          const cacheKey = `file:${file}`;
          const content = await performanceService.cached(
            cacheKey,
            () => this.fileSystem.readFile(file),
            60000 // Cache for 1 minute
          );
          
          // Write to destination
          const fileName = file.split('/').pop() || file;
          const destPath = `${destination}/${fileName}`;
          await this.fileSystem.writeFile(destPath, content);
          
          return { success: true, file };
        } catch (error) {
          return {
            success: false,
            file,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      },
      10, // Process 10 files at a time
      (completed, total) => {
        onProgress?.((completed / total) * 100, files[completed - 1] || '');
      }
    );
  }

  /**
   * Execute batch operation
   */
  async executeOperation(
    operation: BatchOperation,
    onProgress?: (progress: number, currentFile: string) => void
  ): Promise<OperationResult[]> {
    switch (operation.type) {
      case 'create':
        return this.batchCreate(operation.files, onProgress);
      case 'delete':
        return this.batchDelete(operation.files, onProgress);
      case 'move':
        if (!operation.destination) {
          throw new Error('Destination is required for move operation');
        }
        return this.batchMove(operation.files, operation.destination, onProgress);
      case 'copy':
        if (!operation.destination) {
          throw new Error('Destination is required for copy operation');
        }
        return this.batchCopy(operation.files, operation.destination, onProgress);
      default:
        throw new Error(`Unknown operation type: ${(operation as any).type}`);
    }
  }

  /**
   * Undo the last operation using undo history
   */
  async undoLastOperation(onProgress?: (progress: number, currentFile: string) => void): Promise<OperationResult[]> {
    const lastEntry = undoHistoryService.getLastEntry();
    if (!lastEntry) {
      throw new Error('No operation to undo');
    }

    const results: OperationResult[] = [];
    const total = lastEntry.files.length;

    try {
      switch (lastEntry.operation) {
        case 'create':
          // Undo create = delete created files
          for (let i = 0; i < lastEntry.files.length; i++) {
            const file = lastEntry.files[i];
            try {
              await this.fileSystem.deleteFile(file.path);
              results.push({ success: true, file: file.path });
              onProgress?.(((i + 1) / total) * 100, file.path);
            } catch (error) {
              results.push({
                success: false,
                file: file.path,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
              onProgress?.(((i + 1) / total) * 100, file.path);
            }
          }
          break;

        case 'delete':
          // Undo delete = restore files with saved content
          for (let i = 0; i < lastEntry.files.length; i++) {
            const file = lastEntry.files[i];
            try {
              if (file.content !== undefined) {
                await this.fileSystem.writeFile(file.path, file.content);
                results.push({ success: true, file: file.path });
              } else {
                results.push({
                  success: false,
                  file: file.path,
                  error: 'File content not saved for undo',
                });
              }
              onProgress?.(((i + 1) / total) * 100, file.path);
            } catch (error) {
              results.push({
                success: false,
                file: file.path,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
              onProgress?.(((i + 1) / total) * 100, file.path);
            }
          }
          break;

        case 'move':
          // Undo move = move files back to original location
          if (!lastEntry.destination) {
            throw new Error('Cannot undo move - destination not recorded');
          }
          for (let i = 0; i < lastEntry.files.length; i++) {
            const file = lastEntry.files[i];
            try {
              // Extract filename and construct original path
              const fileName = file.path.split('/').pop() || file.path;
              const originalPath = file.path; // Current path (after move)
              const undoPath = `${lastEntry.destination}/${fileName}`; // Move back
              
              await this.fileSystem.moveFile(originalPath, undoPath);
              results.push({ success: true, file: file.path });
              onProgress?.(((i + 1) / total) * 100, file.path);
            } catch (error) {
              results.push({
                success: false,
                file: file.path,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
              onProgress?.(((i + 1) / total) * 100, file.path);
            }
          }
          break;

        case 'copy':
          // Undo copy = delete copied files
          if (!lastEntry.destination) {
            throw new Error('Cannot undo copy - destination not recorded');
          }
          for (let i = 0; i < lastEntry.files.length; i++) {
            const file = lastEntry.files[i];
            try {
              const fileName = file.path.split('/').pop() || file.path;
              const copiedPath = `${lastEntry.destination}/${fileName}`;
              await this.fileSystem.deleteFile(copiedPath);
              results.push({ success: true, file: file.path });
              onProgress?.(((i + 1) / total) * 100, file.path);
            } catch (error) {
              results.push({
                success: false,
                file: file.path,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
              onProgress?.(((i + 1) / total) * 100, file.path);
            }
          }
          break;
      }

      // Remove the entry after successful undo
      undoHistoryService.removeEntry(lastEntry.id);
    } catch (error) {
      throw error;
    }

    return results;
  }
}

export const batchOperationService = new BatchOperationService();
