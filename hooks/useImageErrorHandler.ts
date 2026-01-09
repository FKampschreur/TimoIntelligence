/**
 * Custom hook for handling image load errors
 * Replaces duplicated image error handler code
 */

import { useCallback } from 'react';

export interface UseImageErrorHandlerReturn {
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>, imageUrl: string, context?: string) => void;
  handleImageLoad: (imageUrl: string, context?: string) => void;
}

export const useImageErrorHandler = (): UseImageErrorHandlerReturn => {
  const handleImageError = useCallback((
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    imageUrl: string,
    context?: string
  ) => {
    const contextInfo = context ? ` in ${context}` : '';
    console.error(`Failed to load image${contextInfo}: ${imageUrl?.substring?.(0, 100) || 'unknown URL'}`);
    (e.target as HTMLImageElement).style.display = 'none';
  }, []);

  const handleImageLoad = useCallback((imageUrl: string, context?: string) => {
    // Optional: log successful loads in development
    if (import.meta.env.DEV) {
      const contextInfo = context ? ` in ${context}` : '';
      console.debug(`Image loaded successfully${contextInfo}: ${imageUrl?.substring?.(0, 50) || 'unknown'}`);
    }
  }, []);

  return {
    handleImageError,
    handleImageLoad,
  };
};
