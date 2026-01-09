import React from 'react';
import { History, ShieldCheck, Rocket } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="py-24 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-timo-accent text-xs font-bold uppercase tracking-wider mb-6">
              Onze Kracht
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Geen standaard softwarebedrijf.<br/>
              <span className="text-gray-500">Wij zijn ondernemers.</span>
            </h2>
            <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
              <p>
                Timo Intelligence is niet ontstaan in een steriele code-fabriek, maar op de werkvloer van <span className="text-white font-medium">Holland Food Service</span> en <span className="text-white font-medium">Timo Vastgoed</span>.
              </p>
              <p>
                Omdat het bestaande aanbod in de markt niet voldeed aan onze eisen voor efficiëntie en datakwaliteit, besloten we onze eigen oplossingen te bouwen. Wat begon als interne optimalisatie, groeide uit tot een krachtige suite die nu beschikbaar is voor de markt.
              </p>
              <p>
                Wij verkopen geen dromen of roadmaps met features die "volgend jaar" komen. Wij verkopen software die zich al bewezen heeft in een operatie die 24/7 doorgaat.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                    <History className="w-10 h-10 text-timo-accent shrink-0" />
                    <div>
                        <h4 className="text-white font-bold">Erfgoed sinds 1892</h4>
                        <p className="text-sm text-gray-500 mt-1">Gesteund door meer dan een eeuw aan ondernemerschap.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Rocket className="w-10 h-10 text-timo-accent shrink-0" />
                    <div>
                        <h4 className="text-white font-bold">Practical Tech</h4>
                        <p className="text-sm text-gray-500 mt-1">Direct toepasbare technologie, geen theoretische modellen.</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-timo-accent to-blue-600 rounded-2xl opacity-20 blur-lg"></div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
               {/* Using a placeholder for the team/warehouse shot. */}
              <img 
                src="https://i.imgur.com/Z0olMf2.jpg" 
                alt="Management en Development Team" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <p className="text-white font-medium">Het Timo Intelligence Team</p>
                  <p className="text-xs text-gray-400">Verbindt IT met Operatie</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;