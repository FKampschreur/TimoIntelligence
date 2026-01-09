/**
 * Partners Content Editor Component
 * Extracted from AdminPanel for better organization
 */

import React from 'react';
import { ContentState } from '../../../context/ContentContext';
import { InputGroup } from '../inputs/InputGroup';
import { TextAreaGroup } from '../inputs/TextAreaGroup';
import { INPUT_LIMITS } from '../../../utils/constants';

interface PartnersEditorProps {
  partners: ContentState['partners'];
  updatePartners: (key: keyof ContentState['partners'], value: string) => void;
}

export const PartnersEditor: React.FC<PartnersEditorProps> = ({ partners, updatePartners }) => (
  <div className="space-y-4">
    <InputGroup 
      label="Titel" 
      value={partners.title}
      maxLength={INPUT_LIMITS.PARTNERS.DEFAULT}
      onChange={(v) => updatePartners('title', v)} 
    />
    <TextAreaGroup 
      label="Beschrijving" 
      value={partners.description}
      maxLength={INPUT_LIMITS.PARTNERS.DESCRIPTION}
      onChange={(v) => updatePartners('description', v)} 
      rows={3} 
    />
    
    <div className="pt-4 border-t border-white/5">
      <p className="text-xs font-bold text-timo-accent mb-3 uppercase tracking-wider">Features</p>
      <InputGroup 
        label="Feature 1 Titel" 
        value={partners.feature1Title}
        maxLength={INPUT_LIMITS.PARTNERS.DEFAULT}
        onChange={(v) => updatePartners('feature1Title', v)} 
      />
      <InputGroup 
        label="Feature 1 Beschrijving" 
        value={partners.feature1Description}
        maxLength={INPUT_LIMITS.PARTNERS.DEFAULT}
        onChange={(v) => updatePartners('feature1Description', v)} 
      />
      <InputGroup 
        label="Feature 2 Titel" 
        value={partners.feature2Title}
        maxLength={INPUT_LIMITS.PARTNERS.DEFAULT}
        onChange={(v) => updatePartners('feature2Title', v)} 
      />
      <InputGroup 
        label="Feature 2 Beschrijving" 
        value={partners.feature2Description}
        maxLength={INPUT_LIMITS.PARTNERS.DEFAULT}
        onChange={(v) => updatePartners('feature2Description', v)} 
      />
    </div>
  </div>
);
