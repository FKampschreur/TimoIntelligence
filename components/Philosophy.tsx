import React from 'react';
import { Cpu, Brain, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Philosophy: React.FC = () => {
  const items = [
    {
      letter: 'T',
      word: 'Technology',
      icon: <Cpu className="w-8 h-8 text-timo-accent" />,
      desc: 'Robuuste, schaalbare architectuur die de ruggengraat vormt van uw operatie.',
    },
    {
      letter: 'I',
      word: 'Intelligence',
      icon: <Brain className="w-8 h-8 text-timo-accent" />,
      desc: 'Slimme algoritmes die leren van data en proactief adviseren in plaats van enkel rapporteren.',
    },
    {
      letter: 'M',
      word: 'Mastering',
      icon: <Target className="w-8 h-8 text-timo-accent" />,
      desc: 'Volledige controle over complexe processen door centralisatie en standaardisatie.',
    },
    {
      letter: 'O',
      word: 'Optimization',
      icon: <TrendingUp className="w-8 h-8 text-timo-accent" />,
      desc: 'Continue verbetering van efficiëntie, kosten en duurzaamheid door real-time inzichten.',
    },
  ];

  return (
    <div className="py-24 bg-timo-dark relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">De TIMO Filosofie</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Onze naam is onze belofte. Elke oplossing die wij bouwen voldoet aan deze vier kernwaarden.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.word}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-xl bg-timo-card border border-white/5 hover:border-timo-accent/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
            >
              <div className="mb-4 p-3 bg-white/5 rounded-lg inline-block group-hover:bg-timo-accent/10 transition-colors">
                {item.icon}
              </div>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold text-white group-hover:text-timo-accent transition-colors mr-2">{item.letter}</span>
                <h3 className="text-xl font-semibold text-gray-200">{item.word.substring(1)}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Philosophy;