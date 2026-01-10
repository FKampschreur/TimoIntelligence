import React from 'react';
import { Handshake, Award, Shield, Cloud } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Partners: React.FC = () => {
  const { content } = useContent();
  const { partners } = content;

  // Helper function to render description with line breaks for sub-items
  const renderDescription = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="text-gray-500 text-xs space-y-1">
        {lines.map((line, index) => {
          // Check if line is a sub-item (starts with bold text followed by colon)
          if (line.includes(':') && line.length > 0) {
            const [boldPart, ...restParts] = line.split(':');
            const restText = restParts.join(':').trim();
            return (
              <div key={index} className="mt-2 first:mt-0">
                <span className="font-semibold text-gray-400">{boldPart.trim()}:</span>
                {restText && <span className="ml-1">{restText}</span>}
              </div>
            );
          }
          return <div key={index}>{line || '\u00A0'}</div>;
        })}
      </div>
    );
  };

  return (
    <div className="py-24 bg-timo-dark relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-timo-card border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-12">
            
            <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{partners.title}</h2>
                {partners.subtitle && (
                  <p className="text-timo-accent text-sm mb-6 font-medium">{partners.subtitle}</p>
                )}
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    {partners.description}
                </p>
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4 p-4 bg-black/40 rounded-lg border border-white/5">
                        <Award className="text-timo-accent w-6 h-6 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <h4 className="text-white font-bold text-sm mb-1">{partners.feature1Title}</h4>
                            <p className="text-gray-500 text-xs leading-relaxed">{partners.feature1Description}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-black/40 rounded-lg border border-white/5">
                        <Cloud className="text-timo-accent w-6 h-6 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <h4 className="text-white font-bold text-sm mb-1">{partners.feature2Title}</h4>
                            {renderDescription(partners.feature2Description)}
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-black/40 rounded-lg border border-white/5">
                        <Shield className="text-timo-accent w-6 h-6 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <h4 className="text-white font-bold text-sm mb-1">{partners.feature3Title}</h4>
                            {renderDescription(partners.feature3Description)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full flex justify-center">
                <div className="relative w-full max-w-sm aspect-square bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-white/10">
                    <Handshake className="w-32 h-32 text-gray-700" />
                    <div className="absolute inset-0 border border-timo-accent/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-4 border border-dashed border-gray-600/50 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Partners;