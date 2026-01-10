import React, { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { getIconComponent } from '../utils/iconMapper.tsx';
import { ECOSYSTEM_CONSTANTS } from '../utils/constants';

const Ecosystem: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { content } = useContent();

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => {
      try {
        window.removeEventListener('resize', checkMobile);
      } catch (error) {
        // Ignore cleanup errors if component already unmounted
        console.warn('Error removing resize listener:', error);
      }
    };
  }, []);

  // Dynamically generate nodes from solutions
  // Distribute evenly around the circle (360 degrees / number of solutions)
  const solutions = content.solutions || [];
  const angleStep = solutions.length > 0 ? 360 / solutions.length : 0;
  
  // Adjust container height and radius based on number of solutions
  // More solutions need more space
  const baseHeight = isMobile ? ECOSYSTEM_CONSTANTS.BASE_HEIGHT_MOBILE : ECOSYSTEM_CONSTANTS.BASE_HEIGHT_DESKTOP;
  const minRadius = baseHeight * 0.3;
  const maxRadius = baseHeight * 0.45;
  // Scale radius based on number of solutions (more solutions = larger radius)
  const radiusMultiplier = Math.min(
    1 + (solutions.length - 5) * ECOSYSTEM_CONSTANTS.RADIUS_SCALE_FACTOR,
    ECOSYSTEM_CONSTANTS.RADIUS_MULTIPLIER_MAX
  );
  const radius = Math.min(minRadius * radiusMultiplier, maxRadius);
  const containerHeight = Math.max(baseHeight, radius * 2.5); // Ensure container is tall enough
  
  const nodes = solutions.map((solution, index) => ({
    icon: getIconComponent(solution.iconName, undefined, 32),
    label: solution.title,
    angle: index * angleStep, // Start from top (0 degrees) and distribute evenly
    id: solution.id
  }));

  return (
    <div className="py-24 bg-gradient-to-b from-timo-dark to-[#0f0f0f] relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-timo-accent/5 rounded-full blur-[80px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Eén Geïntegreerd Ecosysteem</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Geen lappendeken van losse applicaties, maar een volledig gesynchroniseerde data-omgeving. Onze apps worden real-time gevoed door één centrale intelligentie: de "Single Source of Truth". Wijzigt u iets in de inkoop? Dan is het direct verwerkt in uw logistiek en financiën.
          </p>
        </div>

        {/* Dynamic height container */}
        <div 
            className="relative w-full flex items-center justify-center transition-all duration-300"
            style={{ height: `${containerHeight}px` }}
        >
          
          {/* Central Node */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="absolute z-20 w-32 h-32 md:w-40 md:h-40 bg-black border-2 border-timo-accent rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.3)]"
          >
            <Database className="w-10 h-10 md:w-12 md:h-12 text-timo-accent mb-2" />
            <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider text-center">Centrale<br/>Ecosysteem</span>
          </motion.div>

          {/* Connecting Lines Animation */}
          <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
             {nodes.map((node, i) => (
                 <motion.line
                    key={`line-${node.id}`}
                    x1="50%"
                    y1="50%"
                    x2="50%"
                    y2="15%" 
                    stroke="rgba(6, 182, 212, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="10 10"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    style={{ transformOrigin: '50% 50%', transform: `rotate(${node.angle}deg)` }}
                 />
             ))}
          </svg>

          {/* Satellite Nodes */}
          {nodes.map((node, i) => (
              <SatelliteNode 
                key={node.id}
                icon={node.icon}
                label={node.label}
                angle={node.angle}
                radius={radius}
                delay={0.6 + (i * 0.1)}
              />
          ))}

        </div>
      </div>
    </div>
  );
};

const SatelliteNode: React.FC<{ icon: React.ReactNode; label: string; angle: number; radius: number; delay: number }> = ({ icon, label, angle, radius, delay }) => {
    // Math: 0 deg (Top) -> (0, -r). Formula: x = r * sin(deg), y = -r * cos(deg)
    const angleRad = (angle * Math.PI) / 180;
    const x = radius * Math.sin(angleRad);
    const y = -radius * Math.cos(angleRad);

    const handleClick = () => {
        if (label === 'Timo Fleet') {
            window.open('https://www.timofleet.nl/', '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0, x: "-50%", y: "-40px" }}
            whileInView={{ scale: 1, opacity: 1, x: "-50%", y: "-40px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={`absolute flex flex-col items-center z-20 ${label === 'Timo Fleet' ? 'cursor-pointer' : ''}`}
            style={{ 
                left: `calc(50% + ${x}px)`, 
                top: `calc(50% + ${y}px)`,
            }}
            onClick={handleClick}
        >
            <div 
                className="w-20 h-20 bg-timo-card border border-gray-700 rounded-2xl flex items-center justify-center mb-3 shadow-xl group hover:border-timo-accent transition-colors duration-300"
            >
                <div className="text-gray-300 group-hover:text-timo-accent transition-colors">
                    {icon}
                </div>
            </div>
            <span className="text-white font-medium tracking-wide bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 whitespace-nowrap text-sm md:text-base">
                {label}
            </span>
        </motion.div>
    )
}

export default Ecosystem;