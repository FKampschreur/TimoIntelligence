/**
 * Application-wide constants
 * Replaces magic numbers scattered throughout the codebase
 */

// Admin Panel Constants
export const ADMIN_CONSTANTS = {
  SESSION_DURATION_MS: 8 * 60 * 60 * 1000, // 8 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes
} as const;

// File Upload Constants
export const FILE_CONSTANTS = {
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
} as const;

// Form Validation Constants
export const VALIDATION_CONSTANTS = {
  CONTACT_FORM: {
    MAX_ATTEMPTS: 5,
    RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
    MESSAGE_MIN_LENGTH: 10,
    MESSAGE_MAX_LENGTH: 5000,
    NAME_MAX_LENGTH: 100,
  },
} as const;

// Ecosystem Constants
export const ECOSYSTEM_CONSTANTS = {
  BASE_HEIGHT_MOBILE: 450,
  BASE_HEIGHT_DESKTOP: 600,
  RADIUS_MULTIPLIER_MAX: 1.5,
  RADIUS_SCALE_FACTOR: 0.05,
} as const;

// Input Length Limits
export const INPUT_LIMITS = {
  HERO: {
    DEFAULT: 5000,
  },
  SOLUTION: {
    TITLE: 500,
    SUBTITLE: 500,
    DESCRIPTION: 2000,
    DETAIL_TITLE: 500,
    DETAIL_TEXT: 10000,
  },
  ABOUT: {
    DEFAULT: 500,
    PARAGRAPH: 5000,
    IMAGE_URL: 2000,
  },
  PARTNERS: {
    DEFAULT: 500,
    DESCRIPTION: 2000,
  },
  CONTACT: {
    DEFAULT: 500,
    INTRO_TEXT: 2000,
  },
} as const;
