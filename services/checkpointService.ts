/**
 * Checkpoint Service
 * Prevents loss of work by creating incremental checkpoints
 * Saves state before major operations and on intervals
 */

interface Checkpoint {
  id: string;
  timestamp: number;
  files: string[];
  metadata: {
    checkpoint: string;
    description: string;
    branch?: string;
    commit?: string;
  };
  state: Record<string, any>;
}

class CheckpointService {
  private checkpoints: Checkpoint[] = [];
  private checkpointDir = '.checkpoints';
  private maxCheckpoints = 50;
  private autoSaveInterval = 30000; // 30 seconds
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * Initialize checkpoint service
   */
  async initialize(): Promise<void> {
    // Create checkpoint directory
    if (typeof window === 'undefined') {
      // Node.js environment
      const fs = await import('fs');
      const path = await import('path');
      const checkpointPath = path.join(process.cwd(), this.checkpointDir);
      if (!fs.existsSync(checkpointPath)) {
        fs.mkdirSync(checkpointPath, { recursive: true });
      }
    } else {
      // Browser environment - use IndexedDB
      await this.initIndexedDB();
    }

    // Start auto-save
    this.startAutoSave();
  }

  /**
   * Initialize IndexedDB for browser
   */
  private async initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('VectorForgeCheckpoints', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('checkpoints')) {
          db.createObjectStore('checkpoints', { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Create a checkpoint
   */
  async createCheckpoint(
    checkpoint: string,
    description: string,
    files?: string[],
    state?: Record<string, any>
  ): Promise<string> {
    const checkpointId = `checkpoint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const checkpointData: Checkpoint = {
      id: checkpointId,
      timestamp: Date.now(),
      files: files || [],
      metadata: {
        checkpoint,
        description,
      },
      state: state || {},
    };

    this.checkpoints.push(checkpointData);

    // Save to disk/IndexedDB
    await this.saveCheckpoint(checkpointData);

    // Limit checkpoints
    if (this.checkpoints.length > this.maxCheckpoints) {
      const oldest = this.checkpoints.shift();
      if (oldest) {
        await this.deleteCheckpoint(oldest.id);
      }
    }

    return checkpointId;
  }

  /**
   * Save checkpoint to storage
   */
  private async saveCheckpoint(checkpoint: Checkpoint): Promise<void> {
    if (typeof window === 'undefined') {
      // Node.js - save to file
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(
        process.cwd(),
        this.checkpointDir,
        `${checkpoint.id}.json`
      );
      fs.writeFileSync(filePath, JSON.stringify(checkpoint, null, 2));
    } else {
      // Browser - save to IndexedDB
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('VectorForgeCheckpoints', 1);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['checkpoints'], 'readwrite');
          const store = transaction.objectStore('checkpoints');
          const putRequest = store.put(checkpoint);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        };
        request.onerror = () => reject(request.error);
      });
    }
  }

  /**
   * Load checkpoint
   */
  async loadCheckpoint(checkpointId: string): Promise<Checkpoint | null> {
    if (typeof window === 'undefined') {
      // Node.js - load from file
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(
        process.cwd(),
        this.checkpointDir,
        `${checkpointId}.json`
      );
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      }
    } else {
      // Browser - load from IndexedDB
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('VectorForgeCheckpoints', 1);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['checkpoints'], 'readonly');
          const store = transaction.objectStore('checkpoints');
          const getRequest = store.get(checkpointId);
          getRequest.onsuccess = () => resolve(getRequest.result || null);
          getRequest.onerror = () => reject(getRequest.error);
        };
        request.onerror = () => reject(request.error);
      });
    }
    return null;
  }

  /**
   * Delete checkpoint
   */
  private async deleteCheckpoint(checkpointId: string): Promise<void> {
    if (typeof window === 'undefined') {
      // Node.js - delete file
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(
        process.cwd(),
        this.checkpointDir,
        `${checkpointId}.json`
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } else {
      // Browser - delete from IndexedDB
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('VectorForgeCheckpoints', 1);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['checkpoints'], 'readwrite');
          const store = transaction.objectStore('checkpoints');
          const deleteRequest = store.delete(checkpointId);
          deleteRequest.onsuccess = () => resolve();
          deleteRequest.onerror = () => reject(deleteRequest.error);
        };
        request.onerror = () => reject(request.error);
      });
    }
  }

  /**
   * Start auto-save
   */
  startAutoSave(): void {
    if (this.intervalId) {
      this.stopAutoSave();
    }

    this.intervalId = setInterval(() => {
      this.createCheckpoint(
        'auto-save',
        'Automatic checkpoint',
        [],
        { timestamp: Date.now() }
      ).catch(console.error);
    }, this.autoSaveInterval);
  }

  /**
   * Stop auto-save
   */
  stopAutoSave(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Get latest checkpoint
   */
  getLatestCheckpoint(): Checkpoint | null {
    return this.checkpoints.length > 0
      ? this.checkpoints[this.checkpoints.length - 1]
      : null;
  }

  /**
   * List all checkpoints
   */
  listCheckpoints(): Checkpoint[] {
    return [...this.checkpoints].sort((a, b) => b.timestamp - a.timestamp);
  }
}

// Singleton instance
export const checkpointService = new CheckpointService();

// Auto-initialize
if (typeof window !== 'undefined') {
  checkpointService.initialize().catch(console.error);
}

export default checkpointService;

