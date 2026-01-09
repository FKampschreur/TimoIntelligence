/**
 * Image Input Component with URL and File Upload support
 * Extracted from AdminPanel for reusability
 */

import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';
import { FILE_CONSTANTS } from '../../../utils/constants';
import { useImageErrorHandler } from '../../../hooks/useImageErrorHandler';
import { isApiAvailable } from '../../../utils/apiConfig';

export interface ImageInputGroupProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export const ImageInputGroup: React.FC<ImageInputGroupProps> = ({ label, value, onChange }) => {
  const [inputMode, setInputMode] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDataUrl = value && typeof value === 'string' && value.startsWith('data:image');
  const { handleImageError, handleImageLoad } = useImageErrorHandler();

  // Determine initial mode based on current value
  React.useEffect(() => {
    if (isDataUrl) {
      setInputMode('upload');
    } else if (!isApiAvailable()) {
      // Force URL mode when no API is available
      setInputMode('url');
    }
  }, [isDataUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Alleen afbeeldingsbestanden zijn toegestaan.');
        return;
      }

      // Validate file size
      if (file.size > FILE_CONSTANTS.MAX_FILE_SIZE_BYTES) {
        alert(`Bestand is te groot. Maximum grootte is ${FILE_CONSTANTS.MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`);
        return;
      }

      // Waarschuwing: base64 afbeeldingen worden lokaal opgeslagen
      // Check if API is available
      if (!isApiAvailable()) {
        alert(
          '⚠️ Upload is niet beschikbaar zonder backend API.\n\n' +
          'Gebruik een externe image hosting service (zoals Imgur, Cloudinary, of je eigen server) en voer de URL in.'
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setInputMode('url');
        return;
      }

      // With API available, we could upload to server
      // For now, show warning that base64 will be stored
      const confirmUpload = window.confirm(
        '⚠️ WAARSCHUWING: Geüploade afbeeldingen worden momenteel als base64 opgeslagen.\n\n' +
        'Voor productie wordt aangeraden om afbeeldingen te hosten op een externe server en de URL te gebruiken.\n\n' +
        'Wil je doorgaan met het uploaden?'
      );

      if (!confirmUpload) {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (!result || typeof result !== 'string') {
          console.error('FileReader: Invalid result type', typeof result);
          alert('Fout bij het lezen van het bestand: ongeldig resultaat.');
          return;
        }
        const dataUrl = result;
        onChange(dataUrl);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        alert('Fout bij het lezen van het bestand. Probeer een ander bestand.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveUpload = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setInputMode('url')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${
            inputMode === 'url' 
              ? 'bg-timo-accent text-black' 
              : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
          }`}
        >
          <LinkIcon className="w-3 h-3" />
          URL
        </button>
        {!isApiAvailable() && (
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            disabled
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors bg-black/50 text-gray-500 border border-white/10 cursor-not-allowed opacity-50"
            title="Upload alleen beschikbaar met backend API"
          >
            <Upload className="w-3 h-3" />
            Upload (niet beschikbaar)
          </button>
        )}
        {isApiAvailable() && (
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${
              inputMode === 'upload' 
                ? 'bg-timo-accent text-black' 
                : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <Upload className="w-3 h-3" />
            Upload
          </button>
        )}
      </div>

      {/* URL Input */}
      {inputMode === 'url' && (
        <div className="space-y-2">
          <input 
            type="text" 
            value={isDataUrl ? '' : value} 
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://voorbeeld.com/afbeelding.jpg"
            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-timo-accent focus:outline-none transition-colors"
          />
          {isDataUrl && (
            <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
              <p className="text-xs text-yellow-400">
                ⚠️ Er is momenteel een lokaal opgeslagen afbeelding. Schakel naar "Upload" om deze te zien of te verwijderen.
              </p>
            </div>
          )}
        </div>
      )}

      {/* File Upload */}
      {inputMode === 'upload' && !isApiAvailable() && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-xs text-red-400">
            ❌ Upload is niet beschikbaar zonder backend API. Configureer een backend API of gebruik een externe image hosting service en voer de URL in.
          </p>
        </div>
      )}
      {inputMode === 'upload' && isApiAvailable() && (
        <div className="space-y-2">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-2">
            <p className="text-xs text-blue-400">
              ℹ️ Geüploade afbeeldingen worden naar de server geüpload via de backend API.
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`image-upload-${label}`}
          />
          <label
            htmlFor={`image-upload-${label}`}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-timo-accent/50 transition-colors bg-black/30"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-400">
              <span className="text-timo-accent">Klik om te uploaden</span> of sleep bestand hier
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF tot {FILE_CONSTANTS.MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB</p>
          </label>
          {isDataUrl && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Geüploade afbeelding (lokaal opgeslagen):</span>
                <button
                  type="button"
                  onClick={handleRemoveUpload}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-2 rounded overflow-hidden h-20 w-full bg-black border border-white/10">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-full object-cover opacity-50"
            onError={(e) => handleImageError(e, value, 'Admin preview')}
            onLoad={() => handleImageLoad(value, 'Admin preview')}
          />
        </div>
      )}
    </div>
  );
};
