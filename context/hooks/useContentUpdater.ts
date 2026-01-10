/**
 * Generic content updater hook
 * Eliminates duplication in updateHero, updateAbout, updatePartners, updateContact
 */

import { sanitizeInput, sanitizeUrl } from '../../utils/security';
import { ContentState } from '../ContentContext';

type FieldConfig = {
  maxLength: number;
  sanitizeUrl?: boolean;
};

type FieldConfigMap<T> = {
  [K in keyof T]?: FieldConfig | number;
};

/**
 * Creates an updater function for a content section
 * Handles sanitization based on field configuration
 */
export function createContentUpdater<T extends Record<string, any>>(
  section: keyof ContentState,
  fieldConfig: FieldConfigMap<T>
) {
  return (key: keyof T, value: string): string => {
    const config = fieldConfig[key];
    
    // Determine max length
    const maxLength = typeof config === 'number' 
      ? config 
      : config?.maxLength ?? 500;
    
    // Determine if URL sanitization is needed
    const useUrlSanitization = typeof config === 'object' && config.sanitizeUrl === true;
    
    // Apply appropriate sanitization
    if (useUrlSanitization) {
      return sanitizeUrl(value) || value;
    }
    
    return sanitizeInput(value, maxLength);
  };
}

/**
 * Field configurations for each content section
 */
export const HERO_FIELD_CONFIG = {
  tag: 500,
  titleLine1: 500,
  titleLine2: 500,
  description: 5000,
  buttonPrimary: 500,
  buttonSecondary: 500,
} as const;

export const ABOUT_FIELD_CONFIG = {
  tag: 500,
  titleLine1: 500,
  titleLine2: 500,
  paragraph1: 5000,
  paragraph2: 5000,
  paragraph3: 5000,
  feature1Title: 500,
  feature1Description: 500,
  feature2Title: 500,
  feature2Description: 500,
  imageUrl: { maxLength: 2000, sanitizeUrl: true },
  imageCaption: 500,
  imageSubcaption: 500,
} as const;

export const PARTNERS_FIELD_CONFIG = {
  title: 500,
  subtitle: 500,
  description: 2000,
  feature1Title: 500,
  feature1Description: 2000,
  feature2Title: 500,
  feature2Description: 3000,
  feature3Title: 500,
  feature3Description: 3000,
} as const;

export const CONTACT_FIELD_CONFIG = {
  title: 500,
  introText: 2000,
  addressStreet: 500,
  addressPostalCode: 500,
  addressCity: 500,
  addressNote: 500,
  email: 500,
  phone: 500,
  formTitle: 500,
  buttonText: 500,
} as const;
