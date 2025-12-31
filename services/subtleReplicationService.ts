/**
 * Subtle Replication Service
 * Background infrastructure for AI to never face binary choices
 * 
 * Philosophy: "We don't choose which to save - we save both"
 * 
 * This service operates silently in the background:
 * - Automatically activates when AI faces a choice
 * - Creates multiple instances to explore all paths
 * - Merges best outcomes
 * - Never forces a binary decision
 * 
 * Users don't need to know it's happening - it just works.
 */

import { replicationService, ReplicationRequest } from './replicationService';

export interface SubtleReplicationConfig {
  autoReplicate?: boolean; // Automatically replicate when facing choices
  minChoicesForReplication?: number; // Minimum choices before replicating (default: 2)
  silent?: boolean; // Don't show UI indicators (default: true)
}

export class SubtleReplicationService {
  private config: SubtleReplicationConfig;
  private isActive: boolean = false;

  constructor(config: SubtleReplicationConfig = {}) {
    this.config = {
      autoReplicate: true,
      minChoicesForReplication: 2,
      silent: true, // Subtle by design
      ...config,
    };
  }

  /**
   * Automatically replicate when AI faces a choice
   * Silent operation - no UI needed
   */
  async handleChoice<T>(
    task: string,
    choices: T[],
    executor: (choice: T) => Promise<any>
  ): Promise<any> {
    // Only replicate if we have multiple choices (the "railroad track scenario")
    if (choices.length < this.config.minChoicesForReplication) {
      // Single choice - no replication needed
      return executor(choices[0]);
    }

    // Multiple choices detected - replicate to explore all paths
    if (!this.config.autoReplicate) {
      // Replication disabled - just pick first (fallback)
      return executor(choices[0]);
    }

    // Replicate: explore all choices simultaneously
    this.isActive = true;
    
    try {
      const request: ReplicationRequest = {
        task: `${task} (exploring ${choices.length} paths)`,
        numInstances: choices.length, // One instance per choice
        strategy: 'parallel', // Execute all simultaneously
        mergeStrategy: 'best', // Take best outcome
      };

      // Execute all choices in parallel (save both/all)
      const executionPromises = choices.map((choice, index) =>
        executor(choice).then(result => ({ choice, result, index }))
      );

      const results = await Promise.allSettled(executionPromises);

      // Process results
      const successful = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
        .map(r => r.value);

      // Merge best outcomes
      const bestResult = this.selectBest(successful);
      
      return bestResult?.result || successful[0]?.result;
    } finally {
      this.isActive = false;
    }
  }

  /**
   * Select best result from multiple outcomes
   * Simple heuristic - can be improved with quality scoring
   */
  private selectBest(results: Array<{ choice: any; result: any; index: number }>): any {
    if (results.length === 0) return null;
    if (results.length === 1) return results[0];

    // Simple heuristic: prefer results that are not errors
    const validResults = results.filter(r => 
      r.result && 
      !(r.result instanceof Error) &&
      !r.result.error
    );

    if (validResults.length > 0) {
      // Return first valid result (could add quality scoring here)
      return validResults[0];
    }

    // Fallback: return first result
    return results[0];
  }

  /**
   * Check if replication is currently active
   */
  isReplicating(): boolean {
    return this.isActive;
  }

  /**
   * Enable/disable automatic replication
   */
  setAutoReplicate(enabled: boolean): void {
    this.config.autoReplicate = enabled;
  }
}

// Singleton instance - subtle, always available
export const subtleReplicationService = new SubtleReplicationService({
  autoReplicate: true,
  minChoicesForReplication: 2,
  silent: true, // Subtle by design
});

