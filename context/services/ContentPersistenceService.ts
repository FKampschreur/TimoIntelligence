/**
 * Content Persistence Service
 * Handles loading and saving content from API and localStorage
 * Extracted from ContentContext to separate concerns
 */

import { ContentState } from '../ContentContext';
import { fetchContent, saveContent } from '../../utils/apiService';
import { isApiAvailable } from '../../utils/apiConfig';
import { LocalStorageEncryption } from '../../utils/security';
import { validateContentStructure } from '../validators/contentValidator';

export interface PersistenceResult {
  savedToApi: boolean;
  savedToLocalStorage: boolean;
  error?: string;
}

export class ContentPersistenceService {
  private static readonly STORAGE_KEY = 'timo-intelligence-content';

  /**
   * Migrate content to latest version
   * Updates specific fields that have been changed in defaultContent
   */
  private static migrateContent(content: ContentState, defaultContent: ContentState): ContentState {
    let needsUpdate = false;
    const migratedContent = { ...content };

    // Migrate solution content (Timo Tender, Timo Fleet, etc.)
    if (migratedContent.solutions && Array.isArray(migratedContent.solutions)) {
      // Migrate Timo Tender
      const tenderIndex = migratedContent.solutions.findIndex(s => s.id === 'tender' || s.title === 'Timo Tender');
      if (tenderIndex !== -1) {
        const defaultTender = defaultContent.solutions.find(s => s.id === 'tender' || s.title === 'Timo Tender');
        if (defaultTender) {
          // Update if content differs from default (migration needed)
          if (migratedContent.solutions[tenderIndex].description !== defaultTender.description ||
              migratedContent.solutions[tenderIndex].detailTitle !== defaultTender.detailTitle ||
              migratedContent.solutions[tenderIndex].detailText !== defaultTender.detailText) {
            migratedContent.solutions[tenderIndex] = {
              ...migratedContent.solutions[tenderIndex],
              description: defaultTender.description,
              detailTitle: defaultTender.detailTitle,
              detailText: defaultTender.detailText
            };
            needsUpdate = true;
            console.log('Timo Tender content gemigreerd naar nieuwe versie');
          }
        }
      }

      // Migrate Timo Fleet
      const fleetIndex = migratedContent.solutions.findIndex(s => s.id === 'fleet' || s.title === 'Timo Fleet');
      if (fleetIndex !== -1) {
        const defaultFleet = defaultContent.solutions.find(s => s.id === 'fleet' || s.title === 'Timo Fleet');
        if (defaultFleet) {
          // Update if content differs from default (migration needed)
          if (migratedContent.solutions[fleetIndex].description !== defaultFleet.description ||
              migratedContent.solutions[fleetIndex].detailTitle !== defaultFleet.detailTitle ||
              migratedContent.solutions[fleetIndex].detailText !== defaultFleet.detailText) {
            migratedContent.solutions[fleetIndex] = {
              ...migratedContent.solutions[fleetIndex],
              description: defaultFleet.description,
              detailTitle: defaultFleet.detailTitle,
              detailText: defaultFleet.detailText
            };
            needsUpdate = true;
            console.log('Timo Fleet content gemigreerd naar nieuwe versie');
          }
        }
      }

      // Migrate Timo Insights
      const insightsIndex = migratedContent.solutions.findIndex(s => s.id === 'insights' || s.title === 'Timo Insights');
      if (insightsIndex !== -1) {
        const defaultInsights = defaultContent.solutions.find(s => s.id === 'insights' || s.title === 'Timo Insights');
        if (defaultInsights) {
          // Update if content differs from default (migration needed)
          if (migratedContent.solutions[insightsIndex].description !== defaultInsights.description ||
              migratedContent.solutions[insightsIndex].detailTitle !== defaultInsights.detailTitle ||
              migratedContent.solutions[insightsIndex].detailText !== defaultInsights.detailText) {
            migratedContent.solutions[insightsIndex] = {
              ...migratedContent.solutions[insightsIndex],
              description: defaultInsights.description,
              detailTitle: defaultInsights.detailTitle,
              detailText: defaultInsights.detailText
            };
            needsUpdate = true;
            console.log('Timo Insights content gemigreerd naar nieuwe versie');
          }
        }
      }

      // Migrate Timo Vision
      const visionIndex = migratedContent.solutions.findIndex(s => s.id === 'vision' || s.title === 'Timo Vision');
      if (visionIndex !== -1) {
        const defaultVision = defaultContent.solutions.find(s => s.id === 'vision' || s.title === 'Timo Vision');
        if (defaultVision) {
          // Update if content differs from default (migration needed)
          if (migratedContent.solutions[visionIndex].description !== defaultVision.description ||
              migratedContent.solutions[visionIndex].detailTitle !== defaultVision.detailTitle ||
              migratedContent.solutions[visionIndex].detailText !== defaultVision.detailText) {
            migratedContent.solutions[visionIndex] = {
              ...migratedContent.solutions[visionIndex],
              description: defaultVision.description,
              detailTitle: defaultVision.detailTitle,
              detailText: defaultVision.detailText
            };
            needsUpdate = true;
            console.log('Timo Vision content gemigreerd naar nieuwe versie');
          }
        }
      }
    }

    // Migrate Partners content
    if (migratedContent.partners && defaultContent.partners) {
      const partners = migratedContent.partners;
      const defaultPartners = defaultContent.partners;
      
      // Check if migration is needed (missing new fields or content differs)
      if (!partners.subtitle || 
          !partners.feature3Title || 
          !partners.feature3Description ||
          partners.title !== defaultPartners.title ||
          partners.subtitle !== defaultPartners.subtitle ||
          partners.description !== defaultPartners.description ||
          partners.feature1Title !== defaultPartners.feature1Title ||
          partners.feature1Description !== defaultPartners.feature1Description ||
          partners.feature2Title !== defaultPartners.feature2Title ||
          partners.feature2Description !== defaultPartners.feature2Description ||
          partners.feature3Title !== defaultPartners.feature3Title ||
          partners.feature3Description !== defaultPartners.feature3Description) {
        migratedContent.partners = {
          ...partners,
          title: defaultPartners.title,
          subtitle: defaultPartners.subtitle,
          description: defaultPartners.description,
          feature1Title: defaultPartners.feature1Title,
          feature1Description: defaultPartners.feature1Description,
          feature2Title: defaultPartners.feature2Title,
          feature2Description: defaultPartners.feature2Description,
          feature3Title: defaultPartners.feature3Title,
          feature3Description: defaultPartners.feature3Description
        };
        needsUpdate = true;
        console.log('Partners content gemigreerd naar nieuwe versie');
      }
    }

    // Auto-save if migration occurred
    if (needsUpdate) {
      // Save migrated content asynchronously (don't await to avoid blocking load)
      this.saveContent(migratedContent, false).catch(err => {
        console.warn('Failed to save migrated content:', err);
      });
    }

    return migratedContent;
  }

