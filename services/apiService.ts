/**
 * API Service - Handles all external API communication
 * Part of Patch 1: Foundation & Architecture
 */

export interface ApiRequest {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: unknown;
}

class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl?: string) {
    // Use current origin for API calls (same server), fallback to MCP URL only for Xibalba-specific calls
    // For task/filesystem APIs, use relative paths to connect to the same server (port 3000)
    this.baseUrl =
      baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request<T = unknown>(request: ApiRequest): Promise<ApiResponse<T>> {
    try {
      const url = request.url.startsWith('http') ? request.url : `${this.baseUrl}${request.url}`;

      const response = await fetch(url, {
        method: request.method || 'GET',
        headers: {
          ...this.defaultHeaders,
          ...request.headers,
        },
        body: request.body ? JSON.stringify(request.body) : undefined,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw {
          message: `API request failed: ${response.statusText}`,
          status: response.status,
          statusText: response.statusText,
          data,
        } as ApiError;
      }

      return {
        data: data as T,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw error as ApiError;
      }
      throw {
        message: error instanceof Error ? error.message : 'Unknown API error',
      } as ApiError;
    }
  }

  async get<T = unknown>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'GET', headers });
  }

  async post<T = unknown>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'POST', body, headers });
  }

  async put<T = unknown>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'PUT', body, headers });
  }

  async delete<T = unknown>(
    url: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'DELETE', headers });
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }
}

export const apiService = new ApiService();
export default apiService;
