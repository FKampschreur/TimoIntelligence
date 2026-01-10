import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';

const Hero: React.FC = () => {
  const { content } = useContent();
  const { hero } = content;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Abstract Background Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 lg:right-auto lg:left-20 top-0 lg:top-20 -z-10 m-auto lg:m-0 h-[310px] w-[310px] rounded-full bg-timo-accent opacity-20 blur-[100px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-timo-dark via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center lg:items-start lg:text-left">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-timo-accent text-sm font-semibold mb-6 tracking-wide">
            {hero.tag}
            </span>
        </motion.div>

        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
        >
          {hero.titleLine1}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
            {hero.titleLine2}
          </span>
        </motion.h1>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 max-w-2xl text-xl text-gray-400 font-light leading-relaxed space-y-4"
        >
          {(hero.description || '').split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#oplossingen"
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector('#oplossingen');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="group inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded bg-white text-black hover:bg-gray-200 transition-all duration-200"
          >
            {hero.buttonPrimary}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector('#contact');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="inline-flex items-center justify-center px-8 py-3 border border-white/20 text-base font-medium rounded text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
          >
            {hero.buttonSecondary}
          </a>
        </motion.div>
      </div>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-500"
        >
            <ChevronDown className="w-6 h-6" />
        </motion.div>
    </div>
  );
};

export default Hero;