/**
 * Reusable Input Group Component
 * Extracted from AdminPanel for reusability
 */

import React from 'react';
import { INPUT_LIMITS } from '../../../utils/constants';

export interface InputGroupProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, maxLength = INPUT_LIMITS.SOLUTION.TITLE }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-timo-accent focus:outline-none transition-colors"
    />
  </div>
);
