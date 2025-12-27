/**
 * Security Service
 * Core security utilities for input sanitization, validation, and security checks
 */

import { checkpointService } from './checkpointService';

/**
 * Security Service Interface
 */
export interface ISecurityService {
  /**
   * Sanitize user input to prevent XSS attacks
   */
  sanitizeInput(input: string): string;

  /**
   * Validate file type before upload
   */
  validateFileType(file: File, allowedTypes: string[]): boolean;

  /**
   * Validate file size
   */
  validateFileSize(file: File, maxSizeBytes: number): boolean;

  /**
   * Sanitize SVG content
   */
  sanitizeSvg(svg: string): string;

  /**
   * Validate URL for safe navigation
   */
  validateUrl(url: string): boolean;

  /**
   * Generate secure random token
   */
  generateSecureToken(length?: number): string;

  /**
   * Hash sensitive data (simple hash for client-side)
   */
  hashData(data: string): string;

  /**
   * Check if content contains potentially dangerous patterns
   */
  detectMaliciousContent(content: string): boolean;
}

class SecurityService implements ISecurityService {
  private dangerousPatterns: RegExp[] = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
  ];

  /**
   * Sanitize user input to prevent XSS attacks
   */
  sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove null bytes
    let sanitized = input.replace(/\0/g, '');

    // Remove dangerous patterns
    this.dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // Escape HTML entities
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return sanitized;
  }

  /**
   * Validate file type before upload
   */
  validateFileType(file: File, allowedTypes: string[]): boolean {
    if (!file || !allowedTypes || allowedTypes.length === 0) {
      return false;
    }

    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    return allowedTypes.some(allowed => {
      const allowedLower = allowed.toLowerCase();
      
      // Check MIME type
      if (fileType.includes(allowedLower)) {
        return true;
      }

      // Check file extension
      const extension = fileName.split('.').pop();
      if (extension && allowedLower.includes(extension)) {
        return true;
      }

      return false;
    });
  }

  /**
   * Validate file size
   */
  validateFileSize(file: File, maxSizeBytes: number): boolean {
    if (!file || maxSizeBytes <= 0) {
      return false;
    }

    return file.size <= maxSizeBytes;
  }

  /**
   * Sanitize SVG content
   */
  sanitizeSvg(svg: string): string {
    if (!svg || typeof svg !== 'string') {
      return '';
    }

    // Parse SVG and remove dangerous elements/attributes
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');

    // Remove script elements
    const scripts = doc.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    // Remove event handlers from all elements
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
        // Remove javascript: URLs
        if (attr.value && attr.value.toLowerCase().startsWith('javascript:')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    // Remove dangerous elements
    const dangerousElements = doc.querySelectorAll('iframe, object, embed, link[rel="stylesheet"]');
    dangerousElements.forEach(el => el.remove());

    // Serialize back to string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  }

  /**
   * Validate URL for safe navigation
   */
  validateUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
      return false;
    }

    try {
      const urlObj = new URL(url);
      
      // Only allow http, https, and data URLs (with restrictions)
      const allowedProtocols = ['http:', 'https:'];
      if (!allowedProtocols.includes(urlObj.protocol)) {
        // Allow data URLs only for images
        if (urlObj.protocol === 'data:') {
          return urlObj.pathname.startsWith('image/');
        }
        return false;
      }

      // Check for dangerous patterns
      if (urlObj.href.toLowerCase().includes('javascript:')) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for environments without crypto
      for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }

    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Hash sensitive data (simple hash for client-side)
   * Note: This is a simple hash for client-side use only.
   * For production, use proper cryptographic hashing on the server.
   */
  hashData(data: string): string {
    if (!data || typeof data !== 'string') {
      return '';
    }

    // Simple hash function (not cryptographically secure, but sufficient for client-side checksums)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(16);
  }

  /**
   * Check if content contains potentially dangerous patterns
   */
  detectMaliciousContent(content: string): boolean {
    if (!content || typeof content !== 'string') {
      return false;
    }

    return this.dangerousPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Create security checkpoint
   */
  async createSecurityCheckpoint(action: string, details: Record<string, any>): Promise<void> {
    await checkpointService.createCheckpoint(
      `security-${action}`,
      `Security action: ${action}`,
      [],
      details
    );
  }
}

// Singleton instance
export const securityService = new SecurityService();

export default securityService;

