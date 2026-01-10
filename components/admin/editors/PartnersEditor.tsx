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
    <InputGroup 
      label="Subtitel" 
      value={partners.subtitle}
      maxLength={INPUT_LIMITS.PARTNERS.DEFAULT}
      onChange={(v) => updatePartners('subtitle', v)} 
    />
    <TextAreaGroup 
      label="Beschrijving" 
      value={partners.description}
      maxLength={INPUT_LIMITS.PARTNERS.DESCRIPTION}
      onChange={(v) => updatePartners('description', v)} 
      rows={3} 
    />
    
    <div className="pt-4 border-t border-white/5">
      <p className="text-xs font-bold text-timo-accent mb-3 uppercase tracking-wider">Onze Pijlers</p>
      <InputGroup 
        label="Pijler 1 Titel" 
        value={partners.feature1Title}
        maxLength={INPUT_LIMITS.PARTNERS.DEFAULT}
        onChange={(v) => updatePartners('feature1Title', v)} 
      />
      <TextAreaGroup 
        label="Pijler 1 Beschrijving" 
        value={partners.feature1Description}
        maxLength={INPUT_LIMITS.PARTNERS.DESCRIPTION}
        onChange={(v) => updatePartners('feature1Description', v)} 
        rows={3}
      />
      <InputGroup 
        label="Pijler 2 Titel" 
        value={partners.feature2Title}
        maxLength={INPUT_LIMITS.PARTNERS.DEFAULT}
        onChange={(v) => updatePartners('feature2Title', v)} 
      />
      <TextAreaGroup 
        label="Pijler 2 Beschrijving (gebruik \\n voor nieuwe regels)" 
        value={partners.feature2Description}
        maxLength={INPUT_LIMITS.PARTNERS.DESCRIPTION}
        onChange={(v) => updatePartners('feature2Description', v)} 
        rows={6}
      />
      <InputGroup 
        label="Pijler 3 Titel" 
        value={partners.feature3Title}
        maxLength={INPUT_LIMITS.PARTNERS.DEFAULT}
        onChange={(v) => updatePartners('feature3Title', v)} 
      />
      <TextAreaGroup 
        label="Pijler 3 Beschrijving (gebruik \\n voor nieuwe regels)" 
        value={partners.feature3Description}
        maxLength={INPUT_LIMITS.PARTNERS.DESCRIPTION}
        onChange={(v) => updatePartners('feature3Description', v)} 
        rows={6}
      />
    </div>
  </div>
);
