/**
 * Contact Content Editor Component
 * Extracted from AdminPanel for better organization
 */

import React from 'react';
import { ContentState } from '../../../context/ContentContext';
import { InputGroup } from '../inputs/InputGroup';
import { TextAreaGroup } from '../inputs/TextAreaGroup';
import { INPUT_LIMITS } from '../../../utils/constants';

interface ContactEditorProps {
  contact: ContentState['contact'];
  updateContact: (key: keyof ContentState['contact'], value: string) => void;
}

export const ContactEditor: React.FC<ContactEditorProps> = ({ contact, updateContact }) => (
  <div className="space-y-4">
    <InputGroup 
      label="Titel" 
      value={contact.title}
      maxLength={INPUT_LIMITS.CONTACT.DEFAULT}
      onChange={(v) => updateContact('title', v)} 
    />
    <TextAreaGroup 
      label="Introductietekst" 
      value={contact.introText}
      maxLength={INPUT_LIMITS.CONTACT.INTRO_TEXT}
      onChange={(v) => updateContact('introText', v)} 
      rows={3} 
    />
    
    <div className="pt-4 border-t border-white/5">
      <p className="text-xs font-bold text-timo-accent mb-3 uppercase tracking-wider">Contactgegevens</p>
      <InputGroup 
        label="Straat" 
        value={contact.addressStreet}
        maxLength={INPUT_LIMITS.CONTACT.DEFAULT}
        onChange={(v) => updateContact('addressStreet', v)} 
      />
      <InputGroup 
        label="Postcode & Plaats" 
        value={contact.addressPostalCode}
        maxLength={INPUT_LIMITS.CONTACT.DEFAULT}
        onChange={(v) => updateContact('addressPostalCode', v)} 
      />
      <InputGroup 
        label="Plaats (optioneel)" 
        value={contact.addressCity}
        maxLength={INPUT_LIMITS.CONTACT.DEFAULT}
        onChange={(v) => updateContact('addressCity', v)} 
      />
      <InputGroup 
        label="Adres Notitie" 
        value={contact.addressNote}
        maxLength={INPUT_LIMITS.CONTACT.DEFAULT}
        onChange={(v) => updateContact('addressNote', v)} 
      />
      <InputGroup 
        label="Email" 
        value={contact.email}
        maxLength={INPUT_LIMITS.CONTACT.DEFAULT}
        onChange={(v) => updateContact('email', v)} 
      />
      <InputGroup 
        label="Telefoon" 
        value={contact.phone}
        maxLength={INPUT_LIMITS.CONTACT.DEFAULT}
        onChange={(v) => updateContact('phone', v)} 
      />
    </div>

    <div className="pt-4 border-t border-white/5">
      <p className="text-xs font-bold text-timo-accent mb-3 uppercase tracking-wider">Formulier</p>
      <InputGroup 
        label="Formulier Titel" 
        value={contact.formTitle}
        maxLength={INPUT_LIMITS.CONTACT.DEFAULT}
        onChange={(v) => updateContact('formTitle', v)} 
      />
      <InputGroup 
        label="Knop Tekst" 
        value={contact.buttonText}
        maxLength={INPUT_LIMITS.CONTACT.DEFAULT}
        onChange={(v) => updateContact('buttonText', v)} 
      />
    </div>
  </div>
);
