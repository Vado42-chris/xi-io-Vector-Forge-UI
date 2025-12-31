/**
 * Molting Service
 * Implements biological molting pattern for safe self-modification
 * 
 * The molting process:
 * 1. Grow new body (create working copy)
 * 2. Modify new body (edit working copy)
 * 3. Test new body (validate)
 * 4. Swap bodies (atomic file swap)
 * 5. Shed old body (cleanup, keep backup)
 * 
 * #hashtag: molting self-modification safe-editing
 */

import { FileSystemClient } from './fileSystemClient';

export interface MoltingResult {
  success: boolean;
  message: string;
  workingCopyPath?: string;
  backupPath?: string;
  preview?: string;
}

export class MoltingService {
  private fileSystem: FileSystemClient;

  constructor() {
    this.fileSystem = new FileSystemClient();
  }

  /**
   * Step 1: Grow New Body
   * Create a working copy of the file (like a snake growing new skin)
   */
  async createWorkingCopy(filePath: string): Promise<string> {
    const workingCopyPath = `${filePath}.new`;
    const currentCode = await this.fileSystem.readFile(filePath);
    await this.fileSystem.writeFile(workingCopyPath, currentCode);
    return workingCopyPath;
  }

  /**
   * Step 2: Modify New Body
   * Edit the working copy (like a spider hardening its new shell)
   */
  async editWorkingCopy(
    workingCopyPath: string,
    newCode: string
  ): Promise<void> {
    await this.fileSystem.writeFile(workingCopyPath, newCode);
  }

