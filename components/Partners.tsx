import React from 'react';
import { Handshake, Award, Shield } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Partners: React.FC = () => {
  const { content } = useContent();
  const { partners } = content;

  return (
    <div className="py-24 bg-timo-dark relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-timo-card border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-12">
            
            <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-6">{partners.title}</h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    {partners.description}
                </p>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-4 bg-black/40 rounded-lg border border-white/5">
                        <Award className="text-timo-accent w-6 h-6" />
                        <div>
                            <h4 className="text-white font-bold text-sm">{partners.feature1Title}</h4>
                            <p className="text-gray-500 text-xs">{partners.feature1Description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-black/40 rounded-lg border border-white/5">
                        <Shield className="text-timo-accent w-6 h-6" />
                        <div>
                            <h4 className="text-white font-bold text-sm">{partners.feature2Title}</h4>
                            <p className="text-gray-500 text-xs">{partners.feature2Description}</p>
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