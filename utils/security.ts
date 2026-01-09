/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitize string input to prevent XSS attacks
 * Removes potentially dangerous characters and patterns
 */
export const sanitizeInput = (input: string, maxLength: number = 10000): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Truncate to max length
  let sanitized = input.substring(0, maxLength);

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove script tags and event handlers (basic protection)
  // Note: React already escapes HTML, but this adds extra protection
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:text\/html/gi, ''); // Remove data:text/html

  return sanitized.trim();
};

/**
 * Validate and sanitize URL to prevent XSS via image src
 */
export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();

  // Allow data:image URLs (for uploaded images)
  if (trimmed.startsWith('data:image/')) {
    // Validate data URL format
    const dataUrlPattern = /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+$/;
    if (dataUrlPattern.test(trimmed)) {
      return trimmed;
    }
    return '';
  }

  // Allow http/https URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // Remove potentially dangerous protocols
    if (trimmed.match(/^(https?):\/\//i)) {
      return trimmed;
    }
  }

  // Reject javascript:, data:text/html, and other dangerous protocols
  if (trimmed.match(/^(javascript|data|vbscript|file):/i)) {
    return '';
  }

  return '';
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate string length
 */
export const validateLength = (input: string, min: number, max: number): boolean => {
  if (!input || typeof input !== 'string') {
    return false;
  }
  const length = input.trim().length;
  return length >= min && length <= max;
};

/**
 * Simple encryption/decryption for localStorage (AES-like using Web Crypto API)
 * Note: This is client-side encryption. For production, use server-side encryption.
 */
export class LocalStorageEncryption {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly IV_LENGTH = 12;

  /**
   * Generate or retrieve encryption key
   */
  private static async getKey(): Promise<CryptoKey> {
    const keyName = 'timo-storage-key';
    let keyData = sessionStorage.getItem(keyName);

    if (!keyData) {
      // Generate new key
      const key = await crypto.subtle.generateKey(
        {
          name: this.ALGORITHM,
          length: this.KEY_LENGTH,
        },
        true, // extractable
        ['encrypt', 'decrypt']
      );

      // Export and store key
      const exportedKey = await crypto.subtle.exportKey('raw', key);
      keyData = Array.from(new Uint8Array(exportedKey))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      sessionStorage.setItem(keyName, keyData);
    }

    // Import key
    const keyBuffer = new Uint8Array(
      keyData.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );

    return await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: this.ALGORITHM, length: this.KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt data
   */
  static async encrypt(data: string): Promise<string> {
    try {
      const key = await this.getKey();
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);

      // Generate IV
      const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));

      // Encrypt
      const encrypted = await crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv: iv,
        },
        key,
        dataBuffer
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      // Convert to base64
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption error:', error);
      // Fallback to unencrypted storage if encryption fails
      return data;
    }
  }

  /**
   * Decrypt data
   */
  static async decrypt(encryptedData: string): Promise<string> {
    try {
      const key = await this.getKey();

      // Decode from base64
      const combined = Uint8Array.from(
        atob(encryptedData),
        c => c.charCodeAt(0)
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, this.IV_LENGTH);
      const encrypted = combined.slice(this.IV_LENGTH);

      // Decrypt
      const decrypted = await crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv: iv,
        },
        key,
        encrypted
      );

      // Convert to string
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      // If decryption fails, try to return as-is (for backward compatibility)
      return encryptedData;
    }
  }
}

/**
 * Rate limiter for form submissions
 */
export class RateLimiter {
  private static readonly STORAGE_KEY_PREFIX = 'rate-limit-';
  private static readonly DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute
  private static readonly DEFAULT_MAX_ATTEMPTS = 5;

  /**
   * Check if action is allowed
   */
  static isAllowed(
    key: string,
    maxAttempts: number = this.DEFAULT_MAX_ATTEMPTS,
    windowMs: number = this.DEFAULT_WINDOW_MS
  ): boolean {
    const storageKey = `${this.STORAGE_KEY_PREFIX}${key}`;
    const now = Date.now();

    try {
      const data = localStorage.getItem(storageKey);
      if (!data) {
        // First attempt
        localStorage.setItem(
          storageKey,
          JSON.stringify({ count: 1, resetAt: now + windowMs })
        );
        return true;
      }

      const { count, resetAt } = JSON.parse(data);

      if (now > resetAt) {
        // Window expired, reset
        localStorage.setItem(
          storageKey,
          JSON.stringify({ count: 1, resetAt: now + windowMs })
        );
        return true;
      }

      if (count >= maxAttempts) {
        return false; // Rate limit exceeded
      }

      // Increment count
      localStorage.setItem(
        storageKey,
        JSON.stringify({ count: count + 1, resetAt })
      );
      return true;
    } catch (error) {
      console.error('Rate limiter error:', error);
      // On error, allow the action (fail open)
      return true;
    }
  }

  /**
   * Get remaining attempts
   */
  static getRemainingAttempts(
    key: string,
    maxAttempts: number = this.DEFAULT_MAX_ATTEMPTS
  ): number {
    const storageKey = `${this.STORAGE_KEY_PREFIX}${key}`;
    const now = Date.now();

    try {
      const data = localStorage.getItem(storageKey);
      if (!data) {
        return maxAttempts;
      }

      const { count, resetAt } = JSON.parse(data);

      if (now > resetAt) {
        return maxAttempts;
      }

      return Math.max(0, maxAttempts - count);
    } catch (error) {
      return maxAttempts;
    }
  }

  /**
   * Get time until reset (in milliseconds)
   */
  static getResetTime(key: string): number {
    const storageKey = `${this.STORAGE_KEY_PREFIX}${key}`;
    const now = Date.now();

    try {
      const data = localStorage.getItem(storageKey);
      if (!data) {
        return 0;
      }

      const { resetAt } = JSON.parse(data);
      return Math.max(0, resetAt - now);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Reset rate limit for a key
   */
  static reset(key: string): void {
    const storageKey = `${this.STORAGE_KEY_PREFIX}${key}`;
    localStorage.removeItem(storageKey);
  }
}
