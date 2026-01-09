/**
 * Reusable Textarea Group Component
 * Extracted from AdminPanel for reusability
 */

import React from 'react';
import { INPUT_LIMITS } from '../../../utils/constants';

export interface TextAreaGroupProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  maxLength?: number;
}

export const TextAreaGroup: React.FC<TextAreaGroupProps> = ({ 
  label, 
  value, 
  onChange, 
  rows = 3, 
  maxLength = INPUT_LIMITS.SOLUTION.DETAIL_TEXT 
}) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
    <textarea 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      maxLength={maxLength}
      className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-timo-accent focus:outline-none transition-colors resize-y"
    />
  </div>
);
