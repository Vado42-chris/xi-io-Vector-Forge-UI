/**
 * Performance Service
 * Provides caching, lazy loading, and background processing optimizations
 * 
 * #hashtag: performance service caching
 */

export interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
}

export interface PerformanceMetrics {
  cacheHits: number;
  cacheMisses: number;
  averageResponseTime: number;
  operationsCompleted: number;
  backgroundTasksRunning: number;
}

class PerformanceService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxCacheSize = 100;
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private metrics: PerformanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    averageResponseTime: 0,
    operationsCompleted: 0,
    backgroundTasksRunning: 0,
  };
  private backgroundTasks: Map<string, Promise<any>> = new Map();
  private responseTimeHistory: number[] = [];

  /**
   * Get cached data
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.metrics.cacheMisses++;
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.metrics.cacheMisses++;
      return null;
    }

    // Update access info
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.metrics.cacheHits++;
    
    return entry.data as T;
  }

  /**
   * Set cached data
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    // If cache is full, remove least recently used
    if (this.cache.size >= this.maxCacheSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      key,
      data,
      timestamp: now,
      expiresAt,
      accessCount: 0,
      lastAccessed: now,
    });
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  /**
   * Clear cache
   */
  clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Execute function with caching
   */
  async cached<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Check cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Execute and cache
    const startTime = Date.now();
    const result = await fn();
    const responseTime = Date.now() - startTime;
    
    this.recordResponseTime(responseTime);
    this.set(key, result, ttl);
    
    return result;
  }

  /**
   * Execute function in background
   */
  async background<T>(
    taskId: string,
    fn: () => Promise<T>,
    onComplete?: (result: T) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    if (this.backgroundTasks.has(taskId)) {
      // Task already running
      return;
    }

    this.metrics.backgroundTasksRunning++;
    const taskPromise = fn()
      .then((result) => {
        if (onComplete) {
          onComplete(result);
        }
        this.metrics.operationsCompleted++;
        return result;
      })
      .catch((error) => {
        if (onError) {
          onError(error);
        }
        throw error;
      })
      .finally(() => {
        this.backgroundTasks.delete(taskId);
        this.metrics.backgroundTasksRunning--;
      });

    this.backgroundTasks.set(taskId, taskPromise);
  }

  /**
   * Batch operations with chunking
   */
  async batch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    chunkSize: number = 10,
    onProgress?: (completed: number, total: number) => void
  ): Promise<R[]> {
    const results: R[] = [];
    const total = items.length;

    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(
        chunk.map(item => processor(item))
      );
      results.push(...chunkResults);

      if (onProgress) {
        onProgress(Math.min(i + chunkSize, total), total);
      }

      // Yield to event loop
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    return results;
  }

  /**
   * Debounce function calls
   */
  debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  /**
   * Throttle function calls
   */
  throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;

    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        fn(...args);
      }
    };
  }

  /**
   * Lazy load data
   */
  lazyLoad<T>(
    key: string,
    loader: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    return this.cached(key, loader, ttl);
  }

  /**
   * Record response time
   */
  private recordResponseTime(time: number): void {
    this.responseTimeHistory.push(time);
    
    // Keep only last 100 measurements
    if (this.responseTimeHistory.length > 100) {
      this.responseTimeHistory.shift();
    }

    // Update average
    const sum = this.responseTimeHistory.reduce((a, b) => a + b, 0);
    this.metrics.averageResponseTime = sum / this.responseTimeHistory.length;
  }

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    entries: Array<{
      key: string;
      age: number;
      accessCount: number;
    }>;
  } {
    const totalRequests = this.metrics.cacheHits + this.metrics.cacheMisses;
    const hitRate = totalRequests > 0 
      ? this.metrics.cacheHits / totalRequests 
      : 0;

    const entries = Array.from(this.cache.values()).map(entry => ({
      key: entry.key,
      age: Date.now() - entry.timestamp,
      accessCount: entry.accessCount,
    }));

    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate,
      entries,
    };
  }

  /**
   * Preload data
   */
  async preload<T>(
    keys: string[],
    loader: (key: string) => Promise<T>,
    ttl?: number
  ): Promise<void> {
    const promises = keys.map(key =>
      this.cached(key, () => loader(key), ttl)
    );
    await Promise.all(promises);
  }

  /**
   * Clear expired cache entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Start periodic cache cleanup
   */
  startCacheCleanup(interval: number = 60000): void {
    setInterval(() => {
      this.clearExpired();
    }, interval);
  }
}

export const performanceService = new PerformanceService();

// Start cache cleanup on initialization
if (typeof window !== 'undefined') {
  performanceService.startCacheCleanup();
}