  /**
   * Load content from API or localStorage
   * Tries API first, falls back to localStorage, then to default content
   */
  static async loadContent(defaultContent: ContentState): Promise<ContentState> {
    let loadedContent: ContentState | null = null;

    // Try API first if available
    if (isApiAvailable()) {
      try {
        const response = await fetchContent();
        if (response.success && response.data && validateContentStructure(response.data)) {
          console.log('Content geladen van API');
          loadedContent = response.data;
        } else {
          console.log('Geen content op API, gebruik localStorage:', response.error);
        }
      } catch (error) {
        console.error('Error loading content from API:', error);
      }
    }

    // Fallback to localStorage if API didn't provide content
    if (!loadedContent) {
      const savedContent = localStorage.getItem(this.STORAGE_KEY);
      if (savedContent) {
        try {
          const parsed = await this.parseStoredContent(savedContent);
          if (parsed && validateContentStructure(parsed)) {
            console.log('Content geladen van localStorage');
            loadedContent = parsed;
          }
        } catch (error) {
          console.warn('Failed to load localStorage content:', error);
        }
      }
    }

    // Use default content if nothing else worked
    if (!loadedContent) {
      console.log('Gebruik standaard content');
      return defaultContent;
    }

    // Migrate loaded content to latest version
    return this.migrateContent(loadedContent, defaultContent);
  }

