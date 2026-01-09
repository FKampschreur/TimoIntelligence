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
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTENT}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    // Haal auth token op uit sessionStorage als beschikbaar
    const authToken = sessionStorage.getItem('admin-auth-token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTENT}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(content),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Als unauthorized, probeer niet opnieuw
      if (response.status === 401 || response.status === 403) {
        return { 
          success: false, 
          error: 'Niet geautoriseerd - log opnieuw in' 
        };
      }

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
