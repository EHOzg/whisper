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

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={true}
      dragTransition={{ power: 0.2, timeConstant: 200 }}
      whileHover={{ scale: 1.02, rotate: initialRotate + (Math.random() * 4 - 2) }}
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
      className={`absolute p-6 md:p-8 rounded-sm bg-[#FDFDFB]/80 backdrop-blur-sm border border-black/5 shadow-sm cursor-grab select-none max-w-[280px] md:max-w-md transition-shadow hover:shadow-xl`}
      style={{ zIndex }}
    >
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center opacity-30">
          <span className="text-[8px] uppercase tracking-[0.4em] font-sans">
            {data.type}
          </span>
          <div className="w-1 h-1 rounded-full bg-black"></div>
        </div>
        
        <p className={`font-serif text-[15px] md:text-[17px] leading-relaxed text-text-main ${data.type === 'snippet' ? 'font-mono text-[13px] bg-black/5 p-4 rounded-xs' : ''}`}>
          {data.type === 'quote' ? `“${data.content}”` : data.content}
        </p>
        
        {data.author && (
          <span className="text-[9px] uppercase tracking-[0.2em] text-right opacity-40 font-sans italic">
            — {data.author}
          </span>
        )}
      </div>
    </motion.div>
  );
};