  /**
   * Parse stored content (handles both JSON and encrypted)
   */
  private static async parseStoredContent(content: string): Promise<ContentState | null> {
    // Try to parse as JSON first (backward compatibility)
    try {
      const parsed = JSON.parse(content);
      // Check if it's valid content structure (quick check)
      if (parsed && typeof parsed === 'object' && parsed.hero) {
        return parsed;
      }
    } catch (parseError) {
      // Not valid JSON, might be encrypted
    }

    // Might be encrypted, try to decrypt
    // Only try if it looks like base64 encoded data
    if (content.length > 100 && /^[A-Za-z0-9+/=]+$/.test(content)) {
      try {
        const decrypted = await LocalStorageEncryption.decrypt(content);
        const parsed = JSON.parse(decrypted);
        if (parsed && typeof parsed === 'object' && parsed.hero) {
          return parsed;
        }
        } catch (decryptError) {
          // Decryption failed - this could mean:
          // 1. Data is not encrypted (old format)
          // 2. Encryption key changed (new session)
          // 3. Data is corrupted
          const errorMsg = decryptError instanceof Error ? decryptError.message : String(decryptError);
          
          // Only log warning, don't throw - gracefully fall back to default content
          console.warn('Failed to decrypt localStorage content. This is normal if encryption key changed or data is old format. Error:', errorMsg);
          
          // Try to clear corrupted encrypted data to prevent future errors
          try {
            localStorage.removeItem(this.STORAGE_KEY);
            console.log('Cleared potentially corrupted localStorage content. Will use default content.');
          } catch (clearError) {
            // Ignore clear errors - not critical
            console.warn('Failed to clear localStorage (non-critical):', clearError);
          }
          
          // Return null to use default content - don't throw error
          return null;
        }
    }
    
    // If we get here, content is neither valid JSON nor encrypted
    // Clear it to prevent future errors
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Cleared invalid localStorage content');
    } catch (clearError) {
      // Ignore clear errors
    }
    
    return null;
  }

  /**
   * Save content to API and/or localStorage
   * Returns result indicating where content was saved
   */
  static async saveContent(
    content: ContentState,
    showError: boolean = false
  ): Promise<PersistenceResult> {
    let savedToApi = false;
    let savedToLocalStorage = false;
    let error: string | undefined;

    // Try API first if available
    if (isApiAvailable()) {
      try {
        const response = await saveContent(content);
        if (response.success) {
          savedToApi = true;
        } else {
          error = response.error;
          if (showError) {
            console.warn('API save failed, falling back to localStorage:', response.error);
          }
        }
      } catch (err: any) {
        error = err.message;
        if (showError) {
          console.error('Error saving to API:', err);
        }
      }
    }

    // Always save to localStorage as backup (and primary if API not available)
    try {
      const contentString = JSON.stringify(content);
      try {
        const encrypted = await LocalStorageEncryption.encrypt(contentString);
        localStorage.setItem(this.STORAGE_KEY, encrypted);
        savedToLocalStorage = true;
      } catch (encryptError) {
        // If encryption fails, log warning but still save unencrypted as fallback
        // This is a compromise - better than losing data, but not ideal
        console.warn('Encryption failed, saving unencrypted (not recommended):', encryptError);
        localStorage.setItem(this.STORAGE_KEY, contentString);
        savedToLocalStorage = true;
      }
    } catch (err: any) {
      const storageError = err?.name === 'QuotaExceededError' || err?.code === 22
        ? 'Opslagruimte vol. Uw wijzigingen kunnen niet worden opgeslagen.'
        : 'Fout bij opslaan van wijzigingen.';
      error = error || storageError;
      console.error('Error saving to localStorage:', err);
    }

    return { savedToApi, savedToLocalStorage, error };
  }
}
