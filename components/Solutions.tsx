import React, { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent, SolutionData } from '../context/ContentContext';
import { getIconComponent } from '../utils/iconMapper.tsx';
import { useImageErrorHandler } from '../hooks/useImageErrorHandler';

const Solutions: React.FC = () => {
  const [selectedSolution, setSelectedSolution] = useState<SolutionData | null>(null);
  const { content } = useContent();
  const { handleImageError, handleImageLoad } = useImageErrorHandler();

  return (
    <div className="py-24 bg-timo-dark border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Onze Oplossingen</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tools ontwikkeld voor eigen gebruik, geperfectioneerd voor de markt.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {content.solutions.map((item, index) => {
            const isLastItem = index === content.solutions.length - 1;
            const isOddCount = content.solutions.length % 2 !== 0;
            const shouldCenter = isLastItem && isOddCount;
            
            return (
            <div 
              key={item.id} 
              className={`group relative overflow-hidden rounded-2xl bg-timo-card border border-white/5 hover:border-white/20 transition-all duration-300 ${shouldCenter ? 'lg:col-span-2' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
              
              {/* Image Background */}
              <div className="absolute inset-0 z-0">
                  <img 
                    src={item.image || 'https://via.placeholder.com/600x400'} 
                    alt={item.title || 'Solution'} 
                    className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                    onError={(e) => {
                      try {
                        handleImageError(e, item.image, `Solutions grid for "${item.title}"`);
                      } catch (error) {
                        console.error('Error in image error handler:', error);
                        // Fallback: set placeholder image
                        const target = e.target as HTMLImageElement;
                        if (target) {
                          target.src = 'https://via.placeholder.com/600x400';
                        }
                      }
                    }}
                    onLoad={() => {
                      try {
                        handleImageLoad(item.image, 'Solutions grid');
                      } catch (error) {
                        console.error('Error in image load handler:', error);
                      }
                    }}
                  />
              </div>

              <div className="relative z-20 p-8 h-full flex flex-col justify-end min-h-[300px]">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-timo-accent/20 text-timo-accent backdrop-blur-md">
                    {getIconComponent(item.iconName, 'w-6 h-6')}
                </div>
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <p className="text-timo-accent font-medium text-sm mb-1">{item.subtitle}</p>
                        <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-gray-300 max-w-xl text-sm md:text-base leading-relaxed">
                        {item.description}
                        </p>
                    </div>
                    <div className="hidden sm:block ml-4 shrink-0">
                        <button 
                            onClick={() => setSelectedSolution(item)}
                            className="p-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all cursor-pointer z-30 relative"
                        >
                            <ArrowUpRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedSolution && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                onClick={() => setSelectedSolution(null)}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-timo-card border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                >
                    <div className="md:w-2/5 h-64 md:h-auto relative shrink-0">
                         <img 
                           src={selectedSolution.image} 
                           alt={selectedSolution.title} 
                           className="w-full h-full object-cover grayscale"
                           onError={(e) => handleImageError(e, selectedSolution.image, `Solutions modal for "${selectedSolution.title}"`)}
                         />
                         <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent"></div>
                         <div className="absolute top-4 left-4 p-2 bg-timo-accent rounded-lg text-black shadow-lg">
                            {getIconComponent(selectedSolution.iconName, undefined, 24)}
                         </div>
                    </div>
                    <div className="p-8 md:w-3/5 overflow-y-auto flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="text-timo-accent text-xs font-bold tracking-wider uppercase mb-1 block">{selectedSolution.subtitle}</span>
                                <h3 className="text-3xl font-bold text-white leading-tight">{selectedSolution.title}</h3>
                            </div>
                            <button onClick={() => setSelectedSolution(null)} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="prose prose-invert prose-sm text-gray-300">
                            {selectedSolution.detailTitle && (
                                <h4 className="text-lg font-semibold text-white mb-3">{selectedSolution.detailTitle}</h4>
                            )}
                            <p className="leading-relaxed whitespace-pre-line">
                                {selectedSolution.detailText || selectedSolution.description || 'Geen beschrijving beschikbaar.'}
                            </p>
                        </div>

                         <div className="mt-8 pt-6 border-t border-white/10 flex justify-end mt-auto">
                             <a href="#contact" onClick={() => setSelectedSolution(null)} className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded bg-timo-accent text-black hover:bg-cyan-600 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                 Meer informatie aanvragen
                             </a>
                         </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Solutions;