/**
 * API Service Type Definitions
 * Defines types for the API abstraction layer
 */

/**
 * API Request Configuration
 */
export interface APIRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
}

/**
 * API Response
 */
export interface APIResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  timestamp: number;
}

/**
 * API Error
 */
export interface APIError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
  timestamp: number;
}

/**
 * API Cache Entry
 */
export interface APICacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

/**
 * API Service Configuration
 */
export interface APIServiceConfig {
  baseURL?: string;
  defaultTimeout?: number;
  defaultRetries?: number;
  enableCache?: boolean;
  defaultCacheTTL?: number;
  enableFallback?: boolean;
  fallbackHandlers?: Map<string, () => Promise<any>>;
}

/**
 * API Endpoint Definition
 */
export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description?: string;
  requiresAuth?: boolean;
  cacheable?: boolean;
  fallback?: () => Promise<any>;
}

/**
 * API Service Interface
 */
export interface IAPIService {
  /**
   * Make a request to an API endpoint
   */
  request<T = any>(endpoint: string, config?: APIRequestConfig): Promise<APIResponse<T>>;

  /**
   * Get data from cache if available
   */
  getFromCache<T = any>(key: string): APICacheEntry<T> | null;

  /**
   * Set data in cache
   */
  setCache<T = any>(key: string, data: T, ttl?: number): void;

  /**
   * Clear cache
   */
  clearCache(key?: string): void;

  /**
   * Register a fallback handler for an endpoint
   */
  registerFallback(endpoint: string, handler: () => Promise<any>): void;

  /**
   * Get service health status
   */
  getHealth(): Promise<{ status: 'healthy' | 'degraded' | 'down'; details?: any }>;
}

/**
 * API Provider Interface
 * For external API integrations (abstracted, not directly imported)
 */
export interface APIProvider {
  name: string;
  baseURL: string;
  authenticate?(): Promise<string>;
  request<T = any>(endpoint: string, config?: APIRequestConfig): Promise<APIResponse<T>>;
  healthCheck?(): Promise<boolean>;
}

