import React, { useState, useEffect } from 'react';
import { Menu, X, Box } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Navbar.tsx:8',message:'Scroll listener setup',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const handleScroll = () => {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Navbar.tsx:11',message:'Scroll event fired',data:{scrollY:window.scrollY,scrolled:window.scrollY>50},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      setScrolled(window.scrollY > 50);
    };
    
    // Check if window is available (SSR safety)
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Navbar.tsx:17',message:'Scroll listener cleanup',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
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
            fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Navbar.tsx:33',message:'Logo clicked',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
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
                    fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Navbar.tsx:48',message:'Nav link clicked',data:{href:link.href,hash:window.location.hash},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
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
                  fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Navbar.tsx:76',message:'Mobile nav link clicked',data:{href:link.href},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
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