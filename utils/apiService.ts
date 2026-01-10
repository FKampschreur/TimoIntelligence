/**
 * API Service voor content management
 * Handelt alle communicatie met de backend API af
 */

import { ContentState } from '../context/ContentContext';
import { API_CONFIG } from './apiConfig';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SaveStatus {
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
}

/**
 * Haal content op van de API
 */
export const fetchContent = async (): Promise<ApiResponse<ContentState>> => {
  let timeoutId: NodeJS.Timeout | null = null;
  let controller: AbortController | null = null;
  
  try {
    controller = new AbortController();
    timeoutId = setTimeout(() => {
      controller?.abort();
    }, API_CONFIG.TIMEOUT);

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTENT}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    // Clear timeout immediately when request completes
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (!response.ok) {
      if (response.status === 404) {
        // Content bestaat nog niet op de server - dit is OK
        return { success: false, error: 'Content niet gevonden op server' };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    // Ensure timeout is cleared even on error
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    if (error.name === 'AbortError') {
      return { success: false, error: 'Request timeout - server reageert niet' };
    }
    console.error('Error fetching content:', error);
    return { 
      success: false, 
      error: error.message || 'Fout bij ophalen van content van server' 
    };
  }
};

/**
 * Sla content op naar de API met retry logica
 */
export const saveContent = async (
  content: ContentState,
  retryCount = 0
): Promise<ApiResponse<void>> => {
  let timeoutId: NodeJS.Timeout | null = null;
  let controller: AbortController | null = null;
  
  try {
    controller = new AbortController();
    timeoutId = setTimeout(() => {
      controller?.abort();
    }, API_CONFIG.TIMEOUT);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTENT}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(content),
      signal: controller.signal,
    });

    // Clear timeout immediately when request completes
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (!response.ok) {

      // Retry bij server errors
      if (response.status >= 500 && retryCount < API_CONFIG.MAX_RETRIES) {
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.RETRY_DELAY * (retryCount + 1))
        );
        return saveContent(content, retryCount + 1);
      }

      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return { success: true };
  } catch (error: any) {
    // Ensure timeout is cleared even on error
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    if (error.name === 'AbortError') {
      // Retry bij timeout
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.RETRY_DELAY * (retryCount + 1))
        );
        return saveContent(content, retryCount + 1);
      }
      return { success: false, error: 'Timeout - server reageert niet' };
    }

    console.error('Error saving content:', error);
    
    // Retry bij network errors
    if (retryCount < API_CONFIG.MAX_RETRIES && !error.message.includes('401') && !error.message.includes('403')) {
      await new Promise(resolve => 
        setTimeout(resolve, API_CONFIG.RETRY_DELAY * (retryCount + 1))
      );
      return saveContent(content, retryCount + 1);
    }

    return { 
      success: false, 
      error: error.message || 'Fout bij opslaan naar server' 
    };
  }
};

/**
 * Verstuur contactformulier naar API
 */
export const sendContactForm = async (
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
  }
): Promise<ApiResponse<void>> => {
  let timeoutId: NodeJS.Timeout | null = null;
  let controller: AbortController | null = null;
  
  try {
    controller = new AbortController();
    timeoutId = setTimeout(() => {
      controller?.abort();
    }, API_CONFIG.TIMEOUT);

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      signal: controller.signal,
    });

    // Clear timeout immediately when request completes
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return { success: true };
  } catch (error: any) {
    // Ensure timeout is cleared even on error
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    if (error.name === 'AbortError') {
      return { success: false, error: 'Request timeout - server reageert niet' };
    }
    console.error('Error sending contact form:', error);
    return { 
      success: false, 
      error: error.message || 'Fout bij verzenden van contactformulier' 
    };
  }
};

/**
 * Check of de API bereikbaar is
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
};
