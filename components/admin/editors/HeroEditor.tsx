/**
 * Hero Content Editor Component
 * Extracted from AdminPanel for better organization
 */

import React from 'react';
import { ContentState } from '../../../context/ContentContext';
import { InputGroup } from '../inputs/InputGroup';
import { TextAreaGroup } from '../inputs/TextAreaGroup';

interface HeroEditorProps {
  hero: ContentState['hero'];
  updateHero: (key: keyof ContentState['hero'], value: string) => void;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ hero, updateHero }) => (
  <div className="space-y-4">
    <InputGroup label="Tagline (Boven titel)" value={hero.tag} onChange={(v) => updateHero('tag', v)} />
    <InputGroup label="Titel Regel 1" value={hero.titleLine1} onChange={(v) => updateHero('titleLine1', v)} />
    <InputGroup label="Titel Regel 2 (Highlight)" value={hero.titleLine2} onChange={(v) => updateHero('titleLine2', v)} />
    <TextAreaGroup label="Beschrijving" value={hero.description} onChange={(v) => updateHero('description', v)} />
    <div className="grid grid-cols-2 gap-4">
      <InputGroup label="Knop 1 Tekst" value={hero.buttonPrimary} onChange={(v) => updateHero('buttonPrimary', v)} />
      <InputGroup label="Knop 2 Tekst" value={hero.buttonSecondary} onChange={(v) => updateHero('buttonSecondary', v)} />
    </div>
  </div>
);
