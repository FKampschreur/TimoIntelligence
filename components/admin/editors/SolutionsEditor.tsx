/**
 * Solutions Content Editor Component
 * Extracted from AdminPanel for better organization
 * This is the most complex editor with add/remove/expand functionality
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { SolutionData, ContentState } from '../../../context/ContentContext';
import { InputGroup } from '../inputs/InputGroup';
import { TextAreaGroup } from '../inputs/TextAreaGroup';
import { ImageInputGroup } from '../inputs/ImageInputGroup';
import { getAllIconOptions } from '../../../utils/iconMapper.tsx';
import { INPUT_LIMITS } from '../../../utils/constants';

interface SolutionsEditorProps {
  solutions: SolutionData[];
  updateSolution: (index: number, field: keyof SolutionData, value: string | SolutionData['iconName']) => void;
  addSolution: (onAdded?: (newIndex: number) => void) => void;
  removeSolution: (index: number) => void;
  selectIconFromText: (title: string, description: string) => SolutionData['iconName'];
}

export const SolutionsEditor: React.FC<SolutionsEditorProps> = ({
  solutions,
  updateSolution,
  addSolution,
  removeSolution,
  selectIconFromText,
}) => {
  const [expandedSolution, setExpandedSolution] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <button
        onClick={() => {
          // Use callback to get the new index after solution is added
          addSolution((newIndex) => {
            setExpandedSolution(newIndex);
          });
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-timo-accent/20 hover:bg-timo-accent/30 border border-timo-accent/50 rounded-lg text-timo-accent font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        Nieuwe Oplossing Toevoegen
      </button>
      
      {solutions.map((solution, index) => (
        <div key={solution.id} className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setExpandedSolution(expandedSolution === index ? null : index)}
              className="flex-1 flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <span className="font-medium text-white">{solution.title}</span>
              {expandedSolution === index ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </button>
            {solutions.length > 1 && (
              <button
                onClick={() => {
                  // Update expandedSolution state before removing to avoid race condition
                  const currentExpanded = expandedSolution;
                  removeSolution(index);
                  
                  // Update expanded state after removal
                  if (currentExpanded === index) {
                    setExpandedSolution(null);
                  } else if (currentExpanded !== null && currentExpanded > index) {
                    setExpandedSolution(currentExpanded - 1);
                  }
                }}
                className="p-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                title="Verwijder oplossing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {expandedSolution === index && (
            <div className="p-4 border-t border-white/10 space-y-4 bg-black/20">
              <InputGroup 
                label="Titel" 
                value={solution.title}
                maxLength={INPUT_LIMITS.SOLUTION.TITLE}
                onChange={(v) => {
                  updateSolution(index, 'title', v);
                  // Auto-suggest icon based on new title
                  const suggestedIcon = selectIconFromText(v, solution.description);
                  if (suggestedIcon !== solution.iconName) {
                    updateSolution(index, 'iconName', suggestedIcon);
                  }
                }} 
              />
              <InputGroup 
                label="Subtitel" 
                value={solution.subtitle}
                maxLength={INPUT_LIMITS.SOLUTION.SUBTITLE}
                onChange={(v) => updateSolution(index, 'subtitle', v)} 
              />
              <TextAreaGroup 
                label="Korte Beschrijving" 
                value={solution.description}
                maxLength={INPUT_LIMITS.SOLUTION.DESCRIPTION}
                onChange={(v) => {
                  updateSolution(index, 'description', v);
                  // Auto-suggest icon based on new description
                  const suggestedIcon = selectIconFromText(solution.title, v);
                  if (suggestedIcon !== solution.iconName) {
                    updateSolution(index, 'iconName', suggestedIcon);
                  }
                }} 
              />
              
              <div className="pt-4 border-t border-white/5">
                <p className="text-xs font-bold text-timo-accent mb-3 uppercase tracking-wider">Icon</p>
                <select
                  value={solution.iconName}
                  onChange={(e) => {
                    const newIconName = e.target.value as SolutionData['iconName'];
                    if (newIconName) {
                      updateSolution(index, 'iconName', newIconName);
                    }
                  }}
                  className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-timo-accent focus:outline-none transition-colors"
                >
                  {getAllIconOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.emoji} {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">Tip: Het icoon wordt automatisch aangepast wanneer u de titel of beschrijving wijzigt</p>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <p className="text-xs font-bold text-timo-accent mb-3 uppercase tracking-wider">Detail Pagina</p>
                <InputGroup 
                  label="Detail Titel" 
                  value={solution.detailTitle}
                  maxLength={INPUT_LIMITS.SOLUTION.DETAIL_TITLE}
                  onChange={(v) => updateSolution(index, 'detailTitle', v)} 
                />
                <TextAreaGroup 
                  label="Detail Tekst" 
                  value={solution.detailText}
                  maxLength={INPUT_LIMITS.SOLUTION.DETAIL_TEXT}
                  onChange={(v) => updateSolution(index, 'detailText', v)} 
                  rows={6} 
                />
              </div>

              <ImageInputGroup 
                label="Afbeelding" 
                value={solution.image} 
                onChange={(v) => updateSolution(index, 'image', v)} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
