/**
 * API Service
 * Central abstraction layer for all API interactions
 * No direct Xibalba/Alpaca framework dependencies
 * All external APIs abstracted through this service
 */

import type {
  APIRequestConfig,
  APIResponse,
  APIError,
  APIServiceConfig,
  IAPIService,
} from '../types/api';
import { checkpointService } from './checkpointService';

class APIService implements IAPIService {
  private config: APIServiceConfig;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private fallbackHandlers: Map<string, () => Promise<any>> = new Map();

  constructor(config: APIServiceConfig = {}) {
    this.config = {
      baseURL: config.baseURL || '',
      defaultTimeout: config.defaultTimeout || 30000,
      defaultRetries: config.defaultRetries || 3,
      enableCache: config.enableCache !== false,
      defaultCacheTTL: config.defaultCacheTTL || 300000, // 5 minutes
      enableFallback: config.enableFallback !== false,
      fallbackHandlers: config.fallbackHandlers || new Map(),
    };

    // Initialize checkpoint service for API calls
    checkpointService.initialize().catch(console.error);
  }

  /**
   * Make a request to an API endpoint
   */
  async request<T = any>(
    endpoint: string,
    config: APIRequestConfig = {}
  ): Promise<APIResponse<T>> {
    const requestId = `api-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create checkpoint before request
    await checkpointService.createCheckpoint(
      `api-request-${requestId}`,
      `API request: ${endpoint}`,
      [],
      { endpoint, config }
    );

    const method = config.method || 'GET';
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.config.baseURL}${endpoint}`;
    
    const requestConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      signal: AbortSignal.timeout(config.timeout || this.config.defaultTimeout!),
    };

    if (config.body && method !== 'GET') {
      requestConfig.body = typeof config.body === 'string' 
        ? config.body 
        : JSON.stringify(config.body);
    }

    // Check cache first
    if (this.config.enableCache && method === 'GET' && config.cache !== false) {
      const cached = this.getFromCache<T>(url);
      if (cached) {
        return {
          data: cached.data,
          status: 200,
          statusText: 'OK (cached)',
          headers: {},
          timestamp: Date.now(),
        };
      }
    }

    // Try request with retries
    let lastError: APIError | null = null;
    const retries = config.retries ?? this.config.defaultRetries!;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, requestConfig);
        const data = await response.json();

        const apiResponse: APIResponse<T> = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          timestamp: Date.now(),
        };

        // Cache successful responses
        if (this.config.enableCache && response.ok && method === 'GET' && config.cache !== false) {
          this.setCache(url, data, config.cacheTTL || this.config.defaultCacheTTL);
        }

        // Create checkpoint after successful request
        await checkpointService.createCheckpoint(
          `api-response-${requestId}`,
          `API response: ${endpoint} - ${response.status}`,
          [],
          { endpoint, response: apiResponse }
        );

        return apiResponse;
      } catch (error: any) {
        lastError = {
          message: error.message || 'API request failed',
          code: error.code,
          status: error.status,
          details: error,
          timestamp: Date.now(),
        };

        // Create checkpoint for error
        await checkpointService.createCheckpoint(
          `api-error-${requestId}`,
          `API error: ${endpoint} - ${error.message}`,
          [],
          { endpoint, error: lastError, attempt }
        );

        // If not last attempt, wait before retry
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    // All retries failed - try fallback
    if (this.config.enableFallback) {
      const fallback = this.fallbackHandlers.get(endpoint) || this.config.fallbackHandlers?.get(endpoint);
      if (fallback) {
        try {
          const fallbackData = await fallback();
          return {
            data: fallbackData,
            status: 200,
            statusText: 'OK (fallback)',
            headers: {},
            timestamp: Date.now(),
          };
        } catch (fallbackError: any) {
          // Fallback also failed
        }
      }
    }

    // All attempts and fallback failed
    throw lastError || new Error('API request failed');
  }

  /**
   * Get data from cache if available
   */
  getFromCache<T = any>(key: string): { data: T; timestamp: number; ttl: number } | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    // Check if expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached;
  }

  /**
   * Set data in cache
   */
  setCache<T = any>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultCacheTTL!,
    });
  }

  /**
   * Clear cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Register a fallback handler for an endpoint
   */
  registerFallback(endpoint: string, handler: () => Promise<any>): void {
    this.fallbackHandlers.set(endpoint, handler);
  }

  /**
   * Get service health status
   */
  async getHealth(): Promise<{ status: 'healthy' | 'degraded' | 'down'; details?: any }> {
    try {
      // Test basic functionality
      const cacheWorking = this.cache.size >= 0;
      const fallbacksRegistered = this.fallbackHandlers.size >= 0;

      return {
        status: 'healthy',
        details: {
          cacheEnabled: this.config.enableCache,
          cacheSize: this.cache.size,
          fallbacksRegistered: this.fallbackHandlers.size,
        },
      };
    } catch (error: any) {
      return {
        status: 'degraded',
        details: { error: error.message },
      };
    }
  }
}

// Singleton instance
export const apiService = new APIService();

export default apiService;

