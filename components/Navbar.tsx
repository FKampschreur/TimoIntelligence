import React, { useState, useEffect } from 'react';
import { Menu, X, Box } from 'lucide-react';
import { agentLog } from '../utils/agentLogging';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // #region agent log
    agentLog('Navbar.tsx:8', 'Scroll listener setup');
    // #endregion
    const handleScroll = () => {
      // #region agent log
      agentLog('Navbar.tsx:11', 'Scroll event fired', { scrollY: window.scrollY, scrolled: window.scrollY > 50 });
      // #endregion
      setScrolled(window.scrollY > 50);
    };
    
    // Check if window is available (SSR safety)
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        // #region agent log
        agentLog('Navbar.tsx:17', 'Scroll listener cleanup');
        // #endregion
        try {
          window.removeEventListener('scroll', handleScroll);
        } catch (error) {
          // Ignore cleanup errors if component already unmounted
          console.warn('Error removing scroll listener:', error);
        }
      };
    }
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Filosofie', href: '#philosophy' },
    { name: 'Oplossingen', href: '#oplossingen' },
    { name: 'Over Ons', href: '#over-ons' },
    { name: 'Partners', href: '#partners' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-timo-dark/90 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => {
            // #region agent log
            agentLog('Navbar.tsx:33', 'Logo clicked');
            // #endregion
            const target = document.querySelector('#home');
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}>
            <div className="w-10 h-10 bg-white text-black flex items-center justify-center rounded shadow-[0_0_15px_rgba(6,182,212,0.5)]">
               <Box className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight leading-none text-white">TIMO</span>
                <span className="text-[10px] tracking-[0.2em] text-timo-accent font-medium uppercase">Intelligence</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    // #region agent log
                    agentLog('Navbar.tsx:48', 'Nav link clicked', { href: link.href, hash: window.location.hash });
                    // #endregion
                    e.preventDefault();
                    const target = document.querySelector(link.href);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="hover:text-timo-accent text-gray-300 transition-colors duration-200 text-sm font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-timo-card border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  // #region agent log
                    agentLog('Navbar.tsx:76', 'Mobile nav link clicked', { href: link.href });
                  // #endregion
                  e.preventDefault();
                  setIsOpen(false);
                  const target = document.querySelector(link.href);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;