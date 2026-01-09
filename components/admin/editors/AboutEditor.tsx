/**
 * About Content Editor Component
 * Extracted from AdminPanel for better organization
 */

import React from 'react';
import { ContentState } from '../../../context/ContentContext';
import { InputGroup } from '../inputs/InputGroup';
import { TextAreaGroup } from '../inputs/TextAreaGroup';
import { ImageInputGroup } from '../inputs/ImageInputGroup';
import { INPUT_LIMITS } from '../../../utils/constants';

interface AboutEditorProps {
  about: ContentState['about'];
  updateAbout: (key: keyof ContentState['about'], value: string) => void;
}

export const AboutEditor: React.FC<AboutEditorProps> = ({ about, updateAbout }) => (
  <div className="space-y-4">
    <InputGroup 
      label="Tag (Badge)" 
      value={about.tag}
      maxLength={INPUT_LIMITS.ABOUT.DEFAULT}
      onChange={(v) => updateAbout('tag', v)} 
    />
    <InputGroup 
      label="Titel Regel 1" 
      value={about.titleLine1}
      maxLength={INPUT_LIMITS.ABOUT.DEFAULT}
      onChange={(v) => updateAbout('titleLine1', v)} 
    />
    <InputGroup 
      label="Titel Regel 2 (Grijs)" 
      value={about.titleLine2}
      maxLength={INPUT_LIMITS.ABOUT.DEFAULT}
      onChange={(v) => updateAbout('titleLine2', v)} 
    />
    
    <div className="pt-4 border-t border-white/5">
      <p className="text-xs font-bold text-timo-accent mb-3 uppercase tracking-wider">Paragrafen</p>
      <TextAreaGroup 
        label="Paragraaf 1" 
        value={about.paragraph1}
        maxLength={INPUT_LIMITS.ABOUT.PARAGRAPH}
        onChange={(v) => updateAbout('paragraph1', v)} 
        rows={3} 
      />
      <TextAreaGroup 
        label="Paragraaf 2" 
        value={about.paragraph2}
        maxLength={INPUT_LIMITS.ABOUT.PARAGRAPH}
        onChange={(v) => updateAbout('paragraph2', v)} 
        rows={3} 
      />
      <TextAreaGroup 
        label="Paragraaf 3" 
        value={about.paragraph3}
        maxLength={INPUT_LIMITS.ABOUT.PARAGRAPH}
        onChange={(v) => updateAbout('paragraph3', v)} 
        rows={3} 
      />
    </div>

    <div className="pt-4 border-t border-white/5">
      <p className="text-xs font-bold text-timo-accent mb-3 uppercase tracking-wider">Features</p>
      <InputGroup 
        label="Feature 1 Titel" 
        value={about.feature1Title}
        maxLength={INPUT_LIMITS.ABOUT.DEFAULT}
        onChange={(v) => updateAbout('feature1Title', v)} 
      />
      <InputGroup 
        label="Feature 1 Beschrijving" 
        value={about.feature1Description}
        maxLength={INPUT_LIMITS.ABOUT.DEFAULT}
        onChange={(v) => updateAbout('feature1Description', v)} 
      />
      <InputGroup 
        label="Feature 2 Titel" 
        value={about.feature2Title}
        maxLength={INPUT_LIMITS.ABOUT.DEFAULT}
        onChange={(v) => updateAbout('feature2Title', v)} 
      />
      <InputGroup 
        label="Feature 2 Beschrijving" 
        value={about.feature2Description}
        maxLength={INPUT_LIMITS.ABOUT.DEFAULT}
        onChange={(v) => updateAbout('feature2Description', v)} 
      />
    </div>

    <div className="pt-4 border-t border-white/5">
      <p className="text-xs font-bold text-timo-accent mb-3 uppercase tracking-wider">Afbeelding</p>
      <ImageInputGroup 
        label="Team Afbeelding" 
        value={about.imageUrl} 
        onChange={(v) => updateAbout('imageUrl', v)} 
      />
      <InputGroup 
        label="Afbeelding Caption" 
        value={about.imageCaption}
        maxLength={INPUT_LIMITS.ABOUT.DEFAULT}
        onChange={(v) => updateAbout('imageCaption', v)} 
      />
      <InputGroup 
        label="Afbeelding Subcaption" 
        value={about.imageSubcaption}
        maxLength={INPUT_LIMITS.ABOUT.DEFAULT}
        onChange={(v) => updateAbout('imageSubcaption', v)} 
      />
    </div>
  </div>
);
