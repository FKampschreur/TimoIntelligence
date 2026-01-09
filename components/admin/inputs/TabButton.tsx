/**
 * Reusable Tab Button Component
 * Replaces duplicated tab button code in AdminPanel.tsx
 */

import React from 'react';

export interface TabButtonProps {
  id: string;
  label: string;
  activeTab: string;
  onClick: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ id, label, activeTab, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 px-3 py-3 text-xs font-medium transition-colors relative ${
      activeTab === id ? 'text-timo-accent' : 'text-gray-400 hover:text-white'
    }`}
  >
    {label}
    {activeTab === id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-timo-accent"></div>}
  </button>
);
