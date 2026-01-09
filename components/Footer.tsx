import React from 'react';
import { Box } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-2 mb-4">
                <Box className="w-6 h-6 text-timo-accent" />
                <span className="font-bold text-lg text-white">TIMO Intelligence</span>
            </div>
            <p className="text-gray-500 text-sm">
              Practical Tech voor logistiek, vastgoed en procesoptimalisatie. Onderdeel van de Holland Food Service groep.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Oplossingen</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-timo-accent transition-colors">Timo Fleet</a></li>
              <li><a href="#" className="hover:text-timo-accent transition-colors">Timo Tender</a></li>
              <li><a href="#" className="hover:text-timo-accent transition-colors">Timo Insights</a></li>
              <li><a href="#" className="hover:text-timo-accent transition-colors">Timo Vision</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Bedrijf</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#over-ons" className="hover:text-timo-accent transition-colors">Over Ons</a></li>
              <li><a href="#partners" className="hover:text-timo-accent transition-colors">Partners</a></li>
              <li><a href="#contact" className="hover:text-timo-accent transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-timo-accent transition-colors">Privacyverklaring</a></li>
              <li><a href="#" className="hover:text-timo-accent transition-colors">Algemene Voorwaarden</a></li>
              <li><a href="#" className="hover:text-timo-accent transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Timo Intelligence. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-4">
              {/* Social icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;