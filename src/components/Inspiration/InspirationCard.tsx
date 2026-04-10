import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface InspirationCardProps {
  data: {
    type: 'thought' | 'snippet' | 'quote';
    content: string;
    author?: string;
  };
  initialX: number;
  initialY: number;
  initialRotate: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const InspirationCard: React.FC<InspirationCardProps> = ({ 
  data, 
  initialX, 
  initialY, 
  initialRotate,
  containerRef
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const zIndex = isFocused ? 50 : 10;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'thought': return { color: 'var(--accent-primary)', bg: '210 20% 45%' };
      case 'snippet': return { color: '160 15% 45%', bg: '160 15% 45%' };
      case 'quote': return { color: 'var(--accent-secondary)', bg: '35 25% 60%' };
      default: return { color: 'var(--accent-primary)', bg: '210 20% 45%' };
    }
  };

  const theme = getTypeStyles(data.type);

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={true}
      dragTransition={{ power: 0.2, timeConstant: 200 }}
      whileHover={{ 
        scale: 1.02, 
        rotate: initialRotate + (Math.random() * 4 - 2),
        boxShadow: `0 20px 40px -15px hsla(${theme.bg}, 0.15)`
      }}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      initial={{ 
        x: initialX, 
        y: initialY, 
        rotate: initialRotate, 
        opacity: 0,
        scale: 0.9 
      }}
      animate={{ 
        opacity: 1, 
        scale: 1 
      }}
      onPointerDown={() => setIsFocused(true)}
      onPointerUp={() => setIsFocused(false)}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        opacity: { duration: 0.8 }
      }}
      className="absolute p-6 md:p-8 rounded-sm bg-bg-base/80 backdrop-blur-md border border-border-muted shadow-sm cursor-grab select-none max-w-[280px] md:max-w-md transition-all duration-500"
      style={{ 
        zIndex,
        borderLeft: `2px solid hsla(${theme.bg}, 0.3)` 
      }}
    >
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center opacity-40">
          <span className="text-[8px] uppercase tracking-[0.4em] font-sans" style={{ color: `hsl(${theme.bg})` }}>
            {data.type}
          </span>
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: `hsl(${theme.bg})` }}></div>
        </div>
        
        <p className={`font-serif text-[15px] md:text-[17px] leading-relaxed text-text-main ${data.type === 'snippet' ? 'font-mono text-[13px] bg-accent/5 p-4 rounded-xs border border-accent/5' : ''}`}>
          {data.type === 'quote' ? `“${data.content}”` : data.content}
        </p>
        
        {data.author && (
          <span className="text-[9px] uppercase tracking-[0.2em] text-right opacity-40 font-sans italic" style={{ color: `hsl(${theme.bg})` }}>
            — {data.author}
          </span>
        )}
      </div>
    </motion.div>
  );
};