  /**
   * Step 3: Test New Body
   * Validate the working copy before swapping
   * (Like checking if the new shell is strong enough)
   */
  async validateWorkingCopy(workingCopyPath: string): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    try {
      const code = await this.fileSystem.readFile(workingCopyPath);

      // Basic syntax validation (balanced braces, parentheses, brackets)
      const braceBalance = (code.match(/{/g) || []).length === (code.match(/}/g) || []).length;
      const parenBalance = (code.match(/\(/g) || []).length === (code.match(/\)/g) || []).length;
      const bracketBalance = (code.match(/\[/g) || []).length === (code.match(/\]/g) || []).length;

      if (!braceBalance) errors.push('Unbalanced braces { }');
      if (!parenBalance) errors.push('Unbalanced parentheses ( )');
      if (!bracketBalance) errors.push('Unbalanced brackets [ ]');

      // Check for required React/TypeScript patterns
      if (code.includes('export') && !code.includes('import')) {
        errors.push('File exports but has no imports - may be incomplete');
      }

      // Check for unclosed strings (basic check)
      const singleQuotes = (code.match(/'/g) || []).length;
      const doubleQuotes = (code.match(/"/g) || []).length;
      if (singleQuotes % 2 !== 0) errors.push('Unclosed single quotes');
      if (doubleQuotes % 2 !== 0) errors.push('Unclosed double quotes');

      // Check for basic React component structure
      if (workingCopyPath.endsWith('.tsx') || workingCopyPath.endsWith('.jsx')) {
        if (!code.includes('React') && !code.includes('react')) {
          errors.push('React component missing React import');
        }
        if (!code.includes('export') && !code.includes('export default')) {
          errors.push('React component missing export');
        }
      }

      return {
        valid: errors.length === 0,
        errors
      };
    } catch (error) {
      errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        valid: false,
        errors
      };
    }
  }

  /**
   * Step 4: Swap Bodies
   * Atomic file swap - old becomes backup, new becomes active
   * (Like a snake shedding its skin - old skin falls away, new skin is revealed)
   */
  async swapBodies(filePath: string): Promise<MoltingResult> {
    const workingCopyPath = `${filePath}.new`;
    const timestamp = Date.now();
    const backupPath = `${filePath}.backup.${timestamp}`;

    try {
      // Read both versions
      const currentCode = await this.fileSystem.readFile(filePath);
      const newCode = await this.fileSystem.readFile(workingCopyPath);

      // Step 1: Backup current version (preserve old body)
      await this.fileSystem.writeFile(backupPath, currentCode);

      // Step 2: Atomic swap - write new code to active file
      await this.fileSystem.writeFile(filePath, newCode);

      // Step 3: Clean up working copy (shed the temporary shell)
      try {
        await this.fileSystem.deleteFile(workingCopyPath);
      } catch (error) {
        // Non-critical - working copy cleanup failed, but swap succeeded
        console.warn('Failed to cleanup working copy:', error);
      }

      // Step 4: Trigger reload (new body becomes active)
      this.triggerReload();

      return {
        success: true,
        message: 'Body swap successful! New body is now active.',
        backupPath,
        preview: newCode.substring(0, 500) + (newCode.length > 500 ? '...' : '')
      };
    } catch (error) {
      return {
        success: false,
        message: `Body swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        backupPath
      };
    }
  }

  /**
   * Rollback to Previous Body
   * Restore from backup if new body fails
   * (Like a spider retreating to its old shell if new one is damaged)
   */
  async rollback(filePath: string): Promise<MoltingResult> {
    try {
      // Find latest backup
      const dirPath = filePath.substring(0, filePath.lastIndexOf('/') || 0) || '.';
      const entries = await this.fileSystem.listDirectory(dirPath);
      
      const backups = entries
        .filter(e => e.name.startsWith(`${filePath.split('/').pop()}.backup.`))
        .sort((a, b) => {
          const aTime = parseInt(a.name.split('.').pop() || '0');
          const bTime = parseInt(b.name.split('.').pop() || '0');
          return bTime - aTime; // Latest first
        });

      if (backups.length === 0) {
        return {
          success: false,
          message: 'No backup found to rollback to'
        };
      }

      const latestBackup = backups[0];
      const backupCode = await this.fileSystem.readFile(latestBackup.name);
      
      // Restore backup
      await this.fileSystem.writeFile(filePath, backupCode);
      
      // Trigger reload
      this.triggerReload();

      return {
        success: true,
        message: `Rolled back to backup: ${latestBackup.name}`,
        backupPath: latestBackup.name
      };
    } catch (error) {
      return {
        success: false,
        message: `Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get Preview of Working Copy
   * Show what the new body will look like before swapping
   */
  async getWorkingCopyPreview(workingCopyPath: string, maxLength: number = 1000): Promise<string> {
    try {
      const code = await this.fileSystem.readFile(workingCopyPath);
      return code.length > maxLength 
        ? code.substring(0, maxLength) + '\n... (truncated)'
        : code;
    } catch (error) {
      return `Failed to read preview: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  /**
   * Check if Working Copy Exists
   * See if there's a new body waiting to be swapped
   */
  async hasWorkingCopy(filePath: string): Promise<boolean> {
    try {
      const workingCopyPath = `${filePath}.new`;
      await this.fileSystem.readFile(workingCopyPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Trigger Reload
   * Make the new body active (like a snake revealing its new skin)
   */
  private triggerReload(): void {
    // Give user a moment to see the success message
    setTimeout(() => {
      // Use Vite HMR if available, otherwise full reload
      if (typeof window !== 'undefined' && (window as any).__vite__) {
        // Vite HMR available
        window.location.reload();
      } else {
        // Full page reload
        window.location.reload();
      }
    }, 1000);
  }

  /**
   * Complete Molting Process
   * Orchestrates the full biological molting cycle
   */
  async molt(
    filePath: string,
    newCode: string
  ): Promise<MoltingResult> {
    try {
      // Step 1: Grow new body
      const workingCopyPath = await this.createWorkingCopy(filePath);

      // Step 2: Modify new body
      await this.editWorkingCopy(workingCopyPath, newCode);

      // Step 3: Test new body
      const validation = await this.validateWorkingCopy(workingCopyPath);
      
      if (!validation.valid) {
        // Clean up invalid working copy
        try {
          await this.fileSystem.deleteFile(workingCopyPath);
        } catch {
          // Ignore cleanup errors
        }
        
        return {
          success: false,
          message: `New body failed validation:\n${validation.errors.join('\n')}\n\nOld body preserved.`,
          workingCopyPath
        };
      }

      // Step 4: Swap bodies
      return await this.swapBodies(filePath);
    } catch (error) {
      return {
        success: false,
        message: `Molting failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

