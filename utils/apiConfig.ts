/**
 * API Configuration
 * Configureer hier de backend API endpoint voor content opslag
 */

// API endpoint URL - kan via environment variable worden overschreven
export const API_CONFIG = {
  // In development: gebruik localhost of je backend URL
  // In production: gebruik je live backend URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  
  // Endpoints
  ENDPOINTS: {
    CONTENT: '/content',
    CONTACT: '/contact',
  },
  
  // Timeout voor API requests (milliseconden)
  TIMEOUT: 10000,
  
  // Retry configuratie
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconden
} as const;

/**
 * Check of de API beschikbaar is
 */
export const isApiAvailable = (): boolean => {
  // Als VITE_API_BASE_URL niet is ingesteld, gebruik localStorage fallback
  return !!import.meta.env.VITE_API_BASE_URL;
};
